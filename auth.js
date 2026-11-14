/* ===================== نظام الحسابات (Firebase Authentication) =====================
   1) Google: نافذة منبثقة أولاً، ثم تحويل (redirect) تلقائي عند الفشل.
   2) البريد + كلمة المرور: مع رابط تأكيد واستعادة كلمة المرور.
   3) يكشف window.GK_FB (Firestore) لملف library.js، ويحدد هل المستخدم مدير (admins/{uid}).
   حل مشكلة "الرجوع بدون تسجيل دخول": استخدم نطاقك أنت كـ authDomain (انظر OWN_AUTH_HOSTS)
   مع قواعد rewrites الموجودة في vercel.json، فلا يعتمد الدخول على تخزين طرف ثالث.
============================================================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyByWIdS54R0zc3m17_xnNM1_wnQTi0S6xA",
  authDomain: "goodykido-trexh.firebaseapp.com",
  projectId: "goodykido-trexh",
  storageBucket: "goodykido-trexh.firebasestorage.app",
  messagingSenderId: "19305135521",
  appId: "1:19305135521:web:b8ce65493aafa582b21fe0"
};
/* النطاقات التي تعمل عليها قواعد /__/auth في vercel.json.
   مهم: أضف https://<النطاق>/__/auth/handler إلى Authorized redirect URIs في Google Cloud Console (OAuth client). */
const OWN_AUTH_HOSTS = ['goodykido.vercel.app'];
if (OWN_AUTH_HOSTS.includes(location.host)) FIREBASE_CONFIG.authDomain = location.host;

const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
const $ = id => document.getElementById(id);
const toast = m => { try { showToast(m); } catch (e) {} };
const MIN_PW = 10;
const PENDING = 'gk_redirect_pending';
let mode = 'login', ready = false, auth = null, db = null, M = {}, FS = null;

function status(msg, kind) {
  const el = $('auth-status'); if (!el) return;
  el.textContent = msg || '';
  el.className = 'text-sm font-bold my-4 ' + (kind === 'error' ? 'text-red-600' : kind === 'ok' ? 'text-green-700' : 'text-slate-700');
}
function busy(b) {
  ['google-auth', 'email-auth-submit'].forEach(id => { const e = $(id); if (e) { e.disabled = !!b; e.classList.toggle('opacity-60', !!b); } });
}
function errText(e) {
  const c = (e && e.code) || '';
  if (/invalid-credential|user-not-found|wrong-password|invalid-login/.test(c)) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (c.includes('email-already-in-use')) return 'هذا البريد مسجّل مسبقاً. استخدم تسجيل الدخول أو جرّب Google';
  if (c.includes('weak-password')) return `كلمة المرور ضعيفة. استخدم ${MIN_PW} أحرف على الأقل`;
  if (c.includes('invalid-email')) return 'صيغة البريد الإلكتروني غير صحيحة';
  if (c.includes('too-many-requests')) return 'محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً';
  if (c.includes('network-request-failed')) return 'تحقق من اتصالك بالإنترنت';
  if (c.includes('popup-blocked')) return 'المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة لهذا الموقع ثم أعد المحاولة';
  if (c.includes('cancelled-popup-request')) return '';
  if (/missing-initial-state|web-storage-unsupported/.test(c + ((e && e.message) || ''))) return 'متصفحك يحظر التخزين اللازم للدخول بـ Google. جرّب Chrome/Safari أو عطّل حماية Brave لهذا الموقع (Shields)';
  if (c.includes('popup-closed-by-user')) return 'تم إغلاق نافذة Google قبل إكمال الدخول';
  if (c.includes('unauthorized-domain')) return 'هذا النطاق غير مضاف في Firebase ← Authentication ← Settings ← Authorized domains';
  if (c.includes('operation-not-allowed')) return 'هذه الطريقة غير مفعّلة في Firebase ← Authentication ← Sign-in method';
  if (c.includes('redirect-uri-mismatch') || /redirect_uri_mismatch/.test((e && e.message) || '')) return 'عنوان الرجوع غير مضاف في Google Cloud ← OAuth client ← Authorized redirect URIs';
  return 'حدث خطأ: ' + ((e && e.message) || c || 'غير معروف');
}

/* ---------- تبويبات: دخول / إنشاء حساب / نسيت كلمة المرور ---------- */
const MODES = {
  login:  { title: 'تسجيل الدخول بالبريد الإلكتروني', submit: 'تسجيل الدخول',        ac: 'current-password' },
  signup: { title: 'إنشاء حساب بالبريد الإلكتروني',   submit: 'إنشاء الحساب',         ac: 'new-password' },
  forgot: { title: 'استعادة كلمة المرور',             submit: 'إرسال رابط الاستعادة', ac: 'current-password' }
};
window.setAuthMode = function (m) {
  mode = MODES[m] ? m : 'login';
  const cfg = MODES[mode];
  $('email-auth-title').textContent = cfg.title;
  $('email-auth-submit').textContent = cfg.submit;
  $('auth-password-field').classList.toggle('hidden', mode === 'forgot');
  $('auth-password').required = mode !== 'forgot';
  $('auth-password').autocomplete = cfg.ac;
  $('auth-signup-help').classList.toggle('hidden', mode !== 'signup');
  $('auth-forgot').classList.toggle('hidden', mode === 'forgot');
  [['auth-login-tab', 'login'], ['auth-signup-tab', 'signup']].forEach(([id, k]) => {
    const b = $(id); b.setAttribute('aria-pressed', String(mode === k)); b.classList.toggle('bg-sky-100', mode === k);
  });
  status('');
};

