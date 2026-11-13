// A pinned browser bundle of the official Netlify Identity client.
let identity;
let settings;
let mode = 'login';
let busy = false;
let ready = false;
window.accountRecovery = false;
const el = id => document.getElementById(id);
const message = text => { el('auth-status').textContent = text; };

function controls() {
  el('email-auth-submit').disabled = busy || !ready;
  el('google-auth').disabled = busy || !ready || !settings?.providers?.google;
  el('email-auth-submit').textContent = busy ? 'جارٍ المتابعة…' : ({login:'تسجيل الدخول',signup:'إنشاء حساب وإرسال رابط التأكيد',forgot:'إرسال رابط استعادة كلمة المرور',reset:'حفظ كلمة المرور الجديدة'}[mode]);
  el('auth-signup-tab').disabled = busy || !!settings?.disableSignup;
  el('auth-login-tab').disabled = busy;
  el('auth-forgot').disabled = busy;
}

window.setAuthMode = next => {
  if (busy || mode === 'reset' && next !== 'reset') return;
  mode = next;
  el('auth-password').value = '';
  const passwordNeeded = next !== 'forgot';
  el('auth-password-field').classList.toggle('hidden', !passwordNeeded);
  el('auth-password').required = passwordNeeded;
  el('auth-password').minLength = next === 'signup' || next === 'reset' ? 10 : 1;
  el('auth-password').autocomplete = next === 'login' ? 'current-password' : 'new-password';
  el('auth-email-field').classList.toggle('hidden', next === 'reset');
  el('auth-email').required = next !== 'reset';
  el('auth-signup-help').classList.toggle('hidden', next !== 'signup');
  el('auth-forgot').classList.toggle('hidden', next !== 'login');
  el('email-auth-title').textContent = ({login:'تسجيل الدخول بالبريد الإلكتروني',signup:'إنشاء حساب جديد',forgot:'استعادة كلمة المرور',reset:'اختر كلمة مرور جديدة'}[next]);
  ['login','signup'].forEach(tab => {
    el(`auth-${tab}-tab`).setAttribute('aria-pressed', String(next === tab));
    el(`auth-${tab}-tab`).classList.toggle('bg-sky-100', next === tab);
  });
  message('');
  controls();
};

function errorMessage(error) {
  if (error?.status === 429) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.';
  if (error?.status === 401) return 'تحقق من البريد وكلمة المرور، ومن تأكيد بريدك الإلكتروني.';
  if (error?.status === 403) return 'تعذر إكمال الطلب. تحقق من تأكيد البريد أو تواصل مع إدارة الموقع.';
  return 'تعذر إكمال الطلب. تحقق من الاتصال والبيانات ثم حاول مرة أخرى.';
}

async function acceptUser(user, open = true) {
  window.applyAccountSession(user);
  if (user && open) window.openAccountModal();
}

window.startSocialOnboarding = async () => {
  if (busy || !ready) return;
  if (!settings?.providers?.google) {
    message('الدخول عبر Google غير متاح حالياً. يمكنك استخدام البريد الإلكتروني.');
    return;
  }
  busy = true;
  controls();
  try { identity.oauthLogin('google'); }
  catch (error) { message(errorMessage(error)); busy = false; controls(); }
};

el('email-auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !ready) return;
  busy = true;
  controls();
  message('');
  const email = el('auth-email').value.trim();
  const password = el('auth-password').value;
  try {
    if (mode === 'signup') {
      if (settings.disableSignup) throw new Error('Registration closed');
      const user = await identity.signup(email, password);
      if (user.emailVerified) await acceptUser(user);
      else message('تحقق من بريدك الإلكتروني واضغط رابط التأكيد لإكمال إنشاء الحساب. تحقق أيضاً من البريد غير المرغوب فيه.');
    } else if (mode === 'forgot') {
      await identity.requestPasswordRecovery(email);
      message('إذا كان البريد مسجلاً، تصلك رسالة تحتوي على رابط استعادة كلمة المرور. تحقق أيضاً من البريد غير المرغوب فيه.');
    } else if (mode === 'reset') {
      await identity.updateUser({password});
      window.accountRecovery = false;
      mode = 'login';
      await acceptUser(await identity.getUser());
      message('تم تحديث كلمة المرور بنجاح.');
    } else {
      await acceptUser(await identity.login(email, password));
      message('تم تسجيل الدخول بنجاح.');
    }
    el('auth-password').value = '';
  } catch (error) { message(errorMessage(error)); }
  finally {
    busy = false;
    if (mode === 'login' && el('auth-email-field').classList.contains('hidden')) {
      const status = el('auth-status').textContent;
      window.setAuthMode('login');
      message(status);
    }
    controls();
  }
});

el('email-auth-submit').disabled = true;
message('جارٍ تجهيز تسجيل الدخول…');
try {
  identity = await import('https://esm.sh/@netlify/identity@2.0.1?bundle');
  window.accountAuth = {
    async refresh() { await identity.refreshSession(); },
    async saveProfile(profile) {
      if (!await identity.getUser()) throw new Error('Sign in required');
      const user = await identity.updateUser({data:{child_profile:profile}});
      window.applyAccountSession(user);
    },
    async logout() {
      await identity.logout();
      window.applyAccountSession(null);
    }
  };
  identity.onAuthChange((event, user) => {
    window.applyAccountSession(user);
    if (event === 'logout') {
      window.accountRecovery = false;
      mode = 'login';
      window.setAuthMode('login');
      window.openAccountModal();
    }
  });
  const callback = await identity.handleAuthCallback();
  settings = await identity.getSettings();
  ready = true;
  window.setAuthMode('login');
  window.accountRecovery = callback?.type === 'recovery';
  await acceptUser(await identity.getUser(), !!callback);
  if (callback?.type === 'recovery') {
    window.accountRecovery = true;
    el('auth-step-login').classList.remove('hidden');
    el('auth-step-profile').classList.add('hidden');
    el('auth-step-onboarding').classList.add('hidden');
    window.setAuthMode('reset');
    el('auth-password').focus();
  } else if (callback?.type === 'confirmation') {
    message('تم تأكيد البريد الإلكتروني وتسجيل الدخول.');
  }
  el('google-auth').classList.toggle('hidden', !settings.providers.google);
} catch (error) {
  message('تسجيل الدخول غير متاح مؤقتاً. أعد تحميل الصفحة للمحاولة مجدداً.');
  // Clear callback credentials from the address bar even when validation fails.
  if (/access_token|confirmation_token|recovery_token|error=/.test(location.hash)) {
    history.replaceState(null, '', location.pathname + location.search);
  }
} finally { controls(); }
