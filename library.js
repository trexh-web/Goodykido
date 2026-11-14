/* ===================== المكتبة العامة (Firestore) + YouTube =====================
   - القنوات والفيديوهات تُحفظ في Firestore:  public_channels  و  public_videos
   - الجميع (حتى الزوار) يقرؤونها لحظياً عبر onSnapshot.
   - النشر/الحذف/التعديل للمديرين فقط (وثيقة admins/{uid}) — انظر firestore.rules.
   - مفتاح YouTube API يبقى في متصفح المدير فقط (localStorage) ولا يُرفع لأي مكان.
   - أسماء الفيديوهات تُجلب تلقائياً (oEmbed)، والقنوات الكاملة عبر YouTube Data API v3.
================================================================================ */
(function () {
  'use strict';
  const KEY_KEY = 'goodykido_yt_api_key';
  const YT_API_KEY_DEFAULT = '';
  const SYNC_EVERY = 15 * 60 * 1000;
  const MAX_IMPORT = 1000;
  const COL_CH = 'public_channels', COL_VID = 'public_videos';
  const FLAGS = { ar: '🇸🇦', en: '🇬🇧', fr: '🇫🇷', tr: '🇹🇷', es: '🇪🇸', ckb: '☀️' };

  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = m => { try { showToast(m); } catch (e) { console.log(m); } };
  if (typeof window.escapeHTML !== 'function') window.escapeHTML = esc;

  /* ---------- حالة المكتبة (مرآة لما في Firestore) ---------- */
  let lib = { channels: [], videos: [] };
  let unsubs = [], gotCh = false, gotVid = false, syncTimer = null, openedFromUrl = false;
  const getKey = () => (localStorage.getItem(KEY_KEY) || YT_API_KEY_DEFAULT || '').trim();
  const sortKey = v => Date.parse(v.publishedAt || v.addedAt || '') || 0;
  const isAdmin = () => !!window.GK_isAdmin;

  /* ---------- helpers ---------- */
  function langFromCode(code) {
    const raw = String(code || '').toLowerCase();
    if (raw === 'ckb' || raw.indexOf('ckb-') === 0) return 'ckb';
    const c = raw.slice(0, 2);
    return LANG_TAGS[c] ? c : '';
  }
  function setStatus(id, msg, kind) {
    const el = $(id); if (!el) return;
    if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
    el.className = 'text-xs font-black mb-3 ' + (kind === 'error' ? 'text-red-600' : kind === 'ok' ? 'text-green-700' : 'text-slate-700');
    el.textContent = msg;
  }
  function setBtn(id, enabled) {
    const b = $(id); if (!b) return;
    b.disabled = !enabled;
    b.classList.toggle('opacity-50', !enabled);
  }
  function parseYT(raw) {
    raw = (raw || '').trim(); if (!raw) return null;
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    let u; try { u = new URL(raw); } catch (e) { return null; }
    const host = u.hostname.replace(/^(www|m|music)\./, '');
    const ID = /^[\w-]{11}$/;
    if (host === 'youtu.be') { const id = u.pathname.slice(1).split('/')[0]; return ID.test(id) ? { type: 'video', id } : null; }
    if (host !== 'youtube.com') return null;
    const p = u.pathname.split('/').filter(Boolean);
    if (p[0] === 'watch') { const id = u.searchParams.get('v') || ''; return ID.test(id) ? { type: 'video', id } : null; }
    if (['shorts', 'embed', 'live', 'v'].includes(p[0]) && ID.test(p[1] || '')) return { type: 'video', id: p[1] };
    if (p[0] && p[0][0] === '@') return { type: 'channel', kind: 'handle', value: decodeURIComponent(p[0]) };
    if (p[0] === 'channel' && p[1]) return { type: 'channel', kind: 'id', value: p[1] };
    if (p[0] === 'user' && p[1]) return { type: 'channel', kind: 'user', value: p[1] };
    if (p[0] === 'c' && p[1]) return { type: 'channel', kind: 'custom', value: decodeURIComponent(p[1]) };
    return null;
  }
  async function api(path, params) {
    const key = getKey();
    if (!key) throw new Error('NO_KEY');
    const u = new URL('https://www.googleapis.com/youtube/v3/' + path);
    Object.entries(Object.assign({}, params, { key })).forEach(([k, v]) => u.searchParams.set(k, v));
    const r = await fetch(u.toString());
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status));
    return j;
  }

  /* ================= Firestore ================= */
  const FBR = () => window.GK_FB || null;
  const clean = o => JSON.parse(JSON.stringify(o));      // يزيل undefined (Firestore لا يقبلها)
  function writeErr(e) {
    const c = (e && e.code) || '';
    if (c.includes('permission-denied')) return 'لا تملك صلاحية النشر. يجب أن يكون حسابك مديراً (admins/uid في Firestore).';
    if (c.includes('unavailable') || c.includes('network')) return 'تعذر الاتصال بقاعدة البيانات. تحقق من الإنترنت.';
    return 'خطأ في قاعدة البيانات: ' + ((e && e.message) || c);
  }
  async function commit(ops) {        // ops: [{ t: 'set'|'delete', col, id, data }]
    const F = FBR(); if (!F) throw new Error('قاعدة البيانات غير جاهزة بعد');
    const { db, fs } = F;
    for (let i = 0; i < ops.length; i += 400) {
      const b = fs.writeBatch(db);
      ops.slice(i, i + 400).forEach(o => {
        const ref = fs.doc(db, o.col, o.id);
        if (o.t === 'delete') b.delete(ref); else b.set(ref, clean(o.data), { merge: !!o.merge });
      });
      await b.commit();
    }
  }
  function requireAdmin() {
    if (isAdmin()) return true;
    toast(window.accountAuth && typeof authenticatedUser !== 'undefined' && authenticatedUser
      ? '⚠️ حسابك ليس مديراً، لا يمكنه نشر القنوات والفيديوهات.'
      : '⚠️ سجّل الدخول بحساب المدير أولاً لنشر المحتوى.');
    return false;
  }

  function stopListening() { unsubs.forEach(u => { try { u(); } catch (e) {} }); unsubs = []; }
  function startListening() {
    const F = FBR(); if (!F) return;
    const { db, fs } = F;
    stopListening(); gotCh = gotVid = false;
    libStatus('جارٍ تحميل المكتبة العامة…');
    const onErr = e => {
      console.error('library listener error:', e);
      libStatus('تعذر تحميل المكتبة العامة. ' + ((e && e.code === 'permission-denied') ? 'تحقق من قواعد Firestore (القراءة العامة).' : 'تحقق من الاتصال.'));
      const r = $('library-retry'); if (r) r.classList.remove('hidden');
    };
    unsubs.push(fs.onSnapshot(fs.collection(db, COL_CH), s => {
      lib.channels = s.docs.map(d => d.data()).sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
      gotCh = true; onData();
    }, onErr));
    unsubs.push(fs.onSnapshot(fs.collection(db, COL_VID), s => {
      lib.videos = s.docs.map(d => d.data());
      gotVid = true; onData();
    }, onErr));
  }
  function onData() {
    if (!gotCh || !gotVid) return;
    if (typeof videos !== 'undefined') {                      // نحدّث المصفوفة العامة في index.html
      videos.length = 0;
      lib.videos.forEach(v => videos.push(v));
      videos.sort((a, b) => sortKey(b) - sortKey(a));
    }
    refreshAll();
    openFromUrl();
  }
  function libStatus(m) { const st = $('library-status'); if (st) st.textContent = m; }

  window.loadLibrary = function () {           // زر "إعادة المحاولة"
    if (FBR()) startListening(); else location.reload();
  };
  window.addEventListener('gk-fb-ready', startListening);
  window.addEventListener('gk-fb-error', () => {
    libStatus('تعذر الاتصال بخدمة المكتبة. تحقق من الإنترنت ثم أعد المحاولة.');
    const r = $('library-retry'); if (r) r.classList.remove('hidden');
  });
  window.addEventListener('gk-admin', () => { updateAdminUI(); window.renderAdminVideoList(); if (isAdmin()) setTimeout(() => syncAll(false), 1500); });
  if (FBR()) startListening();

  /* ---------- مشاركة فتح فيديو برابط ?v=ID ---------- */
  window.shareVideo = async function (id) {
    const v = (typeof videos !== 'undefined' ? videos : []).find(x => x.id === id);
    const url = location.origin + '/?v=' + encodeURIComponent(id);
    try {
      if (navigator.share) { await navigator.share({ title: v ? v.title : 'Goodykido', url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); toast('تم نسخ الرابط ✓'); }
    catch (e) { prompt('انسخ الرابط:', url); }
  };
  function openFromUrl() {
    if (openedFromUrl) return; openedFromUrl = true;
    const id = new URLSearchParams(location.search).get('v');
    if (id && typeof videos !== 'undefined' && videos.some(v => v.id === id)) openSafePlayerById(id);
  }

  /* ---------- نظام اللغات (chips) ---------- */
  function renderChips(boxId, hiddenId, selected, onChange) {
    const box = $(boxId); if (!box) return;
    $(hiddenId).value = selected || '';
    box.innerHTML = Object.keys(LANG_TAGS).map(c =>
      `<button type="button" data-lang="${c}" class="cartoon-btn px-3 py-2 rounded-2xl font-black text-sm ${c === selected ? 'bg-sunYellow' : 'bg-white'}">${FLAGS[c] || '🌐'} ${esc(LANG_TAGS[c].name)}</button>`).join('');
    box.querySelectorAll('button').forEach(b => b.onclick = () => {
      renderChips(boxId, hiddenId, b.dataset.lang, onChange);
      if (onChange) onChange();
    });
  }

  /* ================= VIDEO ================= */
  let pendingVideo = null, vTok = 0, vTimer = null;

  async function fetchVideoInfo(id) {
    const info = { youtubeId: id, title: '', channel: '', channelId: '', suggestedLang: '', blocked: false, thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg` };
    const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id));
    if (!r.ok) throw new Error(r.status === 404 ? 'NOT_FOUND' : 'NOT_ALLOWED');
    const j = await r.json();
    info.title = j.title || ''; info.channel = j.author_name || '';
    const m = (j.author_url || '').match(/\/channel\/(UC[\w-]+)/);
    info.channelId = m ? m[1] : (j.author_url || '');
    if (getKey()) {
      try {
        const v = await api('videos', { part: 'snippet,status', id });
        const it = v.items && v.items[0];
        if (it) {
          info.channelId = it.snippet.channelId || info.channelId;
          info.suggestedLang = langFromCode(it.snippet.defaultAudioLanguage || it.snippet.defaultLanguage);
          if (it.status && it.status.embeddable === false) info.blocked = true;
        }
      } catch (e) {}
    }
    return info;
  }
  function videoInputChanged() { clearTimeout(vTimer); vTimer = setTimeout(previewVideo, 500); }
  async function previewVideo() {
    const raw = $('new-video-url').value.trim();
    const tok = ++vTok;
    pendingVideo = null; $('video-preview').classList.add('hidden'); setBtn('publish-video', false);
    if (!raw) { setStatus('video-fetch-status', ''); return; }
    const p = parseYT(raw);
    if (!p) { setStatus('video-fetch-status', 'هذا ليس رابط YouTube صالحاً', 'error'); return; }
    if (p.type === 'channel') { setStatus('video-fetch-status', 'هذا رابط قناة. استخدم خانة إضافة القناة أعلاه.', 'error'); return; }
    setStatus('video-fetch-status', 'جارٍ جلب بيانات الفيديو…');
    try {
      const info = await fetchVideoInfo(p.id);
      if (tok !== vTok) return;
      if (info.blocked) { setStatus('video-fetch-status', 'صاحب الفيديو لا يسمح بتضمينه، لذلك لن يعمل داخل الموقع.', 'error'); return; }
      pendingVideo = info;
      $('video-preview-thumb').src = info.thumb;
      $('new-video-title').value = info.title;
      $('new-video-channel').value = info.channel;
      $('video-preview').classList.remove('hidden');
      renderChips('video-lang-chips', 'new-video-lang', info.suggestedLang, refreshVideoBtn);
      $('video-lang-hint').textContent = info.suggestedLang ? 'اقتراح من YouTube — يمكنك تغييرها' : 'اختر لغة الفيديو للمتابعة';
      setStatus('video-fetch-status', 'تم جلب العنوان واسم القناة تلقائياً ✓', 'ok');
      refreshVideoBtn();
    } catch (e) {
      if (tok !== vTok) return;
      setStatus('video-fetch-status', e.message === 'NOT_FOUND' ? 'لم يتم العثور على الفيديو' : 'تعذر جلب الفيديو (قد يكون خاصاً أو غير قابل للتضمين)', 'error');
    }
  }
  function refreshVideoBtn() { setBtn('publish-video', !!(pendingVideo && $('new-video-lang').value)); }

  window.addCustomVideo = async function () {
    const v = pendingVideo; if (!v) return;
    if (!requireAdmin()) return;
    const lang = $('new-video-lang').value;
    if (!lang) { toast('اختر لغة الفيديو أولاً'); return; }
    const id = 'yt_' + v.youtubeId;
    if (lib.videos.some(x => x.id === id)) { toast('هذا الفيديو مضاف من قبل'); return; }
    const rec = { id, youtubeId: v.youtubeId, title: v.title, channel: v.channel, channelId: v.channelId, lang, category: $('new-video-category').value, publishedAt: '', addedAt: new Date().toISOString(), source: 'video' };
    setBtn('publish-video', false);
    try {
      await commit([{ t: 'set', col: COL_VID, id, data: rec }]);
    } catch (e) { toast(writeErr(e)); refreshVideoBtn(); return; }
    $('new-video-url').value = ''; pendingVideo = null;
    $('video-preview').classList.add('hidden'); setStatus('video-fetch-status', '');
    toast('تم نشر الفيديو للجميع ✓');
  };

  /* ================= CHANNEL ================= */
  let pendingChannel = null, cTok = 0, cTimer = null;

  async function resolveChannel(p) {
    const part = 'snippet,contentDetails,statistics';
    let j;
    if (p.kind === 'id') j = await api('channels', { part, id: p.value });
    else if (p.kind === 'handle') j = await api('channels', { part, forHandle: p.value });
    else if (p.kind === 'user') j = await api('channels', { part, forUsername: p.value });
    else {
      const s = await api('search', { part: 'snippet', type: 'channel', q: p.value, maxResults: 1 });
      const it = s.items && s.items[0];
      const id = it && ((it.snippet && it.snippet.channelId) || (it.id && it.id.channelId));
      if (!id) return null;
      j = await api('channels', { part, id });
    }
    const c = j.items && j.items[0]; if (!c) return null;
    const th = (c.snippet.thumbnails || {});
    return {
      id: c.id, title: c.snippet.title, handle: c.snippet.customUrl || '',
      thumb: (th.medium || th.default || {}).url || '',
      uploads: c.contentDetails && c.contentDetails.relatedPlaylists && c.contentDetails.relatedPlaylists.uploads,
      videoCount: Number(c.statistics && c.statistics.videoCount) || 0,
      suggestedLang: langFromCode(c.snippet.defaultLanguage)
    };
  }
  async function keepPlayable(items) {
    const ok = [];
    for (let i = 0; i < items.length; i += 50) {
      const chunk = items.slice(i, i + 50);
      const j = await api('videos', { part: 'status', id: chunk.map(x => x.youtubeId).join(',') });
      const good = new Set((j.items || []).filter(it => it.status && it.status.embeddable !== false && it.status.privacyStatus === 'public').map(it => it.id));
      chunk.forEach(x => { if (good.has(x.youtubeId)) ok.push(x); });
    }
    return ok;
  }
  async function pullUploads(ch, opts) {
    const known = new Set(lib.videos.map(v => v.youtubeId));
    const out = []; let token = '', pages = 0, stop = false;
    while (!stop) {
      const params = { part: 'snippet,contentDetails', playlistId: ch.uploads, maxResults: 50 };
      if (token) params.pageToken = token;
      const j = await api('playlistItems', params);
      const raw = [];
      for (const it of (j.items || [])) {
        const id = it.contentDetails && it.contentDetails.videoId;
        const t = (it.snippet && it.snippet.title) || '';
        if (!id || t === 'Private video' || t === 'Deleted video') continue;
        if (known.has(id)) { if (!opts.full) { stop = true; break; } continue; }
        raw.push({ youtubeId: id, title: t, publishedAt: (it.contentDetails && it.contentDetails.videoPublishedAt) || (it.snippet && it.snippet.publishedAt) || '' });
      }
      (await keepPlayable(raw)).forEach(x => out.push({
        id: 'yt_' + x.youtubeId, youtubeId: x.youtubeId, title: x.title, channel: ch.title, channelId: ch.id,
        lang: ch.lang, category: ch.category, publishedAt: x.publishedAt, addedAt: new Date().toISOString(), source: 'channel'
      }));
      pages++;
      if (opts.onProgress) opts.onProgress(out.length);
      token = j.nextPageToken;
      if (!token || out.length >= MAX_IMPORT || (!opts.full && pages >= 5)) break;
    }
    return out;
  }

  function channelInputChanged() { clearTimeout(cTimer); cTimer = setTimeout(previewChannel, 700); }
  async function previewChannel() {
    const raw = $('new-channel-url').value.trim();
    const tok = ++cTok;
    pendingChannel = null;
    $('channel-preview').classList.add('hidden'); $('channel-options').classList.add('hidden'); setBtn('publish-channel', false);
    if (!raw) { setStatus('channel-fetch-status', ''); return; }
    const p = parseYT(raw);
    if (!p) { setStatus('channel-fetch-status', 'هذا ليس رابط قناة YouTube صالحاً (مثال: youtube.com/@name)', 'error'); return; }
    if (p.type === 'video') { setStatus('channel-fetch-status', 'هذا رابط فيديو. استخدم خانة إضافة الفيديو أدناه.', 'error'); return; }
    if (!getKey()) { setStatus('channel-fetch-status', 'اربط YouTube أولاً بلصق مفتاح API في المربع أعلاه.', 'error'); return; }
    setStatus('channel-fetch-status', 'جارٍ البحث عن القناة…');
    try {
      const ch = await resolveChannel(p);
      if (tok !== cTok) return;
      if (!ch || !ch.uploads) { setStatus('channel-fetch-status', 'لم يتم العثور على القناة', 'error'); return; }
      if (lib.channels.some(c => c.id === ch.id)) { setStatus('channel-fetch-status', 'هذه القناة مضافة من قبل', 'error'); return; }
      pendingChannel = ch;
      $('channel-preview-thumb').src = ch.thumb;
      $('channel-preview-title').textContent = ch.title;
      $('channel-preview-meta').textContent = (ch.handle ? ch.handle + ' • ' : '') + ch.videoCount + ' videos';
      $('channel-preview').classList.remove('hidden'); $('channel-options').classList.remove('hidden');
      renderChips('channel-lang-chips', 'new-channel-lang', ch.suggestedLang, refreshChannelBtn);
      $('channel-lang-hint').textContent = ch.suggestedLang ? 'اقتراح من YouTube — يمكنك تغييرها' : 'اختر لغة القناة للمتابعة';
      setStatus('channel-fetch-status', 'تم العثور على القناة ✓', 'ok');
      refreshChannelBtn();
    } catch (e) {
      if (tok !== cTok) return;
      setStatus('channel-fetch-status', 'خطأ من YouTube: ' + e.message, 'error');
    }
  }
  function refreshChannelBtn() { setBtn('publish-channel', !!(pendingChannel && $('new-channel-lang').value)); }

  window.addChannel = async function () {
    const ch = pendingChannel; if (!ch) return;
    if (!requireAdmin()) return;
    const lang = $('new-channel-lang').value;
    if (!lang) { toast('اختر لغة القناة أولاً'); return; }
    const rec = { id: ch.id, title: ch.title, handle: ch.handle, thumb: ch.thumb, uploads: ch.uploads, lang, category: $('new-channel-category').value, addedAt: Date.now(), lastSync: Date.now() };
    setBtn('publish-channel', false);
    try {
      const vids = await pullUploads(rec, { full: true, onProgress: n => setStatus('channel-fetch-status', `جارٍ جلب الفيديوهات… ${n}`) });
      setStatus('channel-fetch-status', `جارٍ نشر ${vids.length} فيديو…`);
      const ops = [{ t: 'set', col: COL_CH, id: rec.id, data: rec }].concat(vids.map(v => ({ t: 'set', col: COL_VID, id: v.id, data: v })));
      await commit(ops);
      $('new-channel-url').value = ''; pendingChannel = null;
      $('channel-preview').classList.add('hidden'); $('channel-options').classList.add('hidden'); setStatus('channel-fetch-status', '');
      toast(`تم نشر القناة و ${vids.length} فيديو للجميع ✓`);
    } catch (e) {
      const m = (e && e.code) ? writeErr(e) : 'فشل الاستيراد: ' + e.message;
      setStatus('channel-fetch-status', m, 'error');
      refreshChannelBtn();
    }
  };

  async function syncChannel(ch) {
    const vids = await pullUploads(ch, { full: false });
    const ops = vids.map(v => ({ t: 'set', col: COL_VID, id: v.id, data: v }));
    ops.push({ t: 'set', col: COL_CH, id: ch.id, data: { lastSync: Date.now() }, merge: true });
    await commit(ops);
    return vids.length;
  }
  async function syncAll(force) {
    if (!getKey() || !isAdmin() || !gotVid) return;       // المزامنة التلقائية للمدير فقط
    let added = 0;
    for (const ch of lib.channels) {
      if (!force && Date.now() - (ch.lastSync || 0) < SYNC_EVERY) continue;
      try { added += await syncChannel(ch); } catch (e) { console.warn('sync failed', ch.title, e.message); }
    }
    if (added) toast(`تمت إضافة ${added} فيديو جديد من القنوات`);
  }
  window.refreshChannelNow = async function (id) {
    const ch = lib.channels.find(c => c.id === id); if (!ch) return;
    if (!requireAdmin()) return;
    if (!getKey()) { toast('اربط YouTube أولاً'); return; }
    try { const n = await syncChannel(ch); toast(n ? `تمت إضافة ${n} فيديو جديد` : 'لا توجد فيديوهات جديدة'); }
    catch (e) { toast((e && e.code) ? writeErr(e) : 'خطأ من YouTube: ' + e.message); }
  };
  window.setChannelLang = async function (id, lang) {
    const ch = lib.channels.find(c => c.id === id); if (!ch) return;
    if (!requireAdmin()) { renderAdminChannels(); return; }
    const ops = [{ t: 'set', col: COL_CH, id, data: { lang }, merge: true }]
      .concat(lib.videos.filter(v => v.channelId === id && v.source === 'channel').map(v => ({ t: 'set', col: COL_VID, id: v.id, data: { lang }, merge: true })));
    try { await commit(ops); toast('تم تغيير لغة القناة'); } catch (e) { toast(writeErr(e)); renderAdminChannels(); }
  };
  window.removeChannel = async function (id) {
    const ch = lib.channels.find(c => c.id === id); if (!ch) return;
    if (!requireAdmin()) return;
    if (!confirm(`حذف القناة "${ch.title}" وكل فيديوهاتها من الموقع لدى الجميع؟`)) return;
    const ops = [{ t: 'delete', col: COL_CH, id }]
      .concat(lib.videos.filter(v => v.channelId === id && v.source === 'channel').map(v => ({ t: 'delete', col: COL_VID, id: v.id })));
    if (window.selectedChannel === id) window.selectedChannel = '';
    try { await commit(ops); toast('تم حذف القناة'); } catch (e) { toast(writeErr(e)); }
  };
  window.removeLibraryVideo = async function (id) {
    if (!requireAdmin()) return;
    try { await commit([{ t: 'delete', col: COL_VID, id }]); toast('تم حذف الفيديو'); } catch (e) { toast(writeErr(e)); }
  };

  /* ================= API KEY (في متصفح المدير فقط) ================= */
  window.saveYtKey = async function () {
    const k = $('yt-api-key').value.trim(); if (!k) return;
    try {
      const u = new URL('https://www.googleapis.com/youtube/v3/videos');
      u.searchParams.set('part', 'id'); u.searchParams.set('id', 'dQw4w9WgXcQ'); u.searchParams.set('key', k);
      const r = await fetch(u.toString()); const j = await r.json().catch(() => ({}));
      if (!r.ok) { toast('المفتاح غير صالح: ' + ((j.error && j.error.message) || r.status)); return; }
    } catch (e) { toast('تعذر التحقق من المفتاح، تحقق من الاتصال'); return; }
    localStorage.setItem(KEY_KEY, k); $('yt-api-key').value = '';
    updateKeyUI(); toast('تم ربط YouTube ✓');
    if ($('new-channel-url').value.trim()) previewChannel();
    syncAll(false);
  };
  window.clearYtKey = function () { localStorage.removeItem(KEY_KEY); updateKeyUI(); };
  function updateKeyUI() {
    const has = !!getKey();
    $('yt-key-ok').classList.toggle('hidden', !has);
    $('yt-key-form').classList.toggle('hidden', has);
  }
  function updateAdminUI() {
    const el = $('publisher-status'); if (!el) return;
    const signed = typeof authenticatedUser !== 'undefined' && authenticatedUser;
    el.textContent = isAdmin()
      ? '✅ أنت مدير: كل ما تنشره يظهر لجميع الزوار فوراً. الصق رابط القناة وسنجلب فيديوهاتها تلقائياً.'
      : (signed ? '⚠️ هذا الحساب ليس مديراً، لذلك لا يمكنه النشر. أضف وثيقة admins/<uid> في Firestore.' : '🔒 سجّل الدخول بحساب المدير (من زر "حساب العائلة" أعلاه) لتتمكن من النشر.');
    el.className = 'text-sm font-bold mb-3 ' + (isAdmin() ? 'text-green-700' : 'text-red-600');
  }

  /* ================= RENDERING ================= */
  function renderAdminChannels() {
    const box = $('admin-channels'); if (!box) return;
    box.innerHTML = lib.channels.map(ch => {
      const n = lib.videos.filter(v => v.channelId === ch.id && v.source === 'channel').length;
      const opts = Object.keys(LANG_TAGS).map(c => `<option value="${c}" ${c === ch.lang ? 'selected' : ''}>${FLAGS[c] || ''} ${esc(LANG_TAGS[c].name)}</option>`).join('');
      return `<div class="bg-white border-3 border-inkDark rounded-2xl p-3">
        <div class="flex items-center gap-3">
          <img src="${esc(ch.thumb)}" alt="" class="w-10 h-10 rounded-full border-2 border-inkDark object-cover bg-sky-100">
          <div class="min-w-0 flex-1"><p class="font-black text-sm truncate">${esc(ch.title)}</p><p class="text-[11px] font-bold text-slate-600">${n} فيديو</p></div>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <select onchange="setChannelLang('${esc(ch.id)}', this.value)" class="px-2 py-1.5 rounded-xl border-2 border-inkDark font-black text-xs bg-white">${opts}</select>
          <button type="button" onclick="refreshChannelNow('${esc(ch.id)}')" class="cartoon-btn bg-sky-200 px-3 py-1.5 rounded-xl font-black text-xs">تحديث الآن</button>
          <button type="button" onclick="removeChannel('${esc(ch.id)}')" class="cartoon-btn bg-coralRed text-white px-3 py-1.5 rounded-xl font-black text-xs">حذف</button>
        </div></div>`;
    }).join('');
  }
  window.renderAdminVideoList = function () {
    updateKeyUI(); updateAdminUI(); renderAdminChannels();
    const list = $('admin-video-list'), count = $('admin-video-count');
    if (count) count.textContent = lib.videos.length;
    if (!list) return;
    const shown = lib.videos.slice().sort((a, b) => sortKey(b) - sortKey(a)).slice(0, 150);
    list.innerHTML = shown.map(v => `<div class="flex items-center gap-2.5 bg-sky-50 border-2 border-inkDark rounded-2xl p-2">
        <img src="https://img.youtube.com/vi/${esc(v.youtubeId)}/default.jpg" alt="" loading="lazy" decoding="async" class="w-14 h-10 rounded-lg object-cover border border-inkDark">
        <div class="min-w-0 flex-1"><p class="font-black text-xs truncate">${esc(v.title)}</p><p class="text-[11px] font-bold text-slate-600 truncate">${esc(v.channel)} • ${esc((LANG_TAGS[v.lang] || {}).name || '')}</p></div>
        <button type="button" onclick="removeLibraryVideo('${esc(v.id)}')" class="cartoon-btn bg-coralRed text-white w-8 h-8 rounded-lg flex items-center justify-center shrink-0"><i class="ph-bold ph-trash"></i></button>
      </div>`).join('') + (lib.videos.length > 150 ? `<p class="text-[11px] font-bold text-slate-600 text-center">يتم عرض أحدث 150 فيديو فقط</p>` : '');
  };
  function renderPublicChannels() {
    const box = $('public-channels'); if (!box) return;
    const retry = $('library-retry'); if (retry) retry.classList.add('hidden');
    if (gotCh && gotVid) libStatus(lib.channels.length ? `${lib.channels.length} قناة في المكتبة` : 'لا توجد قنوات بعد.');
    if (!lib.channels.length) { box.innerHTML = ''; return; }
    const sel = window.selectedChannel || '';
    const chip = (id, label, thumb) => `<button type="button" data-ch="${esc(id)}" class="cartoon-btn flex items-center gap-2 px-3 py-2 rounded-2xl font-black text-sm ${sel === id ? 'bg-sunYellow' : 'bg-white'}">${thumb ? `<img src="${esc(thumb)}" alt="" class="w-6 h-6 rounded-full border border-inkDark object-cover">` : '🌈'}<span>${esc(label)}</span></button>`;
    box.innerHTML = chip('', 'الكل', '') + lib.channels.map(c => chip(c.id, c.title, c.thumb)).join('');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('#public-channels [data-ch]'); if (!b) return;
    const id = b.dataset.ch;
    window.selectedChannel = (window.selectedChannel === id) ? '' : id;
    renderPublicChannels(); renderVideos();
  });
  function refreshAll() { renderPublicChannels(); renderAdminChannels(); window.renderAdminVideoList(); renderVideos(); }

  /* ================= INIT ================= */
  $('new-video-url').addEventListener('input', videoInputChanged);
  $('new-channel-url').addEventListener('input', channelInputChanged);
  $('new-channel-url').addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(cTimer); previewChannel(); } });
  $('new-video-url').addEventListener('keydown', e => { if (e.key === 'Enter') { clearTimeout(vTimer); previewVideo(); } });
  updateKeyUI(); updateAdminUI(); renderPublicChannels();
  syncTimer = setInterval(() => syncAll(false), SYNC_EVERY);
})();