/* ---------- حفظ ملف الطفل (Firestore + نسخة محلية) ---------- */
const lsKey = uid => 'goodykido_profile_' + uid;
async function loadProfile(uid) {
  try {
    const s = await FS.getDoc(FS.doc(db, 'users', uid));
    if (s.exists() && s.data().child_profile) { localStorage.setItem(lsKey(uid), JSON.stringify(s.data().child_profile)); return s.data().child_profile; }
  } catch (e) { console.warn('Firestore read failed:', e.message); }
  try { return JSON.parse(localStorage.getItem(lsKey(uid)) || 'null'); } catch (e) { return null; }
}
async function saveProfile(p) {
  const u = auth && auth.currentUser; if (!u) throw new Error('not signed in');
  localStorage.setItem(lsKey(u.uid), JSON.stringify(p));
  try { await FS.setDoc(FS.doc(db, 'users', u.uid), { child_profile: p, email: u.email || '', updatedAt: Date.now() }, { merge: true }); }
  catch (e) { console.warn('Firestore sync failed (saved on this device only):', e.message); }
}
window.accountAuth = { saveProfile, logout: async () => { if (auth) await M.signOut(auth); window.applyAccountSession(null); } };

/* ---------- هل المستخدم مدير؟ (وثيقة admins/{uid} تُنشأ يدوياً من Firebase Console) ---------- */
async function checkAdmin(user) {
  let ok = false;
  if (user && FS) {
    try { ok = (await FS.getDoc(FS.doc(db, 'admins', user.uid))).exists(); } catch (e) { console.warn('admin check failed:', e.message); }
  }
  window.GK_isAdmin = ok;
  window.dispatchEvent(new Event('gk-admin'));
}

/* ---------- Google ---------- */
window.startSocialOnboarding = async function () {
  /* signInWithPopup يجب أن يُستدعى مباشرة داخل نقرة المستخدم (بدون await قبله) كي لا يمنعه المتصفح */
  if (!ready) { const m = 'خدمة الحسابات لم تجهز بعد. انتظر لحظة وأعد المحاولة، أو أعد تحميل الصفحة.'; status(m, 'error'); toast(m); return; }
  busy(true); status('جارٍ فتح نافذة Google…');
  const provider = new M.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await M.signInWithPopup(auth, provider);
    status('');
  } catch (e) {
    let err = e;
    const c = (e && e.code) || '';
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(c)) {
      status('المتصفح منع النافذة المنبثقة، سننقلك إلى صفحة Google…');
      try {
        localStorage.setItem(PENDING, String(Date.now()));       // علامة: بدأنا تحويلاً ونتوقع نتيجة عند الرجوع
        await M.signInWithRedirect(auth, provider);
        return;
      } catch (e2) { localStorage.removeItem(PENDING); err = e2; }
    }
    const msg = errText(err);
    console.error('Google sign-in failed:', err);
    if (msg) { status(msg + (err && err.code ? ` (${err.code})` : ''), 'error'); toast(msg); } else status('');
  } finally { busy(false); }
};

/* ---------- بريد + كلمة مرور ---------- */
async function onSubmit(ev) {
  ev.preventDefault();
  if (!ready) { status('خدمة الحسابات لم تجهز بعد. أعد تحميل الصفحة.', 'error'); return; }
  const email = $('auth-email').value.trim(), pw = $('auth-password').value;
  busy(true); status('');
  try {
    if (mode === 'forgot') {
      await M.sendPasswordResetEmail(auth, email);
      status('إذا كان البريد مسجّلاً، أرسلنا إليه رابط استعادة كلمة المرور.', 'ok');
    } else if (mode === 'signup') {
      if (pw.length < MIN_PW) { status(`كلمة المرور يجب أن تكون ${MIN_PW} أحرف على الأقل`, 'error'); return; }
      const cred = await M.createUserWithEmailAndPassword(auth, email, pw);
      await M.sendEmailVerification(cred.user);
      await M.signOut(auth);
      window.setAuthMode('login'); $('auth-password').value = '';
      status('تم إنشاء الحساب ✓ أرسلنا رابط تأكيد إلى بريدك. افتحه ثم سجّل الدخول لإكمال بيانات طفلك.', 'ok');
    } else {
      const cred = await M.signInWithEmailAndPassword(auth, email, pw);
      if (!cred.user.emailVerified) {
        await M.sendEmailVerification(cred.user).catch(() => {});
        await M.signOut(auth);
        status('يجب تأكيد بريدك أولاً. أعدنا إرسال رابط التأكيد إلى بريدك.', 'error');
      }
    }
  } catch (e) { status(errText(e), 'error'); }
  finally { busy(false); }
}

