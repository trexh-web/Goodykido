// Public library data lives in Netlify Database; only viewing preferences stay on this device.
let publicChannels = [];
let publisherAdmin = false;
let channelPublisher = false;
let youtubeConfigured = false;
let libraryNext = null;
let libraryBusy = false;
let publisherBusy = false;
window.selectedChannel = null;
function escapeHTML(value) {
 return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
async function libraryAPI(path,options={}) {
 if(options.method) await window.accountAuth?.refresh?.();
 const response=await fetch('/api/'+path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}});
 const data=await response.json();
 if(!response.ok) throw new Error(data.error || 'تعذر تحميل المكتبة');
 return data;
}
function publisherMessage(text) { document.getElementById('publisher-status').textContent=text; }
function updatePublisherControls() {
 ['publish-video','publish-channel'].forEach(id=>{document.getElementById(id).disabled=publisherBusy || (id==='publish-channel' ? !channelPublisher : !publisherAdmin);document.getElementById(id).classList.toggle('opacity-50',publisherBusy || (id==='publish-channel' ? !channelPublisher : !publisherAdmin));});
 renderAdminVideoList(); renderChannels();
}
async function refreshPublisher() {
 try { const data=await libraryAPI('session'); publisherAdmin=data.admin; channelPublisher=data.authenticated; youtubeConfigured=data.youtubeConfigured; }
 catch { channelPublisher=false; publisherAdmin=false; youtubeConfigured=false; }
 publisherMessage(publisherAdmin?'أنت المدير. كل ما تنشره يظهر لجميع الزوار.':channelPublisher?'يمكنك إضافة قنوات واستيراد فيديوهاتها لجميع الزوار.':'سجل الدخول بأي حساب لإضافة قناة. المشاهدة متاحة للجميع.');
 document.getElementById('admin-help').classList.toggle('hidden',channelPublisher);
 document.getElementById('youtube-setup-placeholder').classList.toggle('hidden',youtubeConfigured);
 updatePublisherControls();
}
async function loadLibrary(append=false) {
 if(libraryBusy) return;
 libraryBusy=true;
 document.getElementById('library-retry').classList.add('hidden');
 document.getElementById('load-more').disabled=true;
 try {
  const data=await libraryAPI('library'+(append && libraryNext ? '?before='+encodeURIComponent(libraryNext):''));
  videos=append ? [...new Map([...videos,...data.videos].map(v=>[v.id,v])).values()] : data.videos;
  publicChannels=data.channels;libraryNext=data.next;
  renderVideos();renderChannels();renderAdminVideoList();
  document.getElementById('library-status').textContent='القنوات والفيديوهات المنشورة متاحة لكل زائر. اختر قناة أو تصفح جميع الفيديوهات.';
  document.getElementById('load-more').classList.toggle('hidden',!libraryNext);
  const requested=new URL(location.href).searchParams.get('video');
  if(requested && !window.sharedVideoOpened) {
   window.sharedVideoOpened=true;
   try {
    const video=videos.find(v=>v.id===requested) || await libraryAPI('videos/'+encodeURIComponent(requested));
    if(!videos.some(v=>v.id===video.id)) videos.push(video);
    openSafePlayerById(video.id);
   } catch { document.getElementById('library-status').textContent='هذا الفيديو غير متاح حالياً. تصفح بقية المكتبة.'; }
  }
 } catch(error) {
  document.getElementById('library-status').textContent=error.message;
  document.getElementById('library-retry').classList.remove('hidden');
 } finally {libraryBusy=false;document.getElementById('load-more').disabled=false;}
}
function loadMoreVideos(){return loadLibrary(true);}
function chooseChannel(id){window.selectedChannel=id;renderChannels();renderVideos();}
function renderChannels() {
 const list=document.getElementById('public-channels');list.replaceChildren();
 for(const channel of [{id:null,title:'جميع القنوات'},...publicChannels]) {
  const button=document.createElement('button');button.type='button';
  button.className='border-2 border-inkDark rounded-2xl px-4 py-3 font-black text-sm '+(window.selectedChannel===channel.id?'bg-sunYellow':'bg-sky-50 hover:bg-sky-100');
  button.textContent=channel.title;if(channel.id)button.dataset.userContent='';button.setAttribute('aria-pressed',String(window.selectedChannel===channel.id));
  button.onclick=()=>chooseChannel(channel.id);list.append(button);
 }
 const admin=document.getElementById('admin-channels');admin.replaceChildren();
 for(const channel of publicChannels) {
  const row=document.createElement('div');row.className='bg-white rounded-2xl border-2 border-inkDark p-3';
  const title=document.createElement('p');title.className='font-black';title.dataset.userContent='';title.textContent=channel.title;
  const status=document.createElement('p');status.className='text-xs my-2 font-bold';
  status.textContent=channel.error || (channel.importing?'جارٍ استيراد الأرشيف على دفعات':'اكتمل استيراد الأرشيف • التحديث التلقائي مفعّل');
  const updated=document.createElement('p');updated.className='text-xs mb-2';updated.textContent=channel.lastSynced?'آخر محاولة تحديث: '+new Date(channel.lastSynced).toLocaleString():'بانتظار أول تحديث';
  row.append(title,status,updated);
  if(publisherAdmin) for(const [label,action] of [['تحديث واستيراد الدفعة التالية',()=>publishTask(async()=>{await libraryAPI('channels/'+channel.id+'/sync',{method:'POST'});})],['حذف القناة وفيديوهاتها',()=>publishTask(async()=>{await libraryAPI('channels/'+channel.id,{method:'DELETE'});if(window.selectedChannel===channel.id)window.selectedChannel=null;})]]) {
   const button=document.createElement('button');button.textContent=label;button.disabled=publisherBusy;button.className='text-xs font-bold underline me-4';button.onclick=action;row.append(button);
  }
  admin.append(row);
 }
}
function renderAdminVideoList() {
 document.getElementById('admin-video-count').textContent=videos.length;
 document.getElementById('admin-video-list').innerHTML=videos.map(v=>`<div class="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-inkDark"><div class="min-w-0"><p data-user-content class="font-black text-sm truncate">${escapeHTML(v.title)}</p><p data-user-content class="text-xs">${escapeHTML(v.channel)}</p></div>${publisherAdmin?`<button ${publisherBusy?'disabled':''} onclick="deleteVideo('${v.id}')" class="bg-coralRed text-white px-3 py-2 rounded-xl font-black text-xs">إزالة للجميع</button>`:''}</div>`).join('') || '<p class="font-bold text-sm">لا توجد فيديوهات منشورة بعد.</p>';
}
async function publishTask(action, channelContribution=false) {
 if(publisherBusy || !(channelContribution ? channelPublisher : publisherAdmin))return;
 publisherBusy=true;updatePublisherControls();publisherMessage('جارٍ حفظ التغييرات…');
 try {const result=await action();await loadLibrary();publisherMessage(result || 'تم الحفظ. المحتوى المنشور ظاهر لجميع الزوار.');}
 catch(error){publisherMessage(error.message);}
 finally {publisherBusy=false;updatePublisherControls();}
}
function contentMetadata(){return {category:document.getElementById('new-video-category').value,lang:document.getElementById('new-video-lang').value};}
function addCustomVideo(){return publishTask(async()=>{
 await libraryAPI('videos',{method:'POST',body:JSON.stringify({url:document.getElementById('new-video-url').value.trim(),title:document.getElementById('new-video-title').value.trim(),channel:document.getElementById('new-video-channel').value.trim(),...contentMetadata()})});
 ['new-video-url','new-video-title','new-video-channel'].forEach(id=>document.getElementById(id).value='');
});}
function addChannel(){return publishTask(async()=>{
 if(!youtubeConfigured) throw new Error('إضافة القنوات غير متاحة حتى يكتمل إعداد اتصال YouTube.');
 const url=document.getElementById('new-channel-url').value.trim();
 if(!url) throw new Error('أدخل رابط قناة YouTube');
 const channel=await libraryAPI('channels',{method:'POST',body:JSON.stringify({url,category:document.getElementById('new-channel-category').value,lang:document.getElementById('new-channel-lang').value})});
 let sync;
 try {sync=await libraryAPI('channels/'+channel.id+'/sync',{method:'POST'});}
 catch {return 'تم حفظ القناة، لكن تعذر استيراد الفيديوهات الآن. تُعاد المحاولة تلقائياً لاحقاً.';}
 document.getElementById('new-channel-url').value='';
 if(!sync.ok) return 'تم حفظ القناة، لكن تعذر استيراد الفيديوهات الآن. تُعاد المحاولة تلقائياً لاحقاً.';
 return channel.created ? 'تمت إضافة القناة واستيراد فيديوهاتها باللغة والقسم المختارين. لعرضها اختر لغة القناة من قائمة اللغات.' : 'هذه القناة موجودة بالفعل. تم تحديث فيديوهاتها مع الاحتفاظ بلغتها وقسمها الحاليين.';
},true);}
function deleteVideo(id){return publishTask(()=>libraryAPI('videos/'+encodeURIComponent(id),{method:'DELETE'}));}
async function shareVideo(id){
 const url=new URL(location.origin+location.pathname);url.searchParams.set('video',id);
 try{if(navigator.share) await navigator.share({title:videos.find(v=>v.id===id)?.title,url:url.href});else {await navigator.clipboard.writeText(url.href);showToast('تم نسخ رابط الفيديو العام');}}
 catch(error){if(error.name!=='AbortError') showToast('تعذرت مشاركة الرابط. حاول مجدداً');}
}
function stopExternalPlayer(){const player=document.getElementById('external-player');if(player){player.pause();player.removeAttribute('src');player.load();}document.getElementById('external-content')?.remove();}
function configurePlayer(video){
 stopExternalPlayer();const iframe=document.getElementById('youtube-iframe');iframe.src='';iframe.classList.toggle('hidden',!video.youtubeId);
 if(video.youtubeId){iframe.src=`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`;return;}
 const wrapper=document.createElement('div');wrapper.id='external-content';wrapper.className='absolute inset-0 z-10 bg-slate-900 text-white p-4 flex flex-col items-center justify-center gap-4';
 if(/\.(mp4|webm|ogg)$/i.test(new URL(video.url).pathname)){
  const player=document.createElement('video');player.id='external-player';player.controls=true;player.playsInline=true;player.className='w-full flex-1 min-h-0';player.src=video.url;wrapper.append(player);
 }
 const note=document.createElement('p');note.className='font-bold text-sm text-center';note.textContent='رابط خارجي يختاره المدير. قد يتطلب تشغيله زيارة المصدر.';
 const button=document.createElement('button');button.className='bg-sunYellow text-inkDark rounded-xl p-3 font-black';button.textContent='زيارة المصدر بإذن ولي الأمر';button.onclick=()=>openParentGate(()=>window.open(video.url,'_blank','noopener,noreferrer'));
 wrapper.append(note,button);iframe.parentElement.append(wrapper);
}
const originalApplySession=window.applyAccountSession;
window.applyAccountSession=function(user){originalApplySession(user);refreshPublisher();};
document.addEventListener('DOMContentLoaded',()=>{updatePublisherControls();loadLibrary();refreshPublisher();});