/* ---------- تشغيل الخدمة ---------- */
function showSetupNotice(text) {
  const box = $('auth-step-login'); if (!box || $('auth-setup-notice')) return;
  const d = document.createElement('div');
  d.id = 'auth-setup-notice'; d.className = 'mb-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-3 text-xs font-bold text-start';
  d.textContent = text; box.prepend(d);
}

function showRedirectProblem(msg) {
  status(msg, 'error'); toast(msg);
  try { openAccountModal(true); } catch (e) {}
}

async function init() {
  window.setAuthMode('login');
  $('email-auth-form').addEventListener('submit', onSubmit);
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    showSetupNotice('لم يتم ربط خدمة الحسابات بعد. ألصق إعدادات Firebase داخل FIREBASE_CONFIG في auth.js.');
    return;
  }
  try {
    const [a, b, c] = await Promise.all([import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-firestore.js')]);
    Object.assign(M, b); FS = c;
    const app = a.initializeApp(FIREBASE_CONFIG);
    // تخزين دائم متعدد الطبقات: IndexedDB ثم localStorage ثم sessionStorage (يحافظ على الجلسة بعد التحويل)
    try {
      auth = b.initializeAuth(app, {
        persistence: [b.indexedDBLocalPersistence, b.browserLocalPersistence, b.browserSessionPersistence],
        popupRedirectResolver: b.browserPopupRedirectResolver
      });
    } catch (e) { auth = b.getAuth(app); }
    try { db = c.initializeFirestore(app, { experimentalAutoDetectLongPolling: true }); }
    catch (e) { db = c.getFirestore(app); }
  } catch (e) {
    showSetupNotice('تعذر تحميل خدمة الحسابات. تحقق من اتصالك بالإنترنت ثم أعد تحميل الصفحة.');
    window.dispatchEvent(new CustomEvent('gk-fb-error', { detail: e }));
    console.error(e); return;
  }
  // Firestore جاهز للمكتبة العامة (القراءة لا تحتاج تسجيل دخول)
  window.GK_FB = { db, fs: FS };
  window.dispatchEvent(new Event('gk-fb-ready'));

  ready = true; window.__authReady = true; busy(false);

  /* 1) انتظر نتيجة التحويل قبل أي شيء آخر */
  let redirectUser = null;
  try {
    const r = await M.getRedirectResult(auth);
    if (r && r.user) redirectUser = r.user;
    else if (localStorage.getItem(PENDING)) {
      await auth.authStateReady();                      // هل استعاد Firebase الجلسة بطريقة أخرى؟
      if (auth.currentUser) redirectUser = auth.currentUser;
      else showRedirectProblem('رجعنا من Google لكن المتصفح لم يحفظ حالة الدخول (غالباً بسبب حظر التخزين في Brave/Safari). جرّب السماح بالنوافذ المنبثقة ثم اضغط Google مجدداً، أو عطّل Shields لهذا الموقع.');
    }
  } catch (e) {
    console.error('getRedirectResult failed:', e);
    const m = errText(e); if (m) showRedirectProblem(m + (e && e.code ? ` (${e.code})` : ''));
  } finally { localStorage.removeItem(PENDING); }

  /* 2) ثم راقب حالة الدخول: تحدّث الواجهة فوراً */
  M.onAuthStateChanged(auth, async user => {
    const emailOnly = user && user.providerData.length && user.providerData.every(p => p.providerId === 'password');
    if (!user || (emailOnly && !user.emailVerified)) { await checkAdmin(null); window.applyAccountSession(null); return; }
    await checkAdmin(user);
    const profile = await loadProfile(user.uid);
    window.applyAccountSession({
      uid: user.uid, email: user.email, name: user.displayName || '',
      provider: user.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email',
      userMetadata: { child_profile: profile }
    });
    const modalOpen = !$('account-modal').classList.contains('hidden');
    if (!profile) {                        // الخطوة الإلزامية: اسم الطفل + سنة الميلاد
      status(''); openAccountModal(true);
    } else if (modalOpen && !$('auth-step-login').classList.contains('hidden')) {
      closeAccountModal(); toast(`أهلاً بعودتك! ملف ${profile.name} جاهز 🌟`);
    } else if (redirectUser && redirectUser.uid === user.uid) {
      toast(`أهلاً بعودتك! ملف ${profile.name} جاهز 🌟`);
    }
  });
}
init().catch(e => { console.error(e); status('تعذر تشغيل خدمة الحسابات: ' + (e && e.message || e), 'error'); });
