(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const ic=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const ICONS={
 doc:ic('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>'),
 open:ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
 save:ic('<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>'),
 undo:ic('<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
 redo:ic('<path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>'),
 sidebar:ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
 up:ic('<path d="m6 15 6-6 6 6"/>'), down:ic('<path d="m6 9 6 6 6-6"/>'),
 minus:ic('<path d="M5 12h14"/>'), plus:ic('<path d="M12 5v14M5 12h14"/>'),
 search:ic('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>'),
 rotl:ic('<path d="M4 9a8 8 0 1 1-1 5"/><path d="M4 4v5h5"/>'),
 rotr:ic('<path d="M20 9a8 8 0 1 0 1 5"/><path d="M20 4v5h-5"/>'),
 mvup:ic('<rect x="6" y="11" width="12" height="9" rx="1"/><path d="M12 8V3M9.5 5.5 12 3l2.5 2.5"/>'),
 mvdn:ic('<rect x="6" y="4" width="12" height="9" rx="1"/><path d="M12 16v5M9.5 18.5 12 21l2.5-2.5"/>'),
 blank:ic('<path d="M7 3h7l4 4v14H7z"/><path d="M12 11v6M9 14h6"/>'),
 trash:ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
 cursor:ic('<path d="m5 3 14 8-6 2-2 6z"/>'),
 edit:ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>'),
 type:ic('<path d="M5 6V4h14v2M12 4v16M9 20h6"/>'),
 image:ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 9"/>'),
 hl:ic('<path d="m4 20 4-1 10-10-3-3L5 16z"/><path d="M4 21h16"/>'),
 rect:ic('<rect x="4" y="6" width="16" height="12" rx="1"/>'),
 pen:ic('<path d="M4 20c3-1 4-5 7-5s2 3 5 2 3-6 4-9"/>'),
 x:ic('<path d="m6 6 12 12M18 6 6 18"/>'),
 saveas:ic('<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h8M17 20h4M19 18v4"/>'),
 font:ic('<path d="M4 18 9 6l5 12M5.8 14h6.4M16 18l2.6-6 2.4 6M16.8 16.5h3.6"/>'),
 theme:ic('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>'),
 special:ic('<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16v4M17 18h4"/>'),
 chev:ic('<path d="m6 9 6 6 6-6"/>'),
 dup:ic('<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
 shot:ic('<path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.4"/>'),
 link:ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
 note:ic('<path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-4 4v-4H5a1 1 0 0 1-1-1z"/><path d="M8 8.5h8M8 12h5"/>'),
 merge:ic('<path d="M9 3h6l4 4v9H9z"/><path d="M15 3v4h4"/><path d="M15 21H5V8h4"/><path d="M12 11v4M10 13h4"/>'),
 paste:ic('<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V4h6v1M9 4h6v3H9z"/><path d="M12 11v6M9 14h6"/>')
};
/* pages copied with "Copier la page", waiting to be pasted into any open tab: {bytes,count,from,pages} */
let pageClip=null;
$$('[data-i]').forEach(e=>{e.innerHTML=ICONS[e.dataset.i]||''});

const PDFJS_BASE='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const DESKTOP=!!window.__DESKTOP__;
/* installable web app (phones/tablets): same bundled libraries as the desktop app, no local backend */
const PWA=!!window.__PWA__;
const NATIVE=!!(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.letuspdf); /* inside the iPhone app (WKWebView) */
const LOCAL=DESKTOP||PWA;
const COARSE=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
/* the leading "./" matters: when the real worker can't start (e.g. too many already running) pdf.js
   falls back to a "fake worker" that dynamic-imports this same path, and a dynamic import() rejects a
   bare "lib/..." specifier outright ("Failed to resolve module specifier") — only a real relative path works */
pdfjsLib.GlobalWorkerOptions.workerSrc=LOCAL?'./lib/pdf.worker.min.mjs':PDFJS_BASE+'pdf.worker.min.js';

const S={pdf:null,bytes:null,name:'document',pages:[],zoom:1,tool:'sel',annots:[],sel:null,hist:['[]'],hi:0,
  imgs:{},cur:1,gen:0,q:'',hits:[],hix:-1,enc:false,dirty:false,pendingImg:null,fonts:[],thSel:new Set(),saveName:null,fileHandle:null,fileToken:null,hinted:{},tabs:[],ti:-1,
  split:false,active:1,zoom2:1,cur2:1,q2:'',hits2:[],hix2:-1,shotSel:null};
const viewer=$('#viewer'), pagesEl=$('#pages');
const viewer2=$('#viewer2'), pagesEl2=$('#pages2');
let _id=0; const uid=()=>'a'+(++_id)+Math.random().toString(36).slice(2,6);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const ZSTEPS=[.25,.33,.5,.67,.75,.9,1,1.1,1.25,1.5,1.75,2,2.5,3,4];

let toastT=0;
function toast(msg,ms){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},PWA?3000:(ms||3600))}
function busy(on,msg){const b=$('#busy');b.hidden=!on;if(msg)b.textContent=msg}

/* ---------- history ---------- */
function pushHist(){
  const snap=JSON.stringify(S.annots);
  if(S.hist[S.hi]===snap){S.dirty=true;syncUi();return} /* nothing actually changed since the last step - don't pad undo with a no-op */
  S.hist=S.hist.slice(0,S.hi+1);S.hist.push(snap);
  if(S.hist.length>150)S.hist.shift();
  S.hi=S.hist.length-1;S.dirty=true;syncUi();
}
function restoreHist(){
  S.annots=JSON.parse(S.hist[S.hi]);
  if(S.sel&&!S.annots.some(a=>a.id===S.sel))S.sel=null;
  renderAllAnnots();syncUi();
}
function undo(){if(S.hi>0){S.hi--;S.dirty=true;restoreHist()}}
function redo(){if(S.hi<S.hist.length-1){S.hi++;S.dirty=true;restoreHist()}}

/* ---------- password dialog ---------- */
function askPw(wrong){
  return new Promise(res=>{
    const m=$('#modal'),i=$('#pwIn');i.value='';m.hidden=false;
    $('#modal h2').textContent=wrong?'Mot de passe incorrect':'Document protégé';
    setTimeout(()=>i.focus(),30);
    const done=v=>{m.hidden=true;$('#pwOk').onclick=$('#pwNo').onclick=i.onkeydown=null;res(v)};
    $('#pwOk').onclick=()=>done(i.value);$('#pwNo').onclick=()=>done(null);
    i.onkeydown=e=>{if(e.key==='Enter')done(i.value);if(e.key==='Escape')done(null)};
  });
}

/* ---------- loading ---------- */
async function openFile(file,handle,noStash){
  if(!file)return;
  try{
    const buf=await file.arrayBuffer();
    const bytes=new Uint8Array(buf),name=file.name.replace(/\.pdf$/i,'')||'document';
    const had=S.ti>=0&&!!S.pdf,prev=S.ti;
    if(had)detachTab();
    const ok=await loadBytes(bytes,name);
    if(ok){
      const t={id:uid(),snap:null};
      if(had){S.tabs.splice(prev+1,0,t);S.ti=prev+1}else{S.tabs=[t];S.ti=0}
      /* remembered so a plain "Enregistrer" can write straight back into this same file later, with
         no dialog: a string is a backend path-token (desktop app - the most direct route, straight
         to the real file on disk), an object is a browser FileSystemFileHandle (native picker) */
      if(typeof handle==='string'){S.fileToken=handle;S.fileHandle=null}
      else{S.fileToken=null;S.fileHandle=handle||null}
      pushRecent({name:file.name,handle:(typeof handle==='string')?null:(handle||null)});
      /* desktop: a file dropped onto the window (or any open without a real path) has no path the
         backend could remember, so a copy is stored next to the app and listed under "Ouvrir" */
      if(DESKTOP&&!handle&&!noStash){
        try{await fetch('/api/stash?name='+encodeURIComponent(file.name),{method:'POST',headers:{'X-LetUs':'1'},body:bytes})}catch(e){console.error(e)}
      }
    }else if(had)attachTab(prev);
    renderTabs();
  }catch(e){console.error(e);toast('Impossible d\'ouvrir ce fichier.')}
}

/* ---------- recent files ---------- */
/* a FileSystemFileHandle is structured-cloneable, so it can be stored directly in IndexedDB -
   that's what lets the desktop app reopen a recent file with one click, no re-picker needed.
   Plain File objects (from <input type=file>, used in the browser artifact) carry no reusable
   handle, so there a recent entry is name-only and clicking it just points to "Parcourir…". */
const RECENT_MAX=10;
let _recentDb=null;
function openRecentDB(){
  if(_recentDb)return _recentDb;
  _recentDb=new Promise((res,rej)=>{
    try{
      const rq=indexedDB.open('letuspdf-recent',1);
      rq.onupgradeneeded=()=>{rq.result.createObjectStore('meta')};
      rq.onsuccess=()=>res(rq.result);
      rq.onerror=()=>rej(rq.error);
    }catch(e){rej(e)}
  });
  return _recentDb;
}
async function getRecent(){
  if(DESKTOP){
    /* the desktop app keeps its own recent.json next to the executable (see /api/recent) - that
       survives closing and reopening the app, unlike IndexedDB, which is scoped to this browser
       profile/port and was found to not reliably survive a relaunch */
    try{
      const list=await (await fetch('/api/recent',{cache:'no-store'})).json();
      return list.map(e=>({name:e.name,token:e.token||null,copy:!!e.copy}));
    }catch(e){console.error(e);return[]}
  }
  try{
    const db=await openRecentDB();
    return await new Promise((res,rej)=>{
      const tx=db.transaction('meta','readonly'),rq=tx.objectStore('meta').get('list');
      rq.onsuccess=()=>res(rq.result||[]);rq.onerror=()=>rej(rq.error);
    });
  }catch(e){console.error(e);return[]}
}
async function setRecent(list){
  try{
    const db=await openRecentDB();
    await new Promise((res,rej)=>{
      const tx=db.transaction('meta','readwrite');tx.objectStore('meta').put(list,'list');
      tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);
    });
  }catch(e){console.error(e)}
}
async function pushRecent(entry){
  if(DESKTOP)return; /* the backend already records every desktop open/pick in recent.json itself */
  if(!entry||!entry.name)return;
  try{
    const list=(await getRecent()).filter(e=>e.name!==entry.name);
    list.unshift({name:entry.name,handle:entry.handle||null});
    await setRecent(list.slice(0,RECENT_MAX));
  }catch(e){console.error(e)}
}
/* a real, standard "Open" dialog. Desktop app: a genuine native dialog driven by the backend itself
   (not the browser's own, sandboxed picker) - that's what gives us the file's real absolute path, for
   recent.json and for a dialog-free "Enregistrer" later. Browser: the File System Access picker when
   the page is allowed to use it here, else the classic <input type=file>. */
async function pickAndOpen(){
  if(DESKTOP){
    try{
      const j=await (await fetch('/api/pickopen',{cache:'no-store'})).json();
      if(j.cancelled)return;
      if(!j.token){toast('Impossible d\'ouvrir ce fichier.');return}
      const b=await (await fetch('/api/file/'+j.token)).arrayBuffer();
      await tryOpen(new File([b],j.name,{type:'application/pdf'}),j.token);
    }catch(e){console.error(e);toast('Impossible d\'ouvrir le sélecteur de fichier.')}
    return;
  }
  if(window.showOpenFilePicker){
    try{
      const handles=await window.showOpenFilePicker({multiple:true,types:[{description:'Document PDF',accept:{'application/pdf':['.pdf']}}]});
      for(const h of handles){const f=await h.getFile();await tryOpen(f,h)}
      return;
    }catch(e){
      if(e&&e.name==='AbortError')return; /* the person cancelled the dialog */
      console.warn('showOpenFilePicker indisponible ici, retour à la boîte de dialogue classique.',e);
    }
  }
  $('#fPdf').click();
}
async function openRecentEntry(entry){
  if(!entry)return;
  if(DESKTOP){
    if(!entry.token){toast('Fichier introuvable : il a peut-être été déplacé ou supprimé.',4500);return}
    try{
      const b=await (await fetch('/api/file/'+entry.token)).arrayBuffer();
      /* a stored copy of a dropped file is not the user's real file: opened without a save-back token */
      if(entry.copy)await openFile(new File([b],entry.name,{type:'application/pdf'}),null,true);
      else await tryOpen(new File([b],entry.name,{type:'application/pdf'}),entry.token);
    }catch(e){console.error(e);toast('Impossible de rouvrir ce fichier.',4500)}
    return;
  }
  if(!entry.handle){toast('Utilisez « Parcourir… » pour rouvrir ce fichier.');return}
  try{
    let perm=await entry.handle.queryPermission({mode:'read'});
    if(perm!=='granted')perm=await entry.handle.requestPermission({mode:'read'});
    if(perm!=='granted'){toast('Autorisation refusée pour ce fichier.');return}
    const f=await entry.handle.getFile();
    await tryOpen(f,entry.handle);
  }catch(e){console.error(e);toast('Impossible de rouvrir ce fichier : il a peut-être été déplacé ou supprimé.',4500)}
}

async function loadBytes(bytes,name,keepPage,keepAnnots){
  busy(true,'Chargement…');
  try{
    S.enc=false;
    const task=pdfjsLib.getDocument({data:bytes.slice(0),isEvalSupported:false});
    task.onPassword=async(update,reason)=>{
      S.enc=true;busy(false);
      const pw=await askPw(reason===2);
      busy(true,'Chargement…');
      if(pw===null)task.destroy();else update(pw);
    };
    let pdf=await task.promise;
    /* links and sticky notes already inside the file become editable annotations: the file itself is
       reopened without them, so they're neither drawn twice nor impossible to delete */
    let lifted=null;
    if(!S.enc){
      try{lifted=await liftAnnots(pdf,bytes)}
      catch(e){
        console.error(e);
        if(e&&e.liftFail)setTimeout(()=>toast(e.message==='encrypted'
          ?'Ce PDF est chiffré : ses liens et commentaires existants peuvent être suivis mais pas modifiés.'
          :'Les liens ou commentaires existants de ce PDF ne peuvent pas être modifiés (structure du fichier non lisible).',6000),400);
      }
    }
    if(lifted){
      try{await pdf.destroy()}catch(e){}
      pdf=await pdfjsLib.getDocument({data:lifted.bytes.slice(0),isEvalSupported:false}).promise;
      bytes=lifted.bytes;
    }
    /* fully wait for the previous document's worker to shut down before switching to the new one —
       firing this and moving on without waiting let old workers pile up across many opens/page edits
       in a long desktop session, which could eventually starve new documents of resources */
    if(S.pdf){try{await S.pdf.destroy()}catch(e){}}
    S.pdf=pdf;S.bytes=bytes;if(name){S.name=name;S.saveName=null}
    const pages=[];
    for(let i=1;i<=pdf.numPages;i++){
      const p=await pdf.getPage(i);const vp=p.getViewport({scale:1});
      pages.push({n:i,proxy:p,w:vp.width,h:vp.height,vp1:vp,rendered:false,busy:false,task:null,groups:null,fontsDone:false});
    }
    S.pages=pages;S.annots=(keepAnnots||[]).concat(lifted?lifted.annots:[]);S.sel=null;S.hist=[JSON.stringify(S.annots)];S.hi=0;S.hits=[];S.hix=-1;
    S.thSel=new Set([(keepPage||1)-1]);
    if(!keepPage){S.dirty=false}
    $('#empty').hidden=true;
    if(!keepPage)S.zoom=fitWidthValue(pages[0],1.5);
    S.cur=keepPage||1;
    buildPages();buildThumbs();renderAllAnnots();
    goto(keepPage||1);
    syncUi();
    if(S.q)runSearch(S.q);
    return true;
  }catch(e){
    console.error(e);
    const nm=e&&e.name;
    if(nm==='PasswordException')toast('Ouverture annulée.');
    else if(nm==='InvalidPDFException'||nm==='MissingPDFException'||nm==='UnexpectedResponseException')
      toast('Impossible d\'ouvrir ce fichier : est-il bien un PDF valide ?');
    else
      /* not a PDF-structure problem — surface the real cause instead of a misleading "invalid PDF" message
         (e.g. the local renderer ran out of memory or workers after many documents open at once) */
      toast('Impossible d\'ouvrir ce fichier ('+(e&&e.message||nm||'erreur inconnue')+'). Si cela persiste après avoir ouvert plusieurs documents, fermez quelques onglets ou redémarrez l\'application.',7000);
    return false;
  }finally{busy(false)}
}

/* ---------- tabs: one document per tab, each with its own state ---------- */
const DOCKEYS=['pdf','bytes','name','pages','zoom','annots','sel','hist','hi','imgs','cur','enc','dirty','saveName','fileHandle','fileToken','thSel'];
const blankDoc=()=>({pdf:null,bytes:null,name:'document',pages:[],zoom:1,annots:[],sel:null,hist:['[]'],hi:0,imgs:{},cur:1,enc:false,dirty:false,saveName:null,fileHandle:null,fileToken:null,thSel:new Set()});
function resetPageFlags(){
  for(const pg of S.pages){
    if(pg.task){try{pg.task.cancel()}catch(e){}}
    if(pg.task2){try{pg.task2.cancel()}catch(e){}}
    Object.assign(pg,{rendered:false,busy:false,task:null,tlBuilt:false,tlBusy:false,editing:false,
      rendered2:false,busy2:false,task2:null,tlBuilt2:false,tlBusy2:false});
  }
}
function clearActive(){
  if(S.split)toggleSplit(false);
  resetPageFlags();S.gen++;
  Object.assign(S,blankDoc());S.hits=[];S.hix=-1;
  pagesEl.innerHTML='';$('#thumbs').innerHTML='';
}
/* park the active document in its tab and leave the workspace blank */
function detachTab(){
  commitEdit();
  const t=S.tabs[S.ti];
  if(t){const snap={};for(const k of DOCKEYS)snap[k]=S[k];snap.scroll=viewer.scrollTop;t.snap=snap}
  clearActive();S.ti=-1;
}
function attachTab(i){
  const t=S.tabs[i];if(!t||!t.snap)return;
  const sc=t.snap.scroll;
  for(const k of DOCKEYS)S[k]=t.snap[k];
  t.snap=null;S.ti=i;
  resetPageFlags();S.gen++;S.hits=[];S.hix=-1;
  $('#empty').hidden=true;
  buildPages();buildThumbs();paintThumbSel();renderAllAnnots();
  viewer.scrollTop=sc||0;
  syncUi();renderVisible();
  if(S.q&&!$('#search').hidden)runSearch(S.q);
}

/* ---------- split view: a second, independent pane on the same document ---------- */
function setActive(pane){
  S.active=pane;
  $('#stage').classList.toggle('act',S.split&&pane===1);
  $('#stage2').classList.toggle('act',S.split&&pane===2);
  refreshToolbarForActive();
}
function refreshToolbarForActive(){
  const n=S.pages.length;
  const v=(S.split&&S.active===2)?{cur:S.cur2,zoom:S.zoom2}:{cur:S.cur,zoom:S.zoom};
  $('#pgIn').value=v.cur;$('#pgTot').textContent='/ '+n;
  $('#zLbl').textContent=Math.round(v.zoom*100)+' %';
  syncUi();
}
function toggleSplit(on){
  if(on&&!S.pdf){toast('Ouvrez un document avant d\'activer la vue partagée.');return}
  if(on===S.split)return;
  S.split=on;
  $('#main').classList.toggle('split',on);
  $('#stage2').hidden=!on;
  if(on){
    S.cur2=S.cur;S.q2='';S.hits2=[];S.hix2=-1;
    buildPages2();renderAllAnnots();
    fitPage();fitPage2();/* same zoom as clicking "Page", for each view */
    goto(S.cur);goto2(S.cur2);renderVisible2();
    setActive(1);
    toast('Vue partagée activée : chaque vue défile, zoome et recherche indépendamment.');
  }else{
    closeSearch2();
    if(io2)io2.disconnect();io2=null;
    for(const pg of S.pages){if(pg.task2){try{pg.task2.cancel()}catch(e){}}}
    pagesEl2.innerHTML='';
    for(const pg of S.pages)Object.assign(pg,{el2:null,cv2:null,tl2:null,al2:null,rendered2:false,busy2:false,task2:null,tlBuilt2:false,tlBusy2:false});
    setActive(1);
  }
  syncUi();
}
function switchTab(i){
  if(i===S.ti||!S.tabs[i])return;
  detachTab();attachTab(i);renderTabs();
}
async function closeTab(i){
  const t=S.tabs[i];if(!t)return;
  const act=i===S.ti,d=act?S:t.snap;
  if(act)commitEdit();
  if(d.dirty){
    $('#cfMsg').textContent='« '+d.name+' » contient des modifications non enregistrées. Les fermer les fera perdre.';
    if(!await confirmDiscard(true))return;
  }
  const pdf=d.pdf;
  if(act)clearActive();
  try{if(pdf)await pdf.destroy()}catch(e){}
  S.tabs.splice(i,1);
  if(act){
    S.ti=-1;
    if(S.tabs.length)attachTab(Math.min(i,S.tabs.length-1));
    else{$('#empty').hidden=false;syncUi();if(S.q)runSearch(S.q)}
  }else if(i<S.ti)S.ti--;
  renderTabs();
}
let tabSig='';
function renderTabs(){
  const box=$('#tabs');
  const show=S.tabs.length>1;
  box.hidden=!show;
  const items=S.tabs.map((t,i)=>{const d=i===S.ti?S:t.snap;return {i,name:d.name,dirty:d.dirty}});
  const sig=show+'|'+S.ti+'|'+items.map(x=>x.name+(x.dirty?'*':'')).join('\u0001');
  if(sig===tabSig)return;tabSig=sig;
  if(!show){box.innerHTML='';return}
  const e=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  box.innerHTML=items.map(x=>'<div class="tab'+(x.i===S.ti?' on':'')+'" role="tab" aria-selected="'+(x.i===S.ti)+'" data-i="'+x.i+'" title="'+e(x.name)+'.pdf">'
    +(x.dirty?'<i class="d" title="Modifications non enregistrées"></i>':'')+'<span class="t">'+e(x.name)+'</span>'
    +'<button class="x" data-x="'+x.i+'" aria-label="Fermer l\'onglet" title="Fermer">'+ICONS.x+'</button></div>').join('')
    +'<button class="plus" id="tabPlus" title="Ouvrir un autre PDF dans un nouvel onglet" aria-label="Nouvel onglet">+</button>';
  const on=box.querySelector('.tab.on');if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest',inline:'nearest'});
}
$('#tabs').addEventListener('click',e=>{
  const x=e.target.closest('[data-x]');
  if(x){e.stopPropagation();closeTab(+x.dataset.x);return}
  if(e.target.closest('#tabPlus')){$('#fPdf').click();return}
  const t=e.target.closest('.tab');if(t)switchTab(+t.dataset.i);
});
$('#tabs').addEventListener('auxclick',e=>{
  if(e.button!==1)return;const t=e.target.closest('.tab');if(t){e.preventDefault();closeTab(+t.dataset.i)}
});

/* ---------- pages, rendering ---------- */
let io=null,zT=0;
function buildPages(){
  if(io)io.disconnect();
  pagesEl.innerHTML='';S.gen++;
  pagesEl.style.setProperty('--z',S.zoom);
  $('#zLbl').textContent=Math.round(S.zoom*100)+' %';
  io=new IntersectionObserver(es=>{
    for(const e of es){
      const pg=S.pages[+e.target.dataset.n-1];if(!pg)continue;
      if(e.isIntersecting)renderPage(pg);else releasePage(pg);
    }
  },{root:viewer,rootMargin:'100% 0px'});
  for(const pg of S.pages){
    const el=document.createElement('div');el.className='page';el.dataset.n=pg.n;
    el.style.width='calc('+pg.w+'px*var(--z))';el.style.height='calc('+pg.h+'px*var(--z))';
    const cv=document.createElement('canvas');cv.className='cv';
    const tl=document.createElement('div');tl.className='tl';
    const ll=document.createElement('div');ll.className='ll';
    const al=document.createElement('div');al.className='al';
    for(const l of [tl,ll,al]){l.style.width=pg.w+'px';l.style.height=pg.h+'px'}
    el.append(cv,tl,ll,al);pagesEl.append(el);
    pg.el=el;pg.cv=cv;pg.tl=tl;pg.ll=ll;pg.al=al;
    bindLayers(pg);
    buildLinkLayer(pg,1);
    io.observe(el);
  }
}
function nearViewport(pg){
  const r=pg.el.getBoundingClientRect(),v=viewer.getBoundingClientRect();
  return r.bottom>v.top-v.height&&r.top<v.bottom+v.height;
}
function renderVisible(){for(const pg of S.pages)if(nearViewport(pg))renderPage(pg)}
async function renderPage(pg){
  if(pg.rendered||pg.busy)return;
  pg.busy=true;const gen=S.gen;
  try{
    const dpr=Math.min(window.devicePixelRatio||1,2);
    let scale=S.zoom*dpr;
    const px=pg.w*pg.h*scale*scale;if(px>16e6)scale*=Math.sqrt(16e6/px);
    const vp=pg.proxy.getViewport({scale});
    const off=document.createElement('canvas');
    off.width=Math.max(1,Math.floor(vp.width));off.height=Math.max(1,Math.floor(vp.height));
    const ctx=off.getContext('2d',{alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,off.width,off.height);
    pg.task=pg.proxy.render({canvasContext:ctx,viewport:vp});
    await pg.task.promise;
    if(gen!==S.gen)return;
    pg.cv.width=off.width;pg.cv.height=off.height;
    pg.cv.getContext('2d',{alpha:false}).drawImage(off,0,0);
    pg.rendered=true;
    await buildTextLayer(pg);
  }catch(e){
    if(!(e&&e.name==='RenderingCancelledException'))console.error(e);
  }finally{
    pg.busy=false;pg.task=null;
    if(gen!==S.gen)renderVisible();
  }
}
function releasePage(pg){
  if(pg.task){try{pg.task.cancel()}catch(e){}}
  if(!pg.rendered&&!pg.tlBuilt)return;
  pg.cv.width=pg.cv.height=0;pg.rendered=false;
  if(!pg.editing){pg.tl.textContent='';pg.tlBuilt=false}
}
function rerender(){
  S.gen++;
  for(const pg of S.pages){if(pg.task){try{pg.task.cancel()}catch(e){}}pg.rendered=false}
  renderVisible();
}

/* ---------- pane 2 (split view): independent render/scroll/zoom, same pages ---------- */
let io2=null,zT2=0;
function buildPages2(){
  if(io2)io2.disconnect();
  pagesEl2.innerHTML='';
  pagesEl2.style.setProperty('--z',S.zoom2);
  io2=new IntersectionObserver(es=>{
    for(const e of es){
      const pg=S.pages[+e.target.dataset.n-1];if(!pg)continue;
      if(e.isIntersecting)renderPage2(pg);else releasePage2(pg);
    }
  },{root:viewer2,rootMargin:'100% 0px'});
  for(const pg of S.pages){
    const el=document.createElement('div');el.className='page';el.dataset.n=pg.n;
    el.style.width='calc('+pg.w+'px*var(--z))';el.style.height='calc('+pg.h+'px*var(--z))';
    const cv=document.createElement('canvas');cv.className='cv';
    const tl=document.createElement('div');tl.className='tl';
    const ll=document.createElement('div');ll.className='ll2';
    const al=document.createElement('div');al.className='al';
    for(const l of [tl,ll,al]){l.style.width=pg.w+'px';l.style.height=pg.h+'px'}
    el.append(cv,tl,ll,al);pagesEl2.append(el);
    pg.el2=el;pg.cv2=cv;pg.tl2=tl;pg.ll2=ll;pg.al2=al;
    buildLinkLayer(pg,2);
    io2.observe(el);
  }
}
function nearViewport2(pg){
  if(!pg.el2)return false;
  const r=pg.el2.getBoundingClientRect(),v=viewer2.getBoundingClientRect();
  return r.bottom>v.top-v.height&&r.top<v.bottom+v.height;
}
function renderVisible2(){for(const pg of S.pages)if(nearViewport2(pg))renderPage2(pg)}
async function renderPage2(pg){
  if(pg.rendered2||pg.busy2)return;
  pg.busy2=true;const gen=S.gen;
  try{
    const dpr=Math.min(window.devicePixelRatio||1,2);
    let scale=S.zoom2*dpr;
    const px=pg.w*pg.h*scale*scale;if(px>16e6)scale*=Math.sqrt(16e6/px);
    const vp=pg.proxy.getViewport({scale});
    const off=document.createElement('canvas');
    off.width=Math.max(1,Math.floor(vp.width));off.height=Math.max(1,Math.floor(vp.height));
    const ctx=off.getContext('2d',{alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,off.width,off.height);
    pg.task2=pg.proxy.render({canvasContext:ctx,viewport:vp});
    await pg.task2.promise;
    if(gen!==S.gen||!pg.cv2)return;
    pg.cv2.width=off.width;pg.cv2.height=off.height;
    pg.cv2.getContext('2d',{alpha:false}).drawImage(off,0,0);
    pg.rendered2=true;
    await buildTextLayer2(pg);
  }catch(e){
    if(!(e&&e.name==='RenderingCancelledException'))console.error(e);
  }finally{
    pg.busy2=false;pg.task2=null;
    if(gen!==S.gen)renderVisible2();
  }
}
function releasePage2(pg){
  if(pg.task2){try{pg.task2.cancel()}catch(e){}}
  if(!pg.rendered2&&!pg.tlBuilt2)return;
  if(pg.cv2)pg.cv2.width=pg.cv2.height=0;pg.rendered2=false;
  if(pg.tl2){pg.tl2.textContent='';pg.tlBuilt2=false}
}
function rerender2(){
  for(const pg of S.pages){if(pg.task2){try{pg.task2.cancel()}catch(e){}}pg.rendered2=false}
  renderVisible2();
}

/* ---------- links embedded in the PDF itself (table of contents, cross-references, web links) ----------
   Separate from .al/.al2 (the user's own added annotations) : these come from the PDF's own Link
   annotations and only ever navigate or open a URL, they're never edited. Built once per page right
   after its layer exists - cheap (a handful of absolutely-positioned divs), so there's no need to tie
   it to the render/release visibility cycle the way the canvas and text layer are. */
async function buildLinkLayer(pg,pane){
  const layer=pane===2?pg.ll2:pg.ll;
  const builtKey=pane===2?'llBuilt2':'llBuilt';
  if(!layer||pg[builtKey])return;
  pg[builtKey]=true;
  try{
    const annots=await pg.proxy.getAnnotations({intent:'display'});
    const links=annots.filter(a=>a.subtype==='Link'&&(a.url||a.unsafeUrl||(a.dest&&a.dest.length!==0)));
    if(!links.length)return;
    const frag=document.createDocumentFragment();
    for(const a of links){
      const p1=pg.vp1.convertToViewportPoint(a.rect[0],a.rect[1]),p2=pg.vp1.convertToViewportPoint(a.rect[2],a.rect[3]);
      const x=Math.min(p1[0],p2[0]),y=Math.min(p1[1],p2[1]),w=Math.abs(p2[0]-p1[0]),h=Math.abs(p2[1]-p1[1]);
      const hit=document.createElement('div');
      hit.className='lnkhit';
      hit.style.left=x+'px';hit.style.top=y+'px';hit.style.width=w+'px';hit.style.height=h+'px';
      hit.title=a.url||a.unsafeUrl||'Aller à la page liée';
      hit.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();followLink(a,pane)});
      frag.append(hit);
    }
    layer.append(frag);
  }catch(e){console.error(e)}
}
async function followLink(a,pane){
  try{
    if(a.url||a.unsafeUrl){openExternal(a.url||a.unsafeUrl);return}
    let dest=a.dest;
    if(typeof dest==='string')dest=await S.pdf.getDestination(dest);
    if(!dest||!dest.length){toast('Ce lien ne pointe vers rien de reconnu.');return}
    const idx=await S.pdf.getPageIndex(dest[0]);
    if(pane===2)goto2(idx+1);else goto(idx+1);
  }catch(e){console.error(e);toast('Impossible de suivre ce lien.')}
}
async function buildTextLayer2(pg){
  if(pg.tlBuilt2||pg.tlBusy2||!pg.tl2)return;
  pg.tlBusy2=true;
  try{
    const groups=await getGroups(pg);
    if(!pg.rendered2)return;
    fillFonts(pg);
    pg.tl2.textContent='';
    const frag=document.createDocumentFragment();
    groups.forEach((g,i)=>{const sp=document.createElement('span');sp.dataset.g=i;setSpan(sp,g);frag.append(sp)});
    pg.tl2.append(frag);pg.tlBuilt2=true;
    paintMarks2(pg);
  }finally{pg.tlBusy2=false}
}

/* ---------- text extraction, grouping, text layer ---------- */
function cssFont(k){
  if(typeof k==='string'&&k.startsWith('u:')){
    const fam=k.slice(2),f=S.fonts.find(x=>x.family===fam);
    return (f?f.cssFam+',':'')+'Helvetica,Arial,"Liberation Sans",sans-serif';
  }
  return k==='times'?'"Times New Roman",Times,"Liberation Serif",serif'
    :k==='cour'?'"Courier New",Courier,"Liberation Mono",monospace'
    :'Helvetica,Arial,"Liberation Sans",sans-serif';
}
const mctx=document.createElement('canvas').getContext('2d');
function natW(str,kind,bold,italic){
  mctx.font=(italic?'italic ':'')+(bold?'bold ':'')+'100px '+cssFont(kind);
  return mctx.measureText(str).width/100;
}
function kindFrom(name,fam){
  const isSerif=/serif/.test(fam||'')&&!/sans-serif/.test(fam||'');
  if(/arial|helvet|sans|calibri|verdana|tahoma|segoe|roboto|inter|gothic|open ?sans|lato/i.test(name))return 'helv';
  if(/mono|courier|consol|typewriter/i.test(name)||/monospace/.test(fam||''))return 'cour';
  if(/times|georgia|garamond|palatino|minion|cambria|bookman|century|serif|roman|baskerville|didot/i.test(name)||isSerif)return 'times';
  return 'helv';
}
function fontInfo(pg,id){
  let name='',bold=false,italic=false,known=false;
  try{
    if(pg.proxy.commonObjs.has(id)){
      const f=pg.proxy.commonObjs.get(id);known=true;
      name=f.name||'';bold=!!f.bold;italic=!!f.italic;
    }
  }catch(e){}
  if(/bold|black|heavy|semibold|demi/i.test(name))bold=true;
  if(/italic|oblique/i.test(name))italic=true;
  const fam=((pg.styles||{})[id]||{}).fontFamily||'';
  return {kind:kindFrom(name,fam),bold,italic,name,known};
}
function getGroups(pg){
  if(pg.groups)return Promise.resolve(pg.groups);
  if(pg.gp)return pg.gp;
  pg.gp=(async()=>{
    const tc=await pg.proxy.getTextContent();
    pg.styles=tc.styles;
    const out=[];let prev=null;
    for(const it of tc.items){
      if(!('str' in it)||!it.str.trim())continue;
      const tx=pdfjsLib.Util.transform(pg.vp1.transform,it.transform);
      const size=Math.hypot(tx[2],tx[3]);
      if(!(size>0.5))continue;
      const st=tc.styles[it.fontName]||{};
      const cur={str:it.str,x:tx[4],y:tx[5],w:it.width,size,ang:Math.atan2(tx[1],tx[0]),font:it.fontName,
        asc:clamp(st.ascent!=null?st.ascent:0.85,0.6,1.1),desc:clamp(st.descent!=null?st.descent:-0.2,-0.4,-0.05),
        kind:kindFrom('',st.fontFamily),bold:false,italic:false};
      if(prev&&Math.abs(cur.ang)<1e-3&&Math.abs(prev.ang)<1e-3&&cur.font===prev.font&&
         Math.abs(size-prev.size)<0.6&&Math.abs(cur.y-prev.y)<0.25*size){
        const gap=cur.x-(prev.x+prev.w);
        if(gap>-0.6*size&&gap<0.9*size){
          const sp=(gap>0.17*size&&!/\s$/.test(prev.str)&&!/^\s/.test(cur.str))?' ':'';
          prev.str+=sp+cur.str;prev.w=Math.max(prev.w,cur.x+cur.w-prev.x);continue;
        }
      }
      if(!cur.str.trim())continue;
      out.push(cur);prev=cur;
    }
    for(const g of out)g.str=g.str.replace(/\s+$/,'');
    pg.groups=out;return out;
  })();
  return pg.gp;
}
function fillFonts(pg){
  if(pg.fontsDone||!pg.groups)return;
  const cache={};let all=true;
  for(const g of pg.groups){
    let fi=cache[g.font];if(!fi){fi=cache[g.font]=fontInfo(pg,g.font);if(!fi.known)all=false}
    g.kind=fi.kind;g.bold=fi.bold;g.italic=fi.italic;g.fname=fi.name;
  }
  pg.fontsDone=all;
}
function setSpan(sp,g){
  sp.textContent=g.str;
  const nw=natW(g.str,g.kind,g.bold,g.italic)*g.size;
  const r=nw>0?clamp(g.w/nw,0.2,5):1;
  sp.style.fontFamily=cssFont(g.kind);sp.style.fontSize=g.size+'px';
  sp.style.fontWeight=g.bold?'bold':'normal';sp.style.fontStyle=g.italic?'italic':'normal';
  sp.style.transform='translate('+g.x+'px,'+g.y+'px) rotate('+g.ang+'rad) translateY('+(-g.asc*g.size)+'px) scaleX('+r+')';
}
async function buildTextLayer(pg){
  if(pg.tlBuilt||pg.tlBusy)return;
  pg.tlBusy=true;
  try{
    const groups=await getGroups(pg);
    if(!pg.rendered)return;
    fillFonts(pg);
    pg.tl.textContent='';
    const frag=document.createDocumentFragment();
    groups.forEach((g,i)=>{const sp=document.createElement('span');sp.dataset.g=i;setSpan(sp,g);frag.append(sp)});
    pg.tl.append(frag);pg.tlBuilt=true;
    detectAutoLinks(pg);
    paintMarks(pg);
  }finally{pg.tlBusy=false}
}

/* ---------- thumbnails ---------- */
let tio=null,tq=[],tbusy=false;
function buildThumbs(){
  const box=$('#thumbs');box.innerHTML='';
  if(tio)tio.disconnect();tq=[];
  if(S.thumbsOpen===undefined)S.thumbsOpen=innerWidth>700;
  box.hidden=!S.thumbsOpen;$('#bThumbs').classList.toggle('on',S.thumbsOpen);
  tio=new IntersectionObserver(es=>{
    for(const e of es)if(e.isIntersecting){tio.unobserve(e.target);tq.push(S.pages[+e.target.dataset.n-1])}
    pumpThumbs();
  },{root:box,rootMargin:'300px 0px'});
  for(const pg of S.pages){
    const d=document.createElement('div');d.className='th';d.dataset.n=pg.n;
    d.draggable=true;
    d.innerHTML='<div class="box" style="width:118px;height:'+Math.round(118*pg.h/pg.w)+'px"></div><span>'+pg.n+'</span>'
      +'<div class="acts"><button data-a="up" title="Monter">'+ICONS.up+'</button><button data-a="down" title="Descendre">'+ICONS.down+'</button><button data-a="rotr" title="Pivoter">'+ICONS.rotr+'</button><button data-a="del" title="Supprimer">'+ICONS.trash+'</button></div>';
    d.addEventListener('click',e=>thClick(e,pg));
    d.addEventListener('dragstart',e=>thDragStart(e,pg));
    d.addEventListener('dragover',e=>thDragOver(e,pg));
    d.addEventListener('drop',e=>thDrop(e,pg));
    d.addEventListener('dragend',clearDrag);
    box.append(d);tio.observe(d);pg.th=d;
  }
}
async function pumpThumbs(){
  if(tbusy)return;tbusy=true;
  while(tq.length){
    const pg=tq.shift();
    if(!pg||!pg.th||pg.th.dataset.done)continue;
    try{
      const dpr=Math.min(devicePixelRatio||1,2);
      const vp=pg.proxy.getViewport({scale:118*dpr/pg.w});
      const c=document.createElement('canvas');c.width=Math.max(1,Math.floor(vp.width));c.height=Math.max(1,Math.floor(vp.height));
      const tctx=c.getContext('2d',{alpha:false});tctx.fillStyle='#fff';tctx.fillRect(0,0,c.width,c.height);
      c.style.width='118px';c.style.height=Math.round(118*pg.h/pg.w)+'px';
      await pg.proxy.render({canvasContext:tctx,viewport:vp}).promise;
      pg.th.dataset.done=1;pg.th.querySelector('.box').replaceWith(c);
    }catch(e){}
  }
  tbusy=false;
}

/* ---------- navigation and zoom ---------- */
function setCur(n){
  S.cur=n;$('#pgIn').value=n;$('#pgTot').textContent='/ '+S.pages.length;
  if(S.thSel.size<=1)S.thSel=new Set([n-1]);
  paintThumbSel();
  $$('.th.cur').forEach(t=>t.classList.remove('cur'));
  const pg=S.pages[n-1];
  if(pg&&pg.th){
    pg.th.classList.add('cur');
    const t=$('#thumbs');
    if(!t.hidden&&(pg.th.offsetTop<t.scrollTop||pg.th.offsetTop+pg.th.offsetHeight>t.scrollTop+t.clientHeight))t.scrollTop=pg.th.offsetTop-24;
  }
  syncUi();
}
function goto(n){
  n=clamp(Math.round(n)||1,1,S.pages.length||1);
  const pg=S.pages[n-1];if(!pg)return;
  viewer.scrollTop=pg.el.offsetTop-12;setCur(n);
}
let sraf=0;
viewer.addEventListener('scroll',()=>{if(sraf)return;sraf=requestAnimationFrame(()=>{sraf=0;updateCur()})});
function updateCur(){
  if(!S.pages.length)return;
  const y=viewer.scrollTop+viewer.clientHeight*0.35;let lo=0,hi=S.pages.length-1;
  while(lo<hi){const m=(lo+hi+1)>>1;if(S.pages[m].el.offsetTop<=y)lo=m;else hi=m-1}
  if(S.cur!==lo+1)setCur(lo+1);
}
function setZoom(z,noAnchor){
  z=clamp(z,0.25,4);
  let anchor=null;
  if(!noAnchor&&S.pages.length&&S.pages[S.cur-1]&&S.pages[S.cur-1].el){
    const pg=S.pages[S.cur-1];anchor={n:S.cur,f:(viewer.scrollTop-pg.el.offsetTop)/pg.el.offsetHeight};
  }
  S.zoom=z;pagesEl.style.setProperty('--z',z);$('#zLbl').textContent=Math.round(z*100)+' %';
  if(anchor){const pg=S.pages[anchor.n-1];viewer.scrollTop=pg.el.offsetTop+anchor.f*pg.el.offsetHeight}
  clearTimeout(zT);zT=setTimeout(rerender,140);
}
function stepZoom(dir){
  const z=S.zoom;
  if(dir>0){const n=ZSTEPS.find(s=>s>z*1.02);setZoom(n||4)}
  else{const n=[...ZSTEPS].reverse().find(s=>s<z/1.02);setZoom(n||0.25)}
}
function fitWidthValue(pg,cap,ve){
  const gut=innerWidth<=700?18:36;
  return clamp(((ve||viewer).clientWidth-gut)/pg.w,0.25,cap||4);
}
function fitWidth(){const pg=S.pages[S.cur-1]||S.pages[0];if(pg)setZoom(fitWidthValue(pg),true)}
function fitPage(){
  const pg=S.pages[S.cur-1]||S.pages[0];if(!pg)return;
  setZoom(Math.min(fitWidthValue(pg),(viewer.clientHeight-30)/pg.h));
}
viewer.addEventListener('wheel',e=>{
  if(!(e.ctrlKey||e.metaKey)||!S.pages.length)return;
  e.preventDefault();setZoom(S.zoom*Math.exp(-e.deltaY*0.0022));
},{passive:false});

/* ---------- pane 2: independent navigation and zoom ---------- */
function setCur2(n){
  S.cur2=n;refreshToolbarForActive();
}
function goto2(n){
  n=clamp(Math.round(n)||1,1,S.pages.length||1);
  const pg=S.pages[n-1];if(!pg||!pg.el2)return;
  viewer2.scrollTop=pg.el2.offsetTop-12;setCur2(n);
}
let sraf2=0;
viewer2.addEventListener('scroll',()=>{if(sraf2)return;sraf2=requestAnimationFrame(()=>{sraf2=0;updateCur2()})});
function updateCur2(){
  if(!S.pages.length||!S.split)return;
  const y=viewer2.scrollTop+viewer2.clientHeight*0.35;let lo=0,hi=S.pages.length-1;
  while(lo<hi){const m=(lo+hi+1)>>1;if(S.pages[m].el2&&S.pages[m].el2.offsetTop<=y)lo=m;else hi=m-1}
  if(S.cur2!==lo+1)setCur2(lo+1);
}
function setZoom2(z,noAnchor){
  z=clamp(z,0.25,4);
  let anchor=null;
  if(!noAnchor&&S.pages.length&&S.pages[S.cur2-1]&&S.pages[S.cur2-1].el2){
    const pg=S.pages[S.cur2-1];anchor={n:S.cur2,f:(viewer2.scrollTop-pg.el2.offsetTop)/pg.el2.offsetHeight};
  }
  S.zoom2=z;pagesEl2.style.setProperty('--z',z);refreshToolbarForActive();
  if(anchor){const pg=S.pages[anchor.n-1];viewer2.scrollTop=pg.el2.offsetTop+anchor.f*pg.el2.offsetHeight}
  clearTimeout(zT2);zT2=setTimeout(rerender2,140);
}
function stepZoom2(dir){
  const z=S.zoom2;
  if(dir>0){const n=ZSTEPS.find(s=>s>z*1.02);setZoom2(n||4)}
  else{const n=[...ZSTEPS].reverse().find(s=>s<z/1.02);setZoom2(n||0.25)}
}
function fitWidth2(){const pg=S.pages[S.cur2-1]||S.pages[0];if(pg)setZoom2(fitWidthValue(pg,4,viewer2),true)}
function fitPage2(){
  const pg=S.pages[S.cur2-1]||S.pages[0];if(!pg)return;
  setZoom2(Math.min(fitWidthValue(pg,4,viewer2),(viewer2.clientHeight-30)/pg.h));
}
viewer2.addEventListener('wheel',e=>{
  if(!(e.ctrlKey||e.metaKey)||!S.pages.length)return;
  e.preventDefault();setZoom2(S.zoom2*Math.exp(-e.deltaY*0.0022));
},{passive:false});

/* ---------- search: find / replace ---------- */
S.so={cs:false,ww:false,acc:true,re:false};S.trunc=false;
S.so2={cs:false,ww:false,acc:true,re:false};S.trunc2=false;
function fold(s,o){
  let r='';
  for(let i=0;i<s.length;i++){
    let c=s[i];
    if(o.acc){const d=c.normalize('NFD')[0];if(d)c=d}
    if(!o.cs&&!o.re){const l=c.toLowerCase();if(l.length===1)c=l}
    r+=c;
  }
  return r;
}
const isWordCh=c=>!!c&&/[\p{L}\p{N}_]/u.test(c);
/* the annotation that currently replaces a text group, if any */
function editOf(pg,g){
  return S.annots.find(a=>a.type==='edit'&&a.n===pg.n&&a.orig===g.str&&Math.abs(a.x-g.x)<0.6&&(a.gy==null||Math.abs(a.gy-g.y)<0.6))||null;
}
async function pageCorpus(pg){
  const gs=await getGroups(pg);
  const segs=[];let text='';
  gs.forEach((g,gi)=>{
    const ea=editOf(pg,g);
    const str=ea?String(ea.text||''):g.str;
    if(gi)text+=' ';
    segs.push({g:gi,start:text.length,len:str.length,ea:!!ea});
    text+=str.replace(/[\r\n]/g,' ');
  });
  return {text,segs};
}
function paintMarks(pg){
  if(!pg.tlBuilt||!pg.groups)return;
  const by={};
  for(const h of S.hits)if(h.n===pg.n)for(const p of h.parts)if(!p.ea)(by[p.g]=by[p.g]||[]).push({h,p});
  const cur=S.hits[S.hix];
  pg.tl.querySelectorAll('span').forEach(sp=>{
    const gi=sp.dataset.g,g=pg.groups[+gi],hs=by[gi];
    if(!hs){if(sp.firstElementChild)sp.textContent=g.str;return}
    sp.textContent='';let pos=0;
    for(const {h,p} of hs){
      if(p.s>pos)sp.append(g.str.slice(pos,p.s));
      const m=document.createElement('mark');m.textContent=g.str.slice(p.s,p.s+p.l);
      if(h===cur)m.className='cur';sp.append(m);pos=p.s+p.l;
    }
    if(pos<g.str.length)sp.append(g.str.slice(pos));
  });
}
function paintMarks2(pg){
  if(!pg.tlBuilt2||!pg.groups||!pg.tl2)return;
  const by={};
  for(const h of S.hits2)if(h.n===pg.n)for(const p of h.parts)if(!p.ea)(by[p.g]=by[p.g]||[]).push({h,p});
  const cur=S.hits2[S.hix2];
  pg.tl2.querySelectorAll('span').forEach(sp=>{
    const gi=sp.dataset.g,g=pg.groups[+gi],hs=by[gi];
    if(!hs){if(sp.firstElementChild)sp.textContent=g.str;return}
    sp.textContent='';let pos=0;
    for(const {h,p} of hs){
      if(p.s>pos)sp.append(g.str.slice(pos,p.s));
      const m=document.createElement('mark');m.textContent=g.str.slice(p.s,p.s+p.l);
      if(h===cur)m.className='cur';sp.append(m);pos=p.s+p.l;
    }
    if(pos<g.str.length)sp.append(g.str.slice(pos));
  });
}
let sTok=0;
async function runSearch(q,keepIdx){
  if(q===undefined)q=S.q;
  const tok=++sTok;S.q=q;S.hits=[];S.hix=-1;S.trunc=false;
  const o=S.so;
  if(!q||!q.trim()){S.pages.forEach(paintMarks);renderList();updateCnt();return}
  let re=null,needle='';
  if(o.re){
    try{re=new RegExp(fold(q,{...o,cs:true}),'gu'+(o.cs?'':'i'))}
    catch(e){S.pages.forEach(paintMarks);renderList();$('#sCnt').textContent='Expression invalide';return}
  }else needle=fold(q,o);
  $('#sCnt').textContent='…';
  outer:for(const pg of S.pages){
    const {text,segs}=await pageCorpus(pg);
    if(tok!==sTok)return;
    const hay=fold(text,o),found=[];
    if(re){
      re.lastIndex=0;let m;
      while((m=re.exec(hay))){
        if(!m[0]){re.lastIndex++;continue}
        found.push([m.index,m[0].length]);
      }
    }else{
      let p=0;
      while((p=hay.indexOf(needle,p))>=0){found.push([p,needle.length]);p+=Math.max(1,needle.length)}
    }
    for(const [s,l] of found){
      if(o.ww&&(isWordCh(hay[s-1])||isWordCh(hay[s+l])))continue;
      const parts=[];
      for(const sg of segs){
        const a=Math.max(s,sg.start),b=Math.min(s+l,sg.start+sg.len);
        if(b>a)parts.push({g:sg.g,s:a-sg.start,l:b-a,ea:sg.ea});
      }
      if(!parts.length)continue;
      S.hits.push({n:pg.n,parts,text:text.slice(s,s+l),
        c0:(s>28?'…':'')+text.slice(Math.max(0,s-28),s),c2:text.slice(s+l,s+l+45)});
      if(S.hits.length>=3000){S.trunc=true;break outer}
    }
  }
  if(tok!==sTok)return;
  if(S.hits.length){
    let k=keepIdx!=null?Math.min(keepIdx,S.hits.length-1):S.hits.findIndex(h=>h.n>=S.cur);
    if(k<0)k=0;S.hix=k;
  }
  renderList();
  if(S.hits.length)focusHit();else{S.pages.forEach(paintMarks);updateCnt()}
}
function updateCnt(){
  const el=$('#sCnt');
  if(!S.q||!S.q.trim()){el.textContent='';return}
  el.textContent=S.hits.length?(S.hix+1)+' / '+S.hits.length+(S.trunc?'+':''):'Aucun résultat';
}
function renderList(){
  const box=$('#sList');
  if(!S.hits.length){
    box.innerHTML=(S.q&&S.q.trim()&&!/Expression/.test($('#sCnt').textContent))?'<div class="sn">Aucun résultat.</div>':'';
    return;
  }
  const per={};for(const h of S.hits)per[h.n]=(per[h.n]||0)+1;
  const max=Math.min(S.hits.length,500);let html='',last=0;
  for(let i=0;i<max;i++){
    const h=S.hits[i];
    if(h.n!==last){last=h.n;html+='<div class="sg">Page '+h.n+' · '+per[h.n]+' résultat'+(per[h.n]>1?'s':'')+'</div>'}
    html+='<button class="si" role="option" data-i="'+i+'">'+esc(h.c0)+'<b>'+esc(h.text)+'</b>'+esc(h.c2)+'</button>';
  }
  if(S.hits.length>max)html+='<div class="sn">'+(S.hits.length-max)+(S.trunc?'+':'')+' autres résultats : affinez la recherche pour les lister. Les boutons ↑ ↓ les parcourent tous.</div>';
  box.innerHTML=html;markCur();
}
function markCur(){
  const box=$('#sList');
  box.querySelectorAll('.si.cur').forEach(n=>n.classList.remove('cur'));
  const it=box.querySelector('.si[data-i="'+S.hix+'"]');
  if(it){it.classList.add('cur');it.scrollIntoView({block:'nearest'})}
}
function focusHit(){
  const h=S.hits[S.hix];if(!h)return;
  const pg=S.pages[h.n-1],g=pg.groups[h.parts[0].g];
  viewer.scrollTop=Math.max(0,pg.el.offsetTop+g.y*S.zoom-viewer.clientHeight/3);
  S.pages.forEach(paintMarks);updateCnt();markCur();
}
function stepHit(d){
  if(!S.hits.length)return;
  S.hix=(S.hix+d+S.hits.length)%S.hits.length;focusHit();
}
async function ensureRendered(pg){
  for(let i=0;i<60&&!pg.rendered;i++){
    if(!pg.busy)await renderPage(pg);else await new Promise(r=>setTimeout(r,50));
  }
}
function expandRep(h,rep){
  const o=S.so;
  if(!o.re)return rep;
  try{return h.text.replace(new RegExp(S.q,(o.cs?'':'i')+'u'),rep)}catch(e){return rep}
}
async function doReplace(all){
  if(!S.hits.length)return;
  commitEdit();
  const rep=$('#rIn').value,list=all?S.hits.slice():[S.hits[S.hix]];
  const jobs=new Map();let skipped=0;
  for(const h of list){
    if(!h||h.parts.length!==1){skipped++;continue}
    const p=h.parts[0],pg=S.pages[h.n-1],g=pg.groups[p.g];
    if(!g||Math.abs(g.ang)>1e-3){skipped++;continue}
    const k=h.n+':'+p.g;
    if(!jobs.has(k))jobs.set(k,{pg,g,items:[]});
    jobs.get(k).items.push({h,p});
  }
  if(!jobs.size){toast('Ce résultat ne peut pas être remplacé automatiquement (texte sur plusieurs lignes ou pivoté).',4500);return}
  busy(true,'Remplacement…');
  let count=0;const idx=S.hix;
  try{
    for(const j of jobs.values()){
      let a=editOf(j.pg,j.g);
      if(!a){
        await ensureRendered(j.pg);fillFonts(j.pg);
        a=createEditAnn(j.pg,j.g);
      }
      let t=String(a.text||'');
      for(const it of j.items.sort((x,y)=>y.p.s-x.p.s)){
        t=t.slice(0,it.p.s)+expandRep(it.h,rep)+t.slice(it.p.s+it.p.l);count++;
      }
      a.text=t;renderOne(a);
      if(!nearViewport(j.pg))releasePage(j.pg);
    }
    pushHist();
  }finally{busy(false)}
  await runSearch(S.q,all?0:idx);
  toast(count+' remplacement'+(count>1?'s':'')+' effectué'+(count>1?'s':'')+(skipped?' · '+skipped+' ignoré'+(skipped>1?'s':'')+' (texte sur plusieurs lignes ou pivoté)':'')+'.',skipped?5000:2500);
}

/* ---------- pane 2: independent search (view-only, no replace) ---------- */
let sTok2=0;
async function runSearch2(q,keepIdx){
  if(q===undefined)q=S.q2;
  const tok=++sTok2;S.q2=q;S.hits2=[];S.hix2=-1;S.trunc2=false;
  const o=S.so2;
  if(!q||!q.trim()){S.pages.forEach(paintMarks2);renderList2();updateCnt2();return}
  let re=null,needle='';
  if(o.re){
    try{re=new RegExp(fold(q,{...o,cs:true}),'gu'+(o.cs?'':'i'))}
    catch(e){S.pages.forEach(paintMarks2);renderList2();$('#sCnt2').textContent='Expression invalide';return}
  }else needle=fold(q,o);
  $('#sCnt2').textContent='…';
  outer:for(const pg of S.pages){
    const {text,segs}=await pageCorpus(pg);
    if(tok!==sTok2)return;
    const hay=fold(text,o),found=[];
    if(re){
      re.lastIndex=0;let m;
      while((m=re.exec(hay))){
        if(!m[0]){re.lastIndex++;continue}
        found.push([m.index,m[0].length]);
      }
    }else{
      let p=0;
      while((p=hay.indexOf(needle,p))>=0){found.push([p,needle.length]);p+=Math.max(1,needle.length)}
    }
    for(const [s,l] of found){
      if(o.ww&&(isWordCh(hay[s-1])||isWordCh(hay[s+l])))continue;
      const parts=[];
      for(const sg of segs){
        const a=Math.max(s,sg.start),b=Math.min(s+l,sg.start+sg.len);
        if(b>a)parts.push({g:sg.g,s:a-sg.start,l:b-a,ea:sg.ea});
      }
      if(!parts.length)continue;
      S.hits2.push({n:pg.n,parts,text:text.slice(s,s+l),
        c0:(s>28?'…':'')+text.slice(Math.max(0,s-28),s),c2:text.slice(s+l,s+l+45)});
      if(S.hits2.length>=3000){S.trunc2=true;break outer}
    }
  }
  if(tok!==sTok2)return;
  if(S.hits2.length){
    let k=keepIdx!=null?Math.min(keepIdx,S.hits2.length-1):S.hits2.findIndex(h=>h.n>=S.cur2);
    if(k<0)k=0;S.hix2=k;
  }
  renderList2();
  if(S.hits2.length)focusHit2();else{S.pages.forEach(paintMarks2);updateCnt2()}
}
function updateCnt2(){
  const el=$('#sCnt2');
  if(!S.q2||!S.q2.trim()){el.textContent='';return}
  el.textContent=S.hits2.length?(S.hix2+1)+' / '+S.hits2.length+(S.trunc2?'+':''):'Aucun résultat';
}
function renderList2(){
  const box=$('#sList2');
  if(!S.hits2.length){
    box.innerHTML=(S.q2&&S.q2.trim()&&!/Expression/.test($('#sCnt2').textContent))?'<div class="sn">Aucun résultat.</div>':'';
    return;
  }
  const per={};for(const h of S.hits2)per[h.n]=(per[h.n]||0)+1;
  const max=Math.min(S.hits2.length,500);let html='',last=0;
  for(let i=0;i<max;i++){
    const h=S.hits2[i];
    if(h.n!==last){last=h.n;html+='<div class="sg">Page '+h.n+' · '+per[h.n]+' résultat'+(per[h.n]>1?'s':'')+'</div>'}
    html+='<button class="si" role="option" data-i="'+i+'">'+esc(h.c0)+'<b>'+esc(h.text)+'</b>'+esc(h.c2)+'</button>';
  }
  if(S.hits2.length>max)html+='<div class="sn">'+(S.hits2.length-max)+(S.trunc2?'+':'')+' autres résultats : affinez la recherche pour les lister.</div>';
  box.innerHTML=html;markCur2();
}
function markCur2(){
  const box=$('#sList2');
  box.querySelectorAll('.si.cur').forEach(n=>n.classList.remove('cur'));
  const it=box.querySelector('.si[data-i="'+S.hix2+'"]');
  if(it){it.classList.add('cur');it.scrollIntoView({block:'nearest'})}
}
function focusHit2(){
  const h=S.hits2[S.hix2];if(!h)return;
  const pg=S.pages[h.n-1],g=pg.groups[h.parts[0].g];
  if(pg.el2)viewer2.scrollTop=Math.max(0,pg.el2.offsetTop+g.y*S.zoom2-viewer2.clientHeight/3);
  S.cur2=h.n;
  S.pages.forEach(paintMarks2);updateCnt2();markCur2();refreshToolbarForActive();
}
function stepHit2(d){
  if(!S.hits2.length)return;
  S.hix2=(S.hix2+d+S.hits2.length)%S.hits2.length;focusHit2();
}

/* ---------- thumbnail selection, actions and drag and drop ---------- */
let thAnchor=0,dragIdx=null;
function selIdx(){
  const s=[...S.thSel].filter(i=>i>=0&&i<S.pages.length).sort((a,b)=>a-b);
  return s.length?s:[Math.max(0,S.cur-1)];
}
function paintThumbSel(){
  S.pages.forEach((p,i)=>{if(p.th)p.th.classList.toggle('sel',S.thSel.has(i))});
}
function thClick(e,pg){
  const i=pg.n-1,btn=e.target.closest('.acts button');
  $('#thumbs').focus({preventScroll:true});
  if(btn){
    e.stopPropagation();
    if(!S.thSel.has(i)){S.thSel=new Set([i]);paintThumbSel()}
    pageOp(btn.dataset.a,selIdx());return;
  }
  if(e.shiftKey){
    const a=Math.min(thAnchor,i),b=Math.max(thAnchor,i);S.thSel=new Set();
    for(let k=a;k<=b;k++)S.thSel.add(k);
  }else if(e.ctrlKey||e.metaKey){
    if(S.thSel.has(i)&&S.thSel.size>1)S.thSel.delete(i);else S.thSel.add(i);
    thAnchor=i;
  }else{S.thSel=new Set([i]);thAnchor=i;goto(pg.n)}
  paintThumbSel();syncUi();
}
function clearDrag(){
  dragIdx=null;
  document.querySelectorAll('.th').forEach(t=>t.classList.remove('drag','ins-b','ins-a'));
}
function thDragStart(e,pg){
  const i=pg.n-1;
  if(!S.thSel.has(i)){S.thSel=new Set([i]);paintThumbSel()}
  dragIdx=i;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain','pages');
  S.thSel.forEach(j=>{if(S.pages[j]&&S.pages[j].th)S.pages[j].th.classList.add('drag')});
}
function thDragOver(e,pg){
  if(dragIdx==null)return;
  e.preventDefault();e.dataTransfer.dropEffect='move';
  const r=pg.th.getBoundingClientRect(),before=e.clientY<r.top+r.height/2;
  document.querySelectorAll('.th').forEach(t=>t.classList.remove('ins-b','ins-a'));
  pg.th.classList.add(before?'ins-b':'ins-a');pg.th._before=before;
}
function thDrop(e,pg){
  if(dragIdx==null)return;
  e.preventDefault();
  const gap=pg.n-1+(pg.th._before?0:1),sel=selIdx();
  clearDrag();pageOp('move',sel,gap);
}

/* ---------- annotations: model, DOM, interaction ---------- */
S.def={
  text:{size:14,kind:'helv',bold:false,italic:false,color:'#000000'},
  rect:{fill:'#ffffff',stroke:'#1a2230',sw:1.5},
  hl:{color:'#ffe45c'},
  pen:{color:'#d4380d',w:2}
};
const findAnn=id=>S.annots.find(a=>a.id===id);
const pageOf=a=>S.pages[a.n-1];
const isTextual=a=>a&&(a.type==='text'||a.type==='edit');
function layerEl(a){const pg=pageOf(a);return pg&&pg.al?pg.al.querySelector('[data-id="'+a.id+'"]'):null}
function ptOf(pg,e){
  const r=pg.al.getBoundingClientRect();const k=r.width/pg.w||1;
  return {x:(e.clientX-r.left)/k,y:(e.clientY-r.top)/k};
}
function styleText(el,a){
  el.style.fontFamily=cssFont(a.kind);el.style.fontSize=a.size+'px';
  el.style.fontWeight=a.bold?'bold':'normal';el.style.fontStyle=a.italic?'italic':'normal';
  el.style.color=a.color;el.style.lineHeight='1.2';
  el.style.left=a.x+'px';el.style.top=a.y+'px';
}
function penBounds(a){
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(const p of a.pts){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}
  return {x:x0,y:y0,w:x1-x0,h:y1-y0};
}
function makeEls(a){
  const out=[];const pg=pageOf(a);
  if(a.type==='nolink')return out;
  const sel=S.sel===a.id;
  if(a.type==='edit'){
    const c=document.createElement('div');c.className='a-cover';c.dataset.cid=a.id;
    Object.assign(c.style,{position:'absolute',left:a.cx+'px',top:a.cy+'px',width:a.cw+'px',height:a.ch+'px',background:a.bg,pointerEvents:'none'});
    out.push(c);
  }
  let el;
  if(a.type==='text'||a.type==='edit'){
    el=document.createElement('div');el.className='a '+(a.type==='text'?'a-text':'a-edit');
    styleText(el,a);el.textContent=a.text;
  }else if(a.type==='image'){
    el=document.createElement('div');el.className='a a-img';
    const im=document.createElement('img');im.src=(S.imgs[a.img]||{}).url||'';im.alt='';el.append(im);
    Object.assign(el.style,{left:a.x+'px',top:a.y+'px',width:a.w+'px',height:a.h+'px'});
  }else if(a.type==='rect'||a.type==='hl'){
    el=document.createElement('div');el.className='a '+(a.type==='rect'?'a-rect':'a-hl');
    Object.assign(el.style,{left:a.x+'px',top:a.y+'px',width:a.w+'px',height:a.h+'px'});
    if(a.type==='hl'){el.style.background=a.color;el.style.opacity='.42'}
    else{
      el.style.background=a.fill||'transparent';
      el.style.border=a.stroke?(a.sw+'px solid '+a.stroke):'0';
      el.style.boxSizing='border-box';
    }
  }else if(a.type==='link'){
    el=document.createElement('div');el.className='a a-link';
    Object.assign(el.style,{left:a.x+'px',top:a.y+'px',width:a.w+'px',height:a.h+'px'});
    el.title=linkTitle(a);
  }else if(a.type==='note'){
    el=document.createElement('div');el.className='a a-note';
    Object.assign(el.style,{left:a.x+'px',top:a.y+'px'});
    el.title=a.text||'Commentaire vide';el.innerHTML=NOTE_SVG;
    if(sel)out.push(notePop(a,pg));
  }else if(a.type==='pen'){
    const ns='http://www.w3.org/2000/svg';
    el=document.createElementNS(ns,'svg');el.setAttribute('class','a a-pen');
    el.setAttribute('width',pg.w);el.setAttribute('height',pg.h);el.setAttribute('viewBox','0 0 '+pg.w+' '+pg.h);
    const d=a.pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)).join(' ')+(a.pts.length===1?' l0.01 0':'');
    const hit=document.createElementNS(ns,'path');hit.setAttribute('d',d);hit.setAttribute('fill','none');
    hit.setAttribute('stroke','rgba(0,0,0,0)');hit.setAttribute('stroke-width',Math.max(a.w,10));hit.setAttribute('stroke-linecap','round');hit.setAttribute('stroke-linejoin','round');
    const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('fill','none');
    p.setAttribute('stroke',a.color);p.setAttribute('stroke-width',a.w);p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');
    p.style.pointerEvents='none';
    el.append(hit,p);
  }
  el.dataset.id=a.id;
  if(sel){
    el.classList.add('sel');
    if(a.type==='image'||a.type==='rect'||a.type==='hl'||a.type==='link'){
      for(const h of ['nw','ne','sw','se']){
        const d=document.createElement('div');d.className='hd '+h;d.dataset.h=h;
        d.style.left=h[1]==='w'?'0':'100%';d.style.top=h[0]==='n'?'0':'100%';el.append(d);
      }
    }
    if(a.type==='pen'){
      const b=penBounds(a);const o=document.createElementNS('http://www.w3.org/2000/svg','rect');
      o.setAttribute('x',b.x-4);o.setAttribute('y',b.y-4);o.setAttribute('width',b.w+8);o.setAttribute('height',b.h+8);
      o.setAttribute('fill','none');o.setAttribute('stroke','var(--accent)');o.setAttribute('stroke-width','1');o.setAttribute('stroke-dasharray','4 3');
      o.style.pointerEvents='none';el.append(o);
    }
  }
  out.push(el);return out;
}
/* pane 2 (split view) mirrors the same annotations, read-only */
function annLayers(pg){return pg.al2?[pg.al,pg.al2]:[pg.al]}
function renderAnnots(pg){
  if(S.editing){const ea=findAnn(S.editing);if(ea&&ea.n===pg.n)return}
  for(const al of annLayers(pg)){
    al.textContent='';
    for(const a of S.annots)if(a.n===pg.n)al.append(...makeEls(a));
  }
  refreshLinkHits(pg);
}
function renderAllAnnots(){S.pages.forEach(renderAnnots)}
function renderOne(a){
  const pg=pageOf(a);if(!pg)return;
  for(const al of annLayers(pg)){
    al.querySelectorAll('[data-id="'+a.id+'"],[data-cid="'+a.id+'"]').forEach(n=>n.remove());
    al.append(...makeEls(a));
  }
  if(a.type==='link')refreshLinkHits(pg);
}
function claimSel(id){
  const prev=S.sel;S.sel=id;
  if(prev&&prev!==id){const p=findAnn(prev);if(p)renderOne(p)}
}
function selectAnn(id){
  const prev=S.sel;S.sel=id;
  if(prev&&prev!==id){const p=findAnn(prev);if(p)renderOne(p)}
  if(id){
    const a=findAnn(id);
    if(a){const i=S.annots.indexOf(a);S.annots.splice(i,1);S.annots.push(a);renderOne(a)}
  }
  renderProps(true);
}
function removeAnn(id,hist){
  const a=findAnn(id);if(!a)return;
  S.annots=S.annots.filter(x=>x.id!==id);
  if(a.type==='link')suppressAuto(a);
  if(S.sel===id)S.sel=null;
  const pg=pageOf(a);
  if(pg)annLayers(pg).forEach(al=>al.querySelectorAll('[data-id="'+id+'"],[data-cid="'+id+'"]').forEach(n=>n.remove()));
  if(a.type==='link')refreshLinkHits(pg);
  if(hist)pushHist();
  renderProps(true);
}
function dupAnn(){
  const a=findAnn(S.sel);if(!a)return;
  const b=JSON.parse(JSON.stringify(a));b.id=uid();
  if(b.type==='edit'){b.type='text';delete b.cx;delete b.cy;delete b.cw;delete b.ch;delete b.bg;delete b.orig}
  if(b.pts)b.pts=b.pts.map(p=>[p[0]+12,p[1]+12]);else{b.x+=12;b.y+=12}
  S.annots.push(b);pushHist();selectAnn(b.id);renderOne(b);
}

/* drag and resize */
function startDrag(pg,a,e,mode,wasSel){
  const p0=ptOf(pg,e);const orig=JSON.parse(JSON.stringify(a));let moved=false;
  const mv=ev=>{
    const p=ptOf(pg,ev);const dx=p.x-p0.x,dy=p.y-p0.y;
    if(!moved&&Math.hypot(dx,dy)*S.zoom<3)return;
    moved=true;applyDrag(a,orig,mode,dx,dy,pg);renderOne(a);
  };
  const up=()=>{
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(moved)pushHist();
    else if(wasSel&&isTextual(a)&&mode==='move')editText(a);
  };
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}
function applyDrag(a,o,mode,dx,dy,pg){
  if(mode==='move'){
    if(a.type==='pen'){a.pts=o.pts.map(p=>[p[0]+dx,p[1]+dy]);return}
    a.x=o.x+dx;a.y=o.y+dy;
    if(a.type==='note'){a.x=clamp(a.x,0,pg.w-NOTE_SIZE);a.y=clamp(a.y,0,pg.h-NOTE_SIZE);return}
    if(a.w!=null){a.x=clamp(a.x,10-a.w,pg.w-10);a.y=clamp(a.y,10-a.h,pg.h-10)}
    return;
  }
  const MIN=6;const left=mode[1]==='w',top=mode[0]==='n';
  if(a.type==='image'){
    const r=o.w/o.h;let w=o.w+(left?-dx:dx);w=Math.max(MIN*2,w);const h=w/r;
    a.w=w;a.h=h;a.x=left?o.x+o.w-w:o.x;a.y=top?o.y+o.h-h:o.y;return;
  }
  let x=o.x,y=o.y,w=o.w,h=o.h;
  if(left){x=o.x+dx;w=o.w-dx}else w=o.w+dx;
  if(top){y=o.y+dy;h=o.h-dy}else h=o.h+dy;
  if(w<MIN){if(left)x=o.x+o.w-MIN;w=MIN}
  if(h<MIN){if(top)y=o.y+o.h-MIN;h=MIN}
  a.x=x;a.y=y;a.w=w;a.h=h;
}

/* layer events */
function bindLayers(pg){
  pg.al.addEventListener('pointerdown',e=>onAlDown(pg,e));
  pg.al.addEventListener('dblclick',e=>{
    const el=e.target.closest&&e.target.closest('[data-id]');if(!el)return;
    const a=findAnn(el.dataset.id);if(a&&isTextual(a))editText(a);
  });
  pg.tl.addEventListener('click',e=>onTlClick(pg,e));
}
function onAlDown(pg,e){
  if(e.button!==undefined&&e.button!==0)return;
  const t=e.target;
  const hd=t.closest&&t.closest('.hd');
  const el=t.closest&&t.closest('[data-id]');
  if(el){
    const a=findAnn(el.dataset.id);if(!a)return;
    if(S.editing===a.id)return;
    commitEdit();
    const was=S.sel===a.id;
    e.preventDefault();
    selectAnn(a.id);
    startDrag(pg,findAnn(a.id),e,hd?hd.dataset.h:'move',was);
    return;
  }
  if(t!==pg.al)return;
  commitEdit();
  if(S.tool==='text'){e.preventDefault();createText(pg,ptOf(pg,e))}
  else if(S.tool==='rect'){e.preventDefault();drawRect(pg,e)}
  else if(S.tool==='pen'){e.preventDefault();drawPen(pg,e)}
  else if(S.tool==='shot'){e.preventDefault();drawShot(pg,e)}
  else if(S.tool==='link'){e.preventDefault();const au=autoLinkAt(pg,ptOf(pg,e));if(au)convertAuto(pg,au);else drawLink(pg,e)}
  else if(S.tool==='note'){e.preventDefault();createNote(pg,ptOf(pg,e))}
}
/* capture a rectangular zone of the rendered page as a PNG (main view only) */
function drawShot(pg,e){
  const p0=ptOf(pg,e);
  const box=document.createElement('div');box.className='shot-box';
  const upd=(x,y,w,h)=>Object.assign(box.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  upd(p0.x,p0.y,0,0);pg.al.appendChild(box);
  const mv=ev=>{
    const p=ptOf(pg,ev);
    upd(Math.min(p0.x,p.x),Math.min(p0.y,p.y),Math.abs(p.x-p0.x),Math.abs(p.y-p0.y));
  };
  const up=ev=>{
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);
    const p=ptOf(pg,ev);
    const x=Math.min(p0.x,p.x),y=Math.min(p0.y,p.y),w=Math.abs(p.x-p0.x),h=Math.abs(p.y-p0.y);
    box.remove();
    if(w<6||h<6)return;
    captureRegion(pg,x,y,w,h);
  };
  const cancel=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);box.remove()};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
}
async function captureRegion(pg,x,y,w,h){
  busy(true,'Capture…');
  try{
    if(!pg.rendered)await ensureRendered(pg);
    const cv=pg.cv,k=cv.width/pg.w;
    const sx=Math.max(0,Math.round(x*k)),sy=Math.max(0,Math.round(y*k));
    const sw=Math.min(cv.width-sx,Math.round(w*k)),sh=Math.min(cv.height-sy,Math.round(h*k));
    if(sw<2||sh<2){toast('Zone trop petite.');return}
    const out=document.createElement('canvas');out.width=sw;out.height=sh;
    out.getContext('2d').drawImage(cv,sx,sy,sw,sh,0,0,sw,sh);
    out.toBlob(blob=>{
      if(!blob){toast('La capture a échoué.');return}
      if(S.shotUrl)URL.revokeObjectURL(S.shotUrl);
      S.shotUrl=URL.createObjectURL(blob);S.shotBlob=blob;
      $('#shotImg').src=S.shotUrl;$('#shotBar').hidden=false;
    },'image/png');
  }finally{busy(false)}
}
function createText(pg,p){
  const d=S.def.text;
  const a={id:uid(),type:'text',n:pg.n,x:p.x,y:p.y-d.size*0.6,size:d.size,kind:d.kind,bold:d.bold,italic:d.italic,color:d.color,text:''};
  S.annots.push(a);S.newId=a.id;
  claimSel(a.id);renderOne(a);renderProps(true);editText(a);
}
function drawRect(pg,e){
  const p0=ptOf(pg,e);const d=S.def.rect;
  const a={id:uid(),type:'rect',n:pg.n,x:p0.x,y:p0.y,w:0,h:0,fill:d.fill,stroke:d.stroke,sw:d.sw};
  S.annots.push(a);
  const mv=ev=>{
    const p=ptOf(pg,ev);
    a.x=Math.min(p0.x,p.x);a.y=Math.min(p0.y,p.y);a.w=Math.abs(p.x-p0.x);a.h=Math.abs(p.y-p0.y);renderOne(a);
  };
  const up=()=>{
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(a.w<4||a.h<4){removeAnn(a.id,false);return}
    pushHist();selectAnn(a.id);
  };
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}
function drawPen(pg,e){
  const p0=ptOf(pg,e);const d=S.def.pen;
  const a={id:uid(),type:'pen',n:pg.n,pts:[[p0.x,p0.y]],color:d.color,w:d.w};
  S.annots.push(a);renderOne(a);
  const mv=ev=>{
    const p=ptOf(pg,ev),l=a.pts[a.pts.length-1];
    if(Math.hypot(p.x-l[0],p.y-l[1])*S.zoom<1.5)return;
    a.pts.push([p.x,p.y]);renderOne(a);
  };
  const up=()=>{
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    pushHist();
  };
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

/* inline text editing */
const PLAIN=(()=>{const d=document.createElement('div');try{d.contentEditable='plaintext-only';return d.contentEditable==='plaintext-only'}catch(e){return false}})();
function editText(a){
  commitEdit();
  S.editing=a.id;
  armEditor(a);
}
function currentEditText(a){
  const el=layerEl(a);
  return el?el.innerText.replace(/\u00a0/g,' ').replace(/\r/g,'').replace(/\n+$/,''):a.text;
}
/* Make the annotation element editable. Editing only ends on commitEdit(): Escape, or a click elsewhere in the document. */
let lastTap=null;
addEventListener('pointerdown',e=>{lastTap={x:e.clientX,y:e.clientY,t:Date.now()}},true);
function armEditor(a){
  const el=layerEl(a);if(!el)return;
  el.contentEditable=PLAIN?'plaintext-only':'true';
  el.spellcheck=false;
  /* keep the view exactly where it is (focus() / the iOS keyboard would otherwise scroll it, e.g. back to the
     start of the line when zoomed) and put the caret where the finger tapped */
  const vs=[viewer,viewer2].map(v=>[v,v.scrollLeft,v.scrollTop]);
  const keep=()=>vs.forEach(([v,l,t])=>{if(v.scrollLeft!==l)v.scrollLeft=l;if(Math.abs(v.scrollTop-t)>1&&!document.documentElement.classList.contains('kb'))v.scrollTop=t});
  el.focus({preventScroll:true});keep();
  let r=null;
  if(lastTap&&Date.now()-lastTap.t<1500){
    try{
      if(document.caretPositionFromPoint){const c=document.caretPositionFromPoint(lastTap.x,lastTap.y);if(c&&el.contains(c.offsetNode)){r=document.createRange();r.setStart(c.offsetNode,c.offset);r.collapse(true)}}
      else if(document.caretRangeFromPoint){const c=document.caretRangeFromPoint(lastTap.x,lastTap.y);if(c&&el.contains(c.startContainer))r=c}
    }catch(e){}
  }
  if(!r){r=document.createRange();r.selectNodeContents(el);r.collapse(false)}
  const s=getSelection();s.removeAllRanges();s.addRange(r);
  [60,250,600].forEach(ms=>setTimeout(()=>{if(document.activeElement===el)keep()},ms));
  el.onkeydown=ev=>{
    ev.stopPropagation();
    if(ev.key==='Escape'){ev.preventDefault();commitEdit()}
    else if(ev.key==='Enter'&&(ev.ctrlKey||ev.metaKey)){ev.preventDefault();commitEdit()}
  };
  el.onpaste=ev=>{
    ev.preventDefault();
    const t=(ev.clipboardData||window.clipboardData).getData('text');
    document.execCommand('insertText',false,t);
  };
}
function commitEdit(){
  const id=S.editing;if(!id)return;
  S.editing=null;
  const a=findAnn(id);if(!a)return;
  const el=layerEl(a);
  let t=a.text;
  if(el){
    t=el.innerText.replace(/\u00a0/g,' ').replace(/\r/g,'').replace(/\n+$/,'');
    el.onblur=el.onkeydown=el.onpaste=null;el.removeAttribute('contenteditable');
  }
  const isNew=S.newId===id;S.newId=null;
  if(a.type==='text'){
    if(!t.trim()){removeAnn(id,!isNew&&a.text!=='');return}
    const changed=t!==a.text;a.text=t;renderOne(a);
    if(changed||isNew)pushHist();
  }else if(a.type==='edit'){
    /* only drop the annotation when NEITHER the text NOR the formatting (font, size, bold, italic, colour)
       differs from what was originally on the page - a font/size-only change must still be kept even
       though the text itself came back unchanged */
    const fmtChanged=a.kind!==a.okind||a.bold!==a.obold||a.italic!==a.oitalic||a.size!==a.osize||a.color!==a.ocolor;
    if(t===a.orig&&!fmtChanged){removeAnn(id,!isNew);return}
    const changed=t!==a.text||fmtChanged;a.text=t;renderOne(a);
    if(changed||isNew)pushHist();
  }
}

/* edit existing text from the text layer */
function sampleColors(pg,g){
  const cv=pg.cv;
  if(!cv.width)return {bg:'#ffffff',fg:'#000000'};
  const k=cv.width/pg.w,ctx=cv.getContext('2d');
  const top=g.y-Math.min(g.asc,.95)*g.size,hh=(Math.min(g.asc,.95)+Math.min(-g.desc,.25))*g.size;
  let x0=Math.floor(g.x*k)-3,y0=Math.floor(top*k)-3,w=Math.ceil(g.w*k)+6,h=Math.ceil(hh*k)+6;
  x0=Math.max(0,x0);y0=Math.max(0,y0);w=Math.min(cv.width-x0,w);h=Math.min(cv.height-y0,h);
  if(w<4||h<4)return {bg:'#ffffff',fg:'#000000'};
  const d=ctx.getImageData(x0,y0,w,h).data;
  const buckets=new Map();
  const ring=2;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(x>=ring&&x<w-ring&&y>=ring&&y<h-ring)continue;
    const i=(y*w+x)*4,key=((d[i]>>4)<<8)|((d[i+1]>>4)<<4)|(d[i+2]>>4);
    const b=buckets.get(key)||[0,0,0,0];b[0]++;b[1]+=d[i];b[2]+=d[i+1];b[3]+=d[i+2];buckets.set(key,b);
  }
  let best=null;for(const b of buckets.values())if(!best||b[0]>best[0])best=b;
  const bg=best?[best[1]/best[0],best[2]/best[0],best[3]/best[0]]:[255,255,255];
  let far=0,fg=[0,0,0];
  for(let y=ring;y<h-ring;y++)for(let x=ring;x<w-ring;x++){
    const i=(y*w+x)*4,dr=d[i]-bg[0],dg=d[i+1]-bg[1],db=d[i+2]-bg[2],dist=dr*dr+dg*dg+db*db;
    if(dist>far){far=dist;fg=[d[i],d[i+1],d[i+2]]}
  }
  const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  return {bg:hex(bg),fg:far<1600?'#000000':hex(fg)};
}
/* builds (and registers) an "edit" annotation covering a text group; used by clicking and by Replace */
function createEditAnn(pg,g){
  const c=sampleColors(pg,g);
  const ca=Math.min(g.asc,.95),cd=Math.min(-g.desc,.25);
  const kind=matchKind({name:g.fname||'',kind:g.kind});
  const a={id:uid(),type:'edit',n:pg.n,cx:g.x-1.5,cy:g.y-ca*g.size,cw:g.w+3,ch:(ca+cd)*g.size,
    x:g.x,y:0,size:+g.size.toFixed(2),kind,bold:g.bold,italic:g.italic,color:c.fg,bg:c.bg,text:g.str,orig:g.str,gy:g.y,fname:g.fname||''};
  a.y=g.y-baseOff(kind,g.bold,g.italic)*g.size;
  /* the formatting pdf-lib detected for the original text, so commitEdit() can tell a pure font/size/style
     change (nothing to discard) apart from an edit session that really changed nothing at all */
  a.okind=a.kind;a.obold=a.bold;a.oitalic=a.italic;a.osize=a.size;a.ocolor=a.color;
  S.annots.push(a);
  return a;
}
function onTlClick(pg,e){
  if(S.tool!=='edit')return;
  const sp=e.target.closest&&e.target.closest('span');if(!sp||!pg.groups)return;
  const sel=getSelection();if(sel&&!sel.isCollapsed)return;
  const g=pg.groups[+sp.dataset.g];if(!g)return;
  if(Math.abs(g.ang)>1e-3){toast('Ce texte est pivoté : sa modification n\'est pas prise en charge.');return}
  commitEdit();
  const a=createEditAnn(pg,g);
  S.newId=a.id;claimSel(a.id);
  renderOne(a);renderProps(true);editText(a);
}

/* highlight from text selection */
function highlightSelection(rng){
  if(S.tool!=='hl')return;
  setTimeout(()=>{
    const sel=getSelection();if(!rng&&(!sel||sel.isCollapsed||!sel.rangeCount))return;
    const rects=[...(rng||sel.getRangeAt(0)).getClientRects()];
    const boxes=[];
    for(const r of rects){
      if(r.width<1||r.height<2)continue;
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      const pg=S.pages.find(p=>{const b=p.el.getBoundingClientRect();return cx>=b.left&&cx<=b.right&&cy>=b.top&&cy<=b.bottom});
      if(!pg)continue;
      const pr=pg.al.getBoundingClientRect(),k=pr.width/pg.w;
      boxes.push({n:pg.n,x:(r.left-pr.left)/k,y:(r.top-pr.top)/k,w:r.width/k,h:r.height/k});
    }
    boxes.sort((a,b)=>a.n-b.n||a.y-b.y||a.x-b.x);
    const merged=[];
    for(const b of boxes){
      const m=merged.find(q=>q.n===b.n&&Math.min(q.y+q.h,b.y+b.h)-Math.max(q.y,b.y)>0.6*Math.min(q.h,b.h)&&b.x<=q.x+q.w+3&&b.x+b.w>=q.x-3);
      if(m){const x1=Math.max(m.x+m.w,b.x+b.w),y1=Math.max(m.y+m.h,b.y+b.h);m.x=Math.min(m.x,b.x);m.y=Math.min(m.y,b.y);m.w=x1-m.x;m.h=y1-m.y}
      else merged.push({...b});
    }
    if(!merged.length)return;
    for(const m of merged){
      const a={id:uid(),type:'hl',n:m.n,x:m.x,y:m.y,w:m.w,h:m.h,color:S.def.hl.color};
      S.annots.push(a);renderOne(a);
    }
    if(sel)sel.removeAllRanges();pushHist();
  },10);
}
document.addEventListener('pointerup',()=>highlightSelection());
/* touch screens: the selection is finished with the handles (no pointerup afterwards), so wait until it settles */
let selT=0;
document.addEventListener('selectionchange',()=>{
  if(!COARSE||S.tool!=='hl')return;
  clearTimeout(selT);selT=setTimeout(()=>{const sel=getSelection();if(sel&&!sel.isCollapsed)highlightSelection()},700);
});
/* touch highlighter: long-press on text, then drag to extend (own selection, native iOS selection is disabled in this tool) */
if(COARSE){
  const cfp=(x,y)=>{if(document.caretRangeFromPoint)return document.caretRangeFromPoint(x,y);const p=document.caretPositionFromPoint&&document.caretPositionFromPoint(x,y);if(!p)return null;const r=document.createRange();r.setStart(p.offsetNode,p.offset);r.collapse(true);return r};
  const inText=n=>n&&n.nodeType===3&&n.parentElement&&n.parentElement.closest('.tl');
  const wordStart=(n,o)=>{const t=n.nodeValue;while(o>0&&!/\s/.test(t[o-1]))o--;return o};
  const wordEnd=(n,o)=>{const t=n.nodeValue;while(o<t.length&&!/\s/.test(t[o]))o++;return o};
  let timer=0,act=false,a0=null,x0=0,y0=0,prev=[];
  const clearPrev=()=>{prev.forEach(e=>e.remove());prev=[]};
  const build=(ra,rb)=>{
    if(!ra||!rb||!inText(ra.startContainer)||!inText(rb.startContainer))return null;
    const r=document.createRange();
    const cmp=ra.startContainer===rb.startContainer?ra.startOffset-rb.startOffset:(ra.compareBoundaryPoints?ra.compareBoundaryPoints(Range.START_TO_START,rb):0);
    const first=cmp<=0?ra:rb,last=cmp<=0?rb:ra;
    r.setStart(first.startContainer,wordStart(first.startContainer,first.startOffset));
    r.setEnd(last.startContainer,wordEnd(last.startContainer,last.startOffset));
    return r;
  };
  const show=r=>{clearPrev();if(!r)return;for(const q of r.getClientRects()){if(q.width<1)continue;const d=document.createElement('div');d.className='hlprev';d.style.cssText='left:'+q.left+'px;top:'+q.top+'px;width:'+q.width+'px;height:'+q.height+'px';document.body.appendChild(d);prev.push(d)}};
  document.addEventListener('touchstart',e=>{
    if(S.tool!=='hl'||e.touches.length!==1){clearTimeout(timer);return}
    const t=e.touches[0];if(!document.elementFromPoint(t.clientX,t.clientY)?.closest('.page'))return;
    x0=t.clientX;y0=t.clientY;act=false;clearTimeout(timer);
    timer=setTimeout(()=>{const r=cfp(x0,y0);if(r&&inText(r.startContainer)){act=true;a0=r;show(build(a0,a0));navigator.vibrate&&navigator.vibrate(15)}},320);
  },{passive:true});
  document.addEventListener('touchmove',e=>{
    const t=e.touches[0];
    if(!act){if(Math.hypot(t.clientX-x0,t.clientY-y0)>8)clearTimeout(timer);return}
    e.preventDefault();
    const r=cfp(t.clientX,t.clientY);if(r)show(build(a0,r));
  },{passive:false});
  const end=e=>{
    clearTimeout(timer);
    if(!act)return;act=false;
    const t=e.changedTouches&&e.changedTouches[0];const r=t&&cfp(t.clientX,t.clientY);
    const rg=build(a0,r||a0);clearPrev();if(rg)highlightSelection(rg);
  };
  document.addEventListener('touchend',end);document.addEventListener('touchcancel',()=>{clearTimeout(timer);act=false;clearPrev()});
}

/* ---------- fonts: detection, matching, import ---------- */
let fontSeq=0;
const normKey=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STD_NAME={helv:'Helvetica',times:'Times',cour:'Courier'};

/* "ABCDEF+Calibri-BoldItalic" -> {family:'Calibri', key:'calibri', bold, italic} */
function parseFontName(raw){
  const n=String(raw||'').replace(/^[A-Z]{6}\+/,'');
  const m=/^([^,-]+)[,-](.+)$/.exec(n);
  let base=m?m[1]:n;const st=m?m[2]:'';
  base=base.replace(/(PSMT|PS|MT)$/,'');
  const all=(base+' '+st).toLowerCase();
  const bold=/bold|black|heavy|semibold|demi/.test(all);
  const italic=/italic|oblique/.test(all);
  const family=base.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_]+/g,' ').trim();
  return {family,key:normKey(base),bold,italic};
}
const _pc=document.createElement('canvas').getContext('2d');
function isInstalled(fam){
  if(!fam)return false;
  const f=fam.replace(/"/g,'');
  for(const b of ['monospace','serif','sans-serif']){
    _pc.font='72px '+b;const w0=_pc.measureText('mmmmmmmmmmlli').width;
    _pc.font='72px "'+f+'",'+b;if(_pc.measureText('mmmmmmmmmmlli').width!==w0)return true;
  }
  return false;
}
function userFamilies(){return [...new Set(S.fonts.map(f=>f.family))].sort((a,b)=>a.localeCompare(b))}
function findUserFamily(key){
  if(!key||!S.fonts.length)return null;
  return S.fonts.find(f=>{
    const k=normKey(f.family);
    return k===key||(k.length>=4&&key.length>=4&&(k.startsWith(key)||key.startsWith(k)));
  })||null;
}
/* Best font for an original PDF font: an added font with the same family, otherwise the closest standard one. */
function matchKind(info){
  const p=parseFontName(info.name);
  const f=findUserFamily(p.key);
  return f?('u:'+f.family):info.kind;
}
function pickFont(family,bold,italic){
  let best=null,bs=-1;
  for(const f of S.fonts){
    if(f.family!==family)continue;
    const s=(f.italic===!!italic?2:0)+(f.bold===!!bold?1:0);
    if(s>bs){bs=s;best=f}
  }
  return best;
}
/* baseline position inside a 1.2 line-height box, as a fraction of the font size */
let _bo={};
function baseOff(kind,bold,italic){
  const key=kind+'|'+(bold?1:0)+(italic?1:0);
  if(_bo[key]!=null)return _bo[key];
  mctx.font=(italic?'italic ':'')+(bold?'bold ':'')+'100px '+cssFont(kind);
  const m=mctx.measureText('Hx');
  let asc=m.fontBoundingBoxAscent,desc=m.fontBoundingBoxDescent;
  if(!(asc>0)){asc=90;desc=22}
  return _bo[key]=((120-(asc+desc))/2+asc)/100;
}
function fontLabel(kind){return String(kind).startsWith('u:')?String(kind).slice(2):(STD_NAME[kind]||'Helvetica')}
function fontChip(a){
  if(a.type!=='edit'||!a.fname)return '';
  const p=parseFontName(a.fname);
  const st=(p.bold?' gras':'')+(p.italic?' italique':'');
  const exact=String(a.kind).startsWith('u:');
  let tip='Police d\'origine : '+p.family+st+'. ';
  tip+=exact?'Elle est incorporée au PDF modifié.':'Remplacée par '+fontLabel(a.kind)+'.';
  if(!exact&&isInstalled(p.family))tip+=' Elle est installée sur cet ordinateur : importez son fichier (.ttf ou .otf) pour l\'utiliser.';
  const txt=p.family+st+(exact?' ✓':' → '+fontLabel(a.kind));
  return '<button class="btn chip" data-t="fonts" title="'+esc(tip)+'">'+ICONS.font+'<span>'+esc(txt)+'</span></button>';
}

/* ---------- font loading ---------- */
function loadScript(src){
  return new Promise((res,rej)=>{
    const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('load '+src));
    document.head.append(s);
  });
}
let fkP=null;
function loadFontkit(){
  if(window.fontkit)return Promise.resolve();
  if(fkP)return fkP;
  const urls=(LOCAL?['lib/fontkit.js']:[]).concat(['https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js','https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js','https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.js']);
  fkP=(async()=>{
    for(const u of urls){try{await loadScript(u);if(window.fontkit)return}catch(e){}}
    fkP=null;throw new Error('fontkit');
  })();
  return fkP;
}

/* adds a TrueType/OpenType font to the user fonts (fontkit must be loaded); returns the new entry or null */
function registerFontBytes(bytes,fileName){
  let f=fontkit.create(bytes);if(f.fonts&&f.fonts.length)f=f.fonts[0];
  const family=f.familyName||String(fileName||'font').replace(/\.[^.]+$/,'');
  const sub=(f.subfamilyName||'')+' '+(f.postscriptName||'');
  const bold=/bold|black|heavy|demi/i.test(sub)||((f['OS/2']&&f['OS/2'].usWeightClass)||400)>=600;
  const italic=/italic|oblique/i.test(sub);
  const ps=f.postscriptName||fileName;
  if(S.fonts.some(x=>x.ps===ps))return null;
  const cssFam='ufam-'+normKey(family);
  const ff=new FontFace(cssFam,bytes.slice(0).buffer,{weight:bold?'700':'400',style:italic?'italic':'normal'});
  const ent={id:++fontSeq,family,ps,bold,italic,cssFam,bytes};
  ent.ready=ff.load().then(()=>{document.fonts.add(ff)}).catch(e=>{S.fonts=S.fonts.filter(x=>x!==ent);throw e});
  S.fonts.push(ent);
  return ent;
}
/* fonts fully embedded in the open PDF (not subsets) become usable for editing: the real font, not a look-alike */
const embSeen=new WeakSet();
async function importEmbeddedFonts(){
  if(!S.bytes||embSeen.has(S.bytes))return 0;
  embSeen.add(S.bytes);
  let n=0;
  try{
    await loadFontkit();
    const {PDFDocument,PDFName,PDFDict,PDFRawStream,decodePDFRawStream}=PDFLib;
    if(!decodePDFRawStream)return 0;
    const doc=await PDFDocument.load(S.bytes.slice(0),{ignoreEncryption:true,updateMetadata:false});
    const ents=[];
    for(const [,obj] of doc.context.enumerateIndirectObjects()){
      if(!(obj instanceof PDFDict))continue;
      const ff=obj.get(PDFName.of('FontFile2'))||obj.get(PDFName.of('FontFile3'));
      if(!ff)continue;
      const nm=String(obj.get(PDFName.of('FontName'))||'').replace(/^\//,'');
      if(/^[A-Z]{6}\+/.test(nm))continue;
      const stream=doc.context.lookup(ff);
      if(!(stream instanceof PDFRawStream))continue;
      try{
        const bytes=new Uint8Array(decodePDFRawStream(stream).decode());
        const ent=registerFontBytes(bytes,nm||'embedded');
        if(ent){ent.embedded=true;ents.push(ent);n++}
      }catch(e){console.warn('font',nm,e)}
    }
    await Promise.all(ents.map(e=>e.ready.catch(()=>{})));
    if(n)afterFontsChanged();
  }catch(e){console.warn('embedded fonts',e)}
  return n;
}
/* desktop app: fonts you add are kept in the user's data folder and come back at every launch.
   This no longer checks the DESKTOP flag before trying: it always attempts the backend call and
   simply lets it fail quietly (caught below) when there's no backend to answer (the plain, no-
   install web version) - one less thing that can silently gate this off for the wrong reason. */
const safeFile=n=>String(n||'font').replace(/[^\w.\- ()]+/g,'_').slice(0,120);
/* installable web app: no backend, so imported fonts live in this device's IndexedDB */
let _fontDb=null;
function fontDb(){
  if(_fontDb)return _fontDb;
  return _fontDb=new Promise((res,rej)=>{
    try{const rq=indexedDB.open('letuspdf-fonts',1);rq.onupgradeneeded=()=>rq.result.createObjectStore('fonts');rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)}catch(e){rej(e)}
  });
}
async function fontDbOp(mode,fn){
  const db=await fontDb();
  return new Promise((res,rej)=>{const tx=db.transaction('fonts',mode),st=tx.objectStore('fonts');const rq=fn(st);tx.oncomplete=()=>res(rq&&rq.result);tx.onerror=()=>rej(tx.error)});
}
async function persistFont(ent,name,bytes){
  ent.file=safeFile(name);
  if(PWA){
    try{await fontDbOp('readwrite',st=>st.put(bytes,ent.file));return true}
    catch(e){toast('"'+name+'" ne sera pas conservée sur cet appareil ('+(e&&e.message||e)+').',6000);return false}
  }
  try{
    const r=await fetch('/api/fonts/'+encodeURIComponent(ent.file),{method:'PUT',headers:{'X-LetUs':'1'},body:bytes});
    if(!r.ok){
      const detail=await r.text().catch(()=>'');
      toast('"'+name+'" ne sera pas retrouvée au redémarrage (enregistrement refusé : '+(detail||r.status)+').',6000);
      return false;
    }
    return true;
  }catch(e){toast('"'+name+'" ne sera pas retrouvée au redémarrage (serveur local inaccessible : '+(e&&e.message||e)+').',6000);return false}
}
async function restoreSavedFonts(){
  if(PWA){
    try{
      const names=await fontDbOp('readonly',st=>st.getAllKeys());
      if(!names||!names.length)return;
      await loadFontkit();
      const ents=[];
      for(const name of names){
        try{
          const bytes=await fontDbOp('readonly',st=>st.get(name));
          const ent=bytes&&registerFontBytes(new Uint8Array(bytes),name);
          if(ent){ent.file=name;ents.push(ent)}
        }catch(e){console.warn('font restore',name,e)}
      }
      await Promise.all(ents.map(e=>e.ready.catch(()=>{})));
      if(ents.length)afterFontsChanged();
    }catch(e){console.warn('saved fonts',e)}
    return;
  }
  try{
    const resp=await fetch('/api/fonts',{cache:'no-store'});
    if(!resp.ok)return;
    const list=await resp.json();
    if(!list.length)return;
    await loadFontkit();
    const ents=[];
    for(const name of list){
      try{
        const bytes=new Uint8Array(await (await fetch('/api/fonts/'+encodeURIComponent(name),{cache:'no-store'})).arrayBuffer());
        const ent=registerFontBytes(bytes,name);
        if(ent){ent.file=name;ents.push(ent)}
      }catch(e){console.warn('font restore',name,e)}
    }
    await Promise.all(ents.map(e=>e.ready.catch(()=>{})));
    if(ents.length)afterFontsChanged();
  }catch(e){console.warn('saved fonts',e)}
}
async function addFontFiles(files){
  if(!files.length)return;
  busy(true,'Lecture des polices…');
  let n=0,saved=0,fail=false;
  try{
    await loadFontkit();
    for(const file of files){
      try{
        const bytes=new Uint8Array(await file.arrayBuffer());
        const ent=registerFontBytes(bytes,file.name);
        if(ent){await ent.ready;n++;if(await persistFont(ent,file.name,bytes))saved++}
      }catch(e){console.error(e)}
    }
  }catch(e){fail=true}
  busy(false);
  if(fail){toast('Impossible de charger le module de polices (connexion nécessaire).',5000);return}
  if(n){
    afterFontsChanged();
    /* explicit, unambiguous confirmation of whether this will survive a restart - persistFont
       already toasted the detailed reason for any font that failed to save */
    toast(n+' police'+(n>1?'s':'')+' ajoutée'+(n>1?'s':'')+(saved===n?' (conservée'+(n>1?'s':'')+' au redémarrage).':saved===0?' (ATTENTION : non conservée(s) au redémarrage, voir message ci-dessus).':' ('+saved+'/'+n+' conservée(s) au redémarrage).'),5000);
  }
  else toast('Aucune police valide trouvée (formats acceptés : .ttf et .otf).',4500);
}
let loadingLocalFonts=false;
async function loadLocalFonts(){
  if(!window.queryLocalFonts){toast('Cette fonction n\'est pas disponible dans ce navigateur.');return}
  if(loadingLocalFonts){toast('Import déjà en cours, merci de patienter…',2500);return}
  loadingLocalFonts=true;
  busy(true,'Lecture des polices de l\'ordinateur…');
  try{
    const list=await window.queryLocalFonts();let n=0,saved=0,withBytes=0;
    const todo=[];
    for(const fd of list){
      if(S.fonts.some(x=>x.ps===fd.postscriptName))continue;
      const sty=fd.style||'';
      const ent={id:++fontSeq,family:fd.family,ps:fd.postscriptName,bold:/bold|black|heavy|demi/i.test(sty),italic:/italic|oblique/i.test(sty),
        cssFam:'"'+fd.family.replace(/"/g,'')+'"',fd,local:true};
      S.fonts.push(ent);n++;
      todo.push({ent,fd,sty});
    }
    if(n)afterFontsChanged();
    busy(false);
    /* queryLocalFonts() only hands us a live, in-memory reference to each system font (fd) - it is
       never written to disk by itself, which is why fonts added via this button never survived a
       restart even though the normal file-import path (addFontFiles/persistFont) worked. Pull the
       real font bytes out of fd via blob() and persist them exactly like a manually-imported file,
       so restoreSavedFonts() can rebuild them from disk next time. This runs after the fonts are
       already listed and usable on screen, in the background, one at a time, so a large system
       font catalog doesn't block the UI or make the button look stuck. */
    for(const{ent,fd,sty}of todo){
      try{
        const blob=await fd.blob();
        const bytes=new Uint8Array(await blob.arrayBuffer());
        withBytes++;
        if(await persistFont(ent,fd.family+' - '+(fd.postscriptName||sty||'Regular')+'.ttf',bytes))saved++;
      }catch(e){console.warn('local font persist',fd.family,e)}
    }
    toast(n+' police'+(n>1?'s':'')+' de l\'ordinateur disponible'+(n>1?'s':'')+(!n?'.':withBytes===0?' (lecture du contenu impossible, non conservée(s) au redémarrage).':saved===withBytes?' (conservée'+(withBytes>1?'s':'')+' au redémarrage).':saved===0?' (ATTENTION : non conservée(s) au redémarrage, voir message ci-dessus).':' ('+saved+'/'+withBytes+' conservée(s) au redémarrage).'),5500);
  }catch(e){
    busy(false);
    toast('Accès aux polices refusé ou indisponible dans cette vue. Importez plutôt les fichiers de police.',5500);
  }finally{
    loadingLocalFonts=false;
  }
}
function afterFontsChanged(){
  _bo={};
  let changed=false;
  for(const a of S.annots){
    if(a.type!=='edit'||!a.fname||String(a.kind).startsWith('u:'))continue;
    const k=matchKind({name:a.fname,kind:a.kind});
    if(k!==a.kind){
      const bl=a.y+baseOff(a.kind,a.bold,a.italic)*a.size;
      a.kind=k;a.y=bl-baseOff(k,a.bold,a.italic)*a.size;changed=true;
    }
  }
  if(changed)pushHist();
  renderAllAnnots();renderProps(true);renderFontList();
}
function renderFontList(){
  const box=$('#fnList');if(!box)return;
  const fams=userFamilies();
  $('#fnLocal').hidden=!window.queryLocalFonts;
  if(!fams.length){box.innerHTML='<small>Aucune police ajoutée. Les polices standard (Helvetica, Times, Courier) sont toujours disponibles.</small>';return}
  box.innerHTML=fams.map(f=>{
    const n=S.fonts.filter(x=>x.family===f).length,loc=S.fonts.some(x=>x.family===f&&x.local);
    return '<div><span>'+esc(f)+' <small>'+n+' style'+(n>1?'s':'')+(loc?' · ordinateur':'')+'</small></span>'
      +(loc?'':'<button class="btn icon" data-rm="'+esc(f)+'" title="Retirer">'+ICONS.x+'</button>')+'</div>';
  }).join('');
}
let fontsDirShown=false;
async function showFontsDir(){
  if(fontsDirShown)return;
  const el=$('#fnDir');if(!el)return;
  fontsDirShown=true;
  if(PWA){el.textContent='Les polices ajoutées sont conservées sur cet appareil (hors connexion aussi).';return}
  try{
    const r=await fetch('/api/fontsdir',{cache:'no-store'});
    const j=await r.json();
    el.textContent=!j.writable?'Aucun des dossiers de polices n\'est accessible en écriture : les polices ajoutées ne seront pas conservées au redémarrage.'
      :'Enregistrées dans : '+j.dirs.filter(d=>d.writable).map(d=>d.dir).join(' et ');
  }catch(e){el.textContent=''}
}
function openFonts(){renderFontList();showFontsDir();$('#modal4').hidden=false}
$('#bFonts').onclick=openFonts;
$('#fnClose').onclick=()=>{$('#modal4').hidden=true};
$('#fnImp').onclick=()=>$('#fFont').click();
$('#fnLocal').onclick=()=>loadLocalFonts();
if(PWA&&!window.queryLocalFonts)$('#fnLocal').hidden=true;
$('#fFont').onchange=e=>{const fs=[...e.target.files];e.target.value='';addFontFiles(fs)};
$('#fnList').addEventListener('click',e=>{
  const b=e.target.closest('[data-rm]');if(!b)return;
  const fam=b.dataset.rm;
  if(PWA)for(const f of S.fonts)if(f.family===fam&&f.file)fontDbOp('readwrite',st=>st.delete(f.file)).catch(()=>{});
  if(DESKTOP)for(const f of S.fonts)if(f.family===fam&&f.file)fetch('/api/fonts/'+encodeURIComponent(f.file),{method:'DELETE',headers:{'X-LetUs':'1'}}).catch(()=>{});
  S.fonts=S.fonts.filter(f=>f.family!==fam);
  let changed=false;
  for(const a of S.annots)if(a.kind==='u:'+fam){
    const bl=a.y+baseOff(a.kind,a.bold,a.italic)*a.size;a.kind='helv';a.y=bl-baseOff('helv',a.bold,a.italic)*a.size;changed=true;
  }
  _bo={};if(changed)pushHist();
  renderAllAnnots();renderProps(true);renderFontList();
});
restoreSavedFonts();

/* ---------- special functions: Invoice -> CN (credit note) ---------- */
const AMT_CUR='(?:[€$£]\\s*|[A-Z]{3}\\s+)?';
const AMT_RE=new RegExp('^\\s*'+AMT_CUR+'\\d[\\d\\s.,\'’\\u00a0]*(?:\\s*(?:[€$£]|[A-Z]{3}))?\\s*$');
const isAmount=s=>AMT_RE.test(s)&&!/%/.test(s);
function negAmount(s){
  const m=new RegExp('^(\\s*)('+AMT_CUR+')(\\d[\\d\\s.,\'’\\u00a0]*)([\\s\\S]*)$').exec(s);
  if(!m)return null;
  if(/^0*$/.test(m[3].replace(/\D/g,'')))return null;
  return m[1]+'-'+m[2]+m[3]+m[4];
}
/* "Total (net of tax) 1 234.56" in a single block -> negate only the trailing amount */
function negTrailing(s){
  const m=new RegExp('^([\\s\\S]*?\\S)(\\s+)('+AMT_CUR+'\\d[\\d\\s.,\'’\\u00a0]*\\d(?:\\s*(?:[€$£]|[A-Z]{3}))?)\\s*$').exec(s);
  if(!m||/%/.test(m[3]))return null;
  const n=negAmount(m[3]);return n?m[1]+m[2]+n:null;
}
function caseLike(src,w){return src===src.toUpperCase()&&src.length>1?w.toUpperCase():(src===src.toLowerCase()?w.toLowerCase():w)}
const R_COLUP=/U\.?\s?P\.?\s*\(\s*net\s*\)\s*$/i, R_COLTOT=/Total\s*\(?\s*net\s+of\s+tax\s*\)?\s*$/i;
const R_FOOT=/Total\s*\(\s*net\s+of\s+tax\s*\)/i;

/* does this block hug the right edge of other blocks (right aligned), or a neighbour on its right (keep its right edge)? */
function alignOf(pg,g,gs){
  const R=g.x+g.w;let r=0,l=0,abut=false;
  for(const h of gs){
    if(h===g)continue;
    if(Math.abs(h.y-g.y)<0.5*g.size){if(h.x>=R-1&&h.x-R<0.9*g.size)abut=true;continue}
    if(Math.abs(h.x+h.w-R)<1.5)r++;
    if(Math.abs(h.x-g.x)<1.5)l++;
  }
  return abut||r>l||(r===l&&r>0&&g.x>pg.w/2);
}

async function specialCN(){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Ce PDF est protégé par un mot de passe : il ne peut pas être modifié.',4500);return}
  busy(true,'Conversion en note de crédit…');
  const emb=await importEmbeddedFonts();
  const st={rep:0,date:0,due:0,amt:0,hdr:false,foot:false,ref:0};
  const edits=[];
  let cols=null,hdrSeen=false;
  try{
    for(const pg of S.pages){
      const gs=await getGroups(pg);
      const cur=g=>{const ea=editOf(pg,g);return ea?String(ea.text||''):g.str};
      const out=new Map(),del=new Set();
      const set=(g,text,right)=>{if(!out.has(g))out.set(g,{text,right:!!right});else out.get(g).text=text};
      const txt=g=>out.has(g)?out.get(g).text:cur(g);
      const ok=g=>Math.abs(g.ang)<1e-3;
      const sameRow=(a,b)=>Math.abs(a.y-b.y)<0.5*Math.max(a.size,b.size);
      /* 1. texts */
      for(const g of gs){
        if(!ok(g))continue;
        let t=cur(g),n=t;
        n=n.replace(/\bInvoice\s+date\b/g,()=>{st.date++;return 'Date'});
        n=n.replace(/\bInvoice\b/g,()=>{st.rep++;return 'CreditNote'});
        /* "Ref. : AI12345" / "Réf : AI-2024-00231" -> same reference, but the AI (invoice) prefix
           becomes CN (credit note); only the two-letter code changes, the rest of the number
           stays. No \b after AI: it's followed by digits most of the time, and \b never matches
           between two "word" characters (letter->digit isn't a boundary), so a boundary there
           would silently fail to match "AI12345". A negative lookahead for another letter avoids
           over-matching some unrelated "AIxxx" word instead. */
        n=n.replace(/\b(R[eé]f\.?)(\s*:?\s*)AI(?![A-Za-z])/gi,(m0,p1,p2)=>{st.ref++;return p1+p2+'CN'});
        if(n!==t)set(g,n,alignOf(pg,g,gs));
      }
      /* 1b. same "Ref." -> "AI..." rewrite, but for PDFs where the label ("Ref. :") and the code
         ("AI12345") are two separate text fragments sitting on the same line - very common since
         the code is usually inserted as separate, dynamically-positioned text in the PDF */
      for(const g of gs){
        if(!ok(g)||del.has(g)||!/^\s*R[eé]f\.?\s*:?\s*$/i.test(txt(g)))continue;
        let best=null,bd=1e9;
        for(const h of gs){
          if(h===g||!ok(h)||!sameRow(g,h)||h.x<g.x)continue;
          const d=h.x-g.x;if(d<bd){bd=d;best=h}
        }
        if(!best)continue;
        const m=/^(\s*)AI(?![A-Za-z])([\s\S]*)$/i.exec(txt(best));
        if(m){set(best,m[1]+'CN'+m[2],false);st.ref++}
      }
      /* 2. "Due Date limit : <date>" line */
      for(const g of gs){
        if(!ok(g)||!/^\s*Due\s*date\s*limit/i.test(txt(g)))continue;
        for(const h of gs)if(ok(h)&&sameRow(g,h)&&h.x>=g.x-1&&txt(h)!==''){set(h,'',false);del.add(h)}
        st.due++;
      }
      /* 3. amount columns */
      let hdrY=-1e9;
      let heads=gs.filter(g=>ok(g)&&!del.has(g)&&(R_COLUP.test(txt(g).trim())||R_COLTOT.test(txt(g).trim()))).sort((a,b)=>a.y-b.y);
      if(heads.length)heads=heads.filter(g=>sameRow(g,heads[0]));
      if(heads.length){
        const h0=heads[0];hdrY=h0.y;hdrSeen=true;st.hdr=true;
        const row=gs.filter(g=>ok(g)&&sameRow(g,h0)&&!del.has(g));
        cols=[...new Set([...row,...heads])].map(g=>({x:g.x,r:g.x+g.w,c:g.x+g.w/2,w:g.w,
          tgt:R_COLUP.test(txt(g).trim())||R_COLTOT.test(txt(g).trim())}));
      }
      /* footer: "Total (net of tax)" below the header, then the next two lines */
      const foots=gs.filter(g=>ok(g)&&!del.has(g)&&R_FOOT.test(txt(g))&&g.y>hdrY+g.size);
      const L=foots[0]||null;
      const footSet=new Set();
      const apply=(g,right)=>{
        if(out.has(g)&&out.get(g).text==='')return false;
        const t=txt(g);
        let n=isAmount(t)?negAmount(t):negTrailing(t);
        if(n==null)return false;
        set(g,n,right);st.amt++;return true;
      };
      const alignRight=g=>{
        if(!cols)return true;
        let best=null,bd=1e9;
        for(const c of cols){const d=Math.min(Math.abs(g.x+g.w/2-c.c),Math.abs(g.x+g.w-c.r),Math.abs(g.x-c.x));if(d<bd){bd=d;best=c}}
        if(best&&bd<10)return Math.abs(g.x+g.w-best.r)<=Math.abs(g.x-best.x);
        return alignOf(pg,g,gs)||true;
      };
      if(L){
        st.foot=true;
        const below=gs.filter(g=>ok(g)&&!del.has(g)&&g.y>L.y+0.5*L.size&&g.x>=L.x-2).sort((a,b)=>a.y-b.y);
        const rows=[];
        for(const g of below){
          const r=rows.find(q=>sameRow(q[0],g));
          if(r)r.push(g);else rows.push([g]);
        }
        const amtRows=[];
        for(const r of rows.slice(0,2)){
          const a=r.filter(g=>g.x>=L.x-2&&isAmount(txt(g))).sort((x,y)=>(y.x+y.w)-(x.x+x.w))[0];
          if(a)amtRows.push(a);
        }
        const row0=gs.filter(g=>ok(g)&&!del.has(g)&&sameRow(g,L));
        const a0=row0.filter(g=>g!==L&&isAmount(txt(g))).sort((x,y)=>(y.x+y.w)-(x.x+x.w))[0];
        for(const g of (a0?[a0]:[L]).concat(amtRows)){footSet.add(g);apply(g,alignRight(g))}
      }
      if(cols){
        const tg=cols.filter(c=>c.tgt);
        for(const g of gs){
          if(!ok(g)||footSet.has(g)||del.has(g)||out.has(g)||g.y<=hdrY+0.5*g.size)continue;
          if(L&&g.y>=L.y-0.5*L.size)continue;
          if(hdrY<-1e8&&!hdrSeen)continue;
          if(!isAmount(txt(g)))continue;
          let best=null,bd=1e9;
          for(const c of cols){const d=Math.min(Math.abs(g.x+g.w/2-c.c),Math.abs(g.x+g.w-c.r),Math.abs(g.x-c.x));if(d<bd){bd=d;best=c}}
          if(best&&best.tgt&&bd<10)apply(g,alignRight(g));
        }
      }
      for(const [g,o] of out)edits.push({pg,g,text:o.text,right:o.right});
    }
    /* apply the edits (pages must be rendered to sample colours and fonts) */
    const byPg=new Map();
    for(const e of edits){if(!byPg.has(e.pg))byPg.set(e.pg,[]);byPg.get(e.pg).push(e)}
    for(const [pg,list] of byPg){
      await ensureRendered(pg);fillFonts(pg);
      for(const e of list){
        let a=editOf(pg,e.g);
        const had=!!a;
        if(!a)a=createEditAnn(pg,e.g);
        a.text=e.text;
        if(!had&&e.text!==''&&(e.right||/^\s*-/.test(e.text))){
          if(e.right)a.x=e.g.x+e.g.w-natW(e.text,a.kind,a.bold,a.italic)*a.size;
        }
        renderOne(a);
      }
      if(!nearViewport(pg))releasePage(pg);
    }
    if(edits.length)pushHist();
  }catch(err){console.error(err);toast('La conversion a échoué : '+(err&&err.message||'erreur inconnue'),5000);return}
  finally{busy(false)}
  if(!edits.length){toast('Rien à convertir : aucun texte « Invoice » ni montant reconnu dans ce document.',5000);return}
  const miss=[];
  if(!st.rep&&!st.date)miss.push('texte « Invoice »');
  if(!st.due)miss.push('ligne « Due Date limit »');
  if(!st.hdr)miss.push('colonnes U.P. (net) / Total (net of tax)');
  if(!st.foot)miss.push('lignes de total en bas du tableau');
  toast('Invoice → CN : '+st.rep+' « CreditNote », '+st.date+' « Date », '+st.due+' ligne supprimée, '+st.amt+' montant'+(st.amt>1?'s':'')+' passé'+(st.amt>1?'s':'')+' en négatif.'
    +(st.ref?' '+st.ref+' « Ref AI » → « Ref CN ».':'')
    +(miss.length?' Introuvable : '+miss.join(', ')+'.':''),miss.length?9000:5000);
}

/* ---------- "Spécial" menu ---------- */
function closeSpecial(){$('#spMenu').hidden=true;$('#bSpecial').classList.remove('on')}
$('#bSpecial').onclick=e=>{
  e.stopPropagation();
  const m=$('#spMenu');
  if(!m.hidden){closeSpecial();return}
  const r=$('#bSpecial').getBoundingClientRect();
  $('#spMenu [data-sp="split"]').classList.toggle('on',S.split);
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';m.style.top=(r.bottom+4)+'px';
  m.hidden=false;$('#bSpecial').classList.add('on');
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';
};
$('#spMenu').addEventListener('click',e=>{
  const b=e.target.closest('[data-sp]');if(!b)return;
  closeSpecial();
  if(!S.pdf){toast('Ouvrez d\'abord un PDF.');return}
  if(b.dataset.sp==='cn')specialCN();
  else if(b.dataset.sp==='split')toggleSplit(!S.split);
  else if(b.dataset.sp==='email')emailActive();
});
document.addEventListener('pointerdown',e=>{if(!$('#spMenu').hidden&&!e.target.closest('#spMenu,#bSpecial'))closeSpecial()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#spMenu').hidden)closeSpecial()});

/* ---------- floating properties bar ---------- */
const TOOL_HINT={
  edit:'Touchez un texte du document pour le modifier.',
  text:'Touchez la page à l\'endroit où ajouter du texte.',
  hl:'Touchez longuement un mot puis glissez pour surligner.',
  rect:'Faites glisser sur la page pour dessiner un rectangle.',
  pen:'Dessinez à main levée sur la page.',
  shot:'Faites glisser sur la page pour capturer une zone en image.',
  link:'Faites glisser sur la page pour créer un lien. Cliquez sur un lien existant pour le modifier ou le supprimer.',
  note:'Cliquez sur la page à l\'endroit où ajouter un commentaire. Cliquez sur un commentaire existant pour le modifier ou le supprimer.'
};
const curAnn=()=>S.sel?findAnn(S.sel):null;
const toolType=()=>({text:'text',rect:'rect',hl:'hl',pen:'pen',link:'link',note:'note'})[S.tool]||null;
const opt=(v,l,cur)=>'<option value="'+esc(v)+'"'+(cur===v?' selected':'')+'>'+esc(l)+'</option>';
function fontOptions(cur){
  let h='<optgroup label="Standard (incorporées au PDF)">'+opt('helv','Helvetica / Arial',cur)+opt('times','Times',cur)+opt('cour','Courier',cur)+'</optgroup>';
  const fams=userFamilies();
  if(fams.length)h+='<optgroup label="Polices ajoutées">'+fams.map(f=>opt('u:'+f,f,cur)).join('')+'</optgroup>';
  if(String(cur).startsWith('u:')&&!fams.includes(String(cur).slice(2)))h+=opt(cur,String(cur).slice(2)+' (retirée)',cur);
  return h;
}
function renderProps(force){
  const bar=$('#propbar');
  if(!S.pdf){bar.hidden=true;bar.innerHTML='';return}
  if(!force&&bar.contains(document.activeElement))return;
  const a=curAnn();const t=a?a.type:toolType();
  const v=a||(t&&t!=='edit'?S.def[t]:null);
  let h='';
  if(t==='text'||t==='edit'){
    const w=a||S.def.text;
    h+=(a?fontChip(a):'')
      +'<select class="inp" data-k="kind" aria-label="Police">'+fontOptions(w.kind)+'</select>'
      +'<button class="btn icon" data-t="fonts" title="Ajouter ou gérer des polices" data-i="font">'+ICONS.font+'</button>'
      +'<input class="inp num" type="number" min="4" max="200" step="1" data-k="size" value="'+Math.round(w.size*10)/10+'" aria-label="Taille">'
      +'<button class="btn icon'+(w.bold?' on':'')+'" data-t="bold" title="Gras"><b>G</b></button>'
      +'<button class="btn icon'+(w.italic?' on':'')+'" data-t="italic" title="Italique"><i>I</i></button>'
      +'<input type="color" data-k="color" value="'+w.color+'" aria-label="Couleur du texte">';
  }else if(t==='rect'){
    h+='<label class="sw"><input type="checkbox" data-k="fillOn"'+(v.fill?' checked':'')+'>Remplissage</label>'
      +'<input type="color" data-k="fill" value="'+(v.fill||'#ffffff')+'" aria-label="Couleur de remplissage">'
      +'<label class="sw"><input type="checkbox" data-k="strokeOn"'+(v.stroke?' checked':'')+'>Contour</label>'
      +'<input type="color" data-k="stroke" value="'+(v.stroke||'#1a2230')+'" aria-label="Couleur du contour">'
      +'<input class="inp num" type="number" min="0.5" max="20" step="0.5" data-k="sw" value="'+v.sw+'" aria-label="Épaisseur du contour">';
  }else if(t==='hl'){
    h+='<span class="sw">Couleur</span><input type="color" data-k="color" value="'+v.color+'" aria-label="Couleur du surlignage">';
  }else if(t==='pen'){
    h+='<span class="sw">Couleur</span><input type="color" data-k="color" value="'+v.color+'" aria-label="Couleur du stylo">'
      +'<span class="sw">Épaisseur</span><input class="inp num" type="number" min="0.5" max="30" step="0.5" data-k="w" value="'+v.w+'" aria-label="Épaisseur du trait">';
  }
  else if(t==='link'){
    if(a){
      const isPage=a.page!=null;
      h+='<select class="inp" data-k="ltype" aria-label="Type de lien"><option value="url"'+(isPage?'':' selected')+'>Adresse web</option><option value="page"'+(isPage?' selected':'')+'>Page du document</option></select>'
        +(isPage?'<input class="inp num" type="number" min="1" max="'+S.pages.length+'" step="1" data-k="page" value="'+a.page+'" aria-label="Numéro de page">'
                :'<input class="inp" type="text" data-k="url" style="width:min(300px,55vw)" placeholder="https://exemple.com ou adresse e-mail" value="'+esc(a.url||'')+'" aria-label="Adresse du lien" autocomplete="off" spellcheck="false">')
        +'<button class="btn" data-t="gotolink" title="Tester le lien">Tester</button>';
    }else h+='<span class="hint">Faites glisser sur la page pour créer un lien.</span>';
  }else if(t==='note'){
    if(!a)h+='<span class="hint">Cliquez sur la page pour placer un commentaire.</span>';
  }
  if(a){
    h+='<div class="sep"></div><button class="btn" data-t="dup" title="Dupliquer">'+ICONS.dup+'<span class="hide-s">Dupliquer</span></button>'
      +'<button class="btn" data-t="del" style="color:var(--danger)" title="Supprimer (Suppr)">'+ICONS.trash+'<span class="hide-s">'+(a.type==='edit'?'Rétablir l\'original':'Supprimer')+'</span></button>';
  }
  bar.innerHTML=h;bar.hidden=!h;
}
function setProp(k,v,commit){
  const a=curAnn();const type=a?a.type:toolType();
  const defs=(type&&type!=='edit')?S.def[type]:null;
  const bar=$('#propbar');
  const apply=o=>{
    if(k==='fillOn')o.fill=v?bar.querySelector('[data-k="fill"]').value:null;
    else if(k==='strokeOn')o.stroke=v?bar.querySelector('[data-k="stroke"]').value:null;
    else if(k==='fill'){o.fill=v;const c=bar.querySelector('[data-k="fillOn"]');if(c)c.checked=true}
    else if(k==='stroke'){o.stroke=v;const c=bar.querySelector('[data-k="strokeOn"]');if(c)c.checked=true}
    else if(k==='size')o.size=clamp(v,4,200);
    else if(k==='ltype'){if(v==='page'){o.page=o.page||S.cur;delete o.url}else{o.url=o.url||'';delete o.page}}
    else if(k==='page')o.page=clamp(Math.round(v),1,S.pages.length);
    else o[k]=v;
  };
  const editing=!!a&&S.editing===a.id;
  if(editing&&k==='color'){
    a.color=v;const el=layerEl(a);if(el)el.style.color=v;
    if(defs)apply(defs);
    if(commit)pushHist();
    return;
  }
  if(editing)a.text=currentEditText(a);
  if(a){
    const keepBase=a.type==='edit'&&(k==='kind'||k==='bold'||k==='italic'||k==='size');
    const bl=keepBase?a.y+baseOff(a.kind,a.bold,a.italic)*a.size:0;
    apply(a);
    if(keepBase)a.y=bl-baseOff(a.kind,a.bold,a.italic)*a.size;
    renderOne(a);
    if(editing)armEditor(a);
  }
  if(defs)apply(defs);
  if(commit&&a)pushHist();
}
$('#propbar').addEventListener('input',e=>{
  const el=e.target,k=el.dataset.k;if(!k||el.type==='checkbox'||el.type==='number'||el.tagName==='SELECT')return;
  setProp(k,el.value,false);
});
/* select a number field's whole value on focus, so typing replaces it instead of inserting into the existing digits */
$('#propbar').addEventListener('focusin',e=>{
  const el=e.target;if(el.tagName==='INPUT'&&el.type==='number'){try{el.select()}catch(x){}}
});
/* Enter confirms a number field right away, instead of requiring a click elsewhere to commit it */
$('#propbar').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type==='number'){e.preventDefault();e.target.blur()}
});
$('#propbar').addEventListener('change',e=>{
  const el=e.target,k=el.dataset.k;if(!k)return;
  let v=el.type==='checkbox'?el.checked:el.type==='number'?parseFloat(el.value):el.value;
  if(el.type==='number'&&!(v>0))return;
  setProp(k,v,true);
  if(k==='kind'||k==='ltype')renderProps(true);
});
$('#propbar').addEventListener('click',e=>{
  const b=e.target.closest('[data-t]');if(!b)return;
  const t=b.dataset.t,a=curAnn();
  if(t==='fonts'){openFonts();return}
  if(t==='gotolink'&&a){followAnnLink(a,1);return}
  if(t==='del'&&a){commitEdit();removeAnn(a.id,true)}
  else if(t==='dup'&&a){commitEdit();dupAnn()}
  else if(t==='bold'||t==='italic'){
    const o=a||S.def.text;const nv=!o[t];
    setProp(t,nv,true);b.classList.toggle('on',nv);
  }
});

/* ---------- images ---------- */
async function prepareImage(file){
  const u0=URL.createObjectURL(file);
  const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('image'));i.src=u0});
  let w=im.naturalWidth||300,h=im.naturalHeight||300;
  let bytes,type;
  if(file.type==='image/png'&&Math.max(w,h)<=2400){bytes=new Uint8Array(await file.arrayBuffer());type='png'}
  else{
    const k=Math.min(1,2400/Math.max(w,h));
    const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));
    const ctx=c.getContext('2d');const jpeg=file.type==='image/jpeg';
    if(jpeg){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height)}
    ctx.drawImage(im,0,0,c.width,c.height);
    const blob=await new Promise(r=>c.toBlob(r,jpeg?'image/jpeg':'image/png',0.92));
    bytes=new Uint8Array(await blob.arrayBuffer());type=jpeg?'jpg':'png';
  }
  URL.revokeObjectURL(u0);
  const url=URL.createObjectURL(new Blob([bytes],{type:type==='jpg'?'image/jpeg':'image/png'}));
  return {id:uid(),url,bytes,type,w,h};
}
async function addImageFile(file,at){
  if(!S.pdf){toast('Ouvrez d\'abord un PDF.');return}
  if(!/^image\//.test(file.type)){toast('Ce fichier n\'est pas une image.');return}
  try{
    busy(true,'Insertion de l\'image…');
    const info=await prepareImage(file);S.imgs[info.id]=info;
    let pg=S.pages[S.cur-1],cxc,cyc;
    if(at){
      const f=S.pages.find(p=>{const b=p.el.getBoundingClientRect();return at.x>=b.left&&at.x<=b.right&&at.y>=b.top&&at.y<=b.bottom});
      if(f){pg=f;cxc=at.x;cyc=at.y}
    }
    const pr=pg.el.getBoundingClientRect(),vr=viewer.getBoundingClientRect();
    if(cxc==null){
      const t=Math.max(pr.top,vr.top),b=Math.min(pr.bottom,vr.bottom),l=Math.max(pr.left,vr.left),r=Math.min(pr.right,vr.right);
      cyc=(t+b)/2;cxc=(l+r)/2;
    }
    const k=pr.width/pg.w;
    let w=Math.min(info.w,pg.w*0.45),h=w*info.h/info.w;
    if(h>pg.h*0.6){h=pg.h*0.6;w=h*info.w/info.h}
    const a={id:uid(),type:'image',n:pg.n,x:clamp((cxc-pr.left)/k-w/2,0,pg.w-w),y:clamp((cyc-pr.top)/k-h/2,0,pg.h-h),w,h,img:info.id};
    S.annots.push(a);pushHist();renderOne(a);selectAnn(a.id);
  }catch(e){console.error(e);toast('Impossible d\'insérer cette image.')}
  finally{busy(false)}
}

/* ---------- ui state ---------- */
function syncUi(){
  const has=!!S.pdf,n=S.pages.length;
  $('#bSave').disabled=!has;$('#bSaveAs').disabled=!has;
  $('#bUndo').disabled=S.hi<=0;$('#bRedo').disabled=S.hi>=S.hist.length-1;
  for(const id of ['bPrev','bNext','bZin','bZout','bFitP','bSearch','bRotL','bRotR','bBlank','bThumbs','bMerge','bCopyPg'])$('#'+id).disabled=!has;
  $('#bPastePg').disabled=!has||!pageClip;
  const cur2=(S.split&&S.active===2)?S.cur2:S.cur;
  $('#bPrev').disabled=!has||cur2<=1;$('#bNext').disabled=!has||cur2>=n;
  const sel=has?selIdx():[];
  $('#bDelPg').disabled=!has||sel.length>=n;
  $('#bMvUp').disabled=!has||!sel.length||sel[0]<=0;
  $('#bMvDn').disabled=!has||!sel.length||sel[sel.length-1]>=n-1;
  renderProps(false);renderTabs();
}
function setTool(t){
  if(t==='image'){if(!S.pdf){toast('Ouvrez d\'abord un PDF.');return}$('#fImg').click();return}
  commitEdit();S.tool=t;viewer.className='tool-'+t;
  $$('#tools [data-tool]').forEach(b=>b.classList.toggle('on',b.dataset.tool===t));
  if(S.pdf&&TOOL_HINT[t]&&!S.hinted[t]){S.hinted[t]=1;toast(TOOL_HINT[t],3200)}
  renderProps(true);
}
function showReplace(on){
  $('#sRep').hidden=!on;$('#sRepT').setAttribute('aria-expanded',on?'true':'false');
  $('#sRepT').textContent=(on?'▾':'▸')+' Remplacer';
}
function openSearch(rep){
  if(!S.pdf)return;
  $('#search').hidden=false;$('#bSearch').classList.add('on');
  if(rep)showReplace(true);
  const i=rep&&$('#sIn').value?$('#rIn'):$('#sIn');i.focus();i.select();
  if($('#sIn').value&&!S.q)runSearch($('#sIn').value);
}
function closeSearch(){
  $('#search').hidden=true;$('#bSearch').classList.remove('on');
  runSearch('');
}
function openSearch2(){
  if(!S.pdf||!S.split)return;
  $('#search2').hidden=false;
  const i=$('#sIn2');i.focus();i.select();
  if(i.value&&!S.q2)runSearch2(i.value);
}
function closeSearch2(){
  $('#search2').hidden=true;
  runSearch2('');
}
async function confirmDiscard(force){
  if(!force&&!S.dirty)return true;
  return new Promise(res=>{
    const m=$('#modal2');m.hidden=false;
    const done=v=>{m.hidden=true;res(v)};
    $('#cfOk').onclick=()=>done(true);$('#cfNo').onclick=()=>done(false);
  });
}
async function tryOpen(file,handle){
  if(!file)return;
  if(!/pdf$/i.test(file.type)&&!/\.pdf$/i.test(file.name)){toast('Ce fichier n\'est pas un PDF.');return}
  await openFile(file,handle);
}
function cleanName(v){
  const n=String(v||'').trim().replace(/\.pdf$/i,'').replace(/[\\/:*?"<>|]+/g,'-').trim();
  return n||null;
}
function askName(def){
  return new Promise(res=>{
    const m=$('#modal3'),i=$('#saIn');i.value=def;m.hidden=false;
    setTimeout(()=>{i.focus();i.select()},30);
    const done=v=>{m.hidden=true;$('#saOk').onclick=$('#saNo').onclick=i.onkeydown=null;res(v)};
    $('#saOk').onclick=()=>done(cleanName(i.value));$('#saNo').onclick=()=>done(null);
    i.onkeydown=e=>{if(e.key==='Enter')done(cleanName(i.value));else if(e.key==='Escape')done(null)};
  });
}
async function saveAs(){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Ce PDF est protégé par un mot de passe : il peut être lu, mais pas enregistré après modification.',5000);return}
  const suggested=(S.saveName||(S.name.replace(/[\\/:*?"<>|]+/g,'-').replace(/-modifie$/,'')+'-modifie'))+'.pdf';
  /* try a real, standard "Save As" dialog (choose the folder, like "Ouvrir") when the browser allows it here */
  if(window.showSaveFilePicker){
    let bytes;
    busy(true,'Préparation du fichier…');
    try{bytes=await buildPdf()}
    catch(e){busy(false);console.error(e);toast('Impossible de générer le PDF : '+(e&&e.message||'erreur inconnue'),5000);return}
    busy(false);
    try{
      const handle=await window.showSaveFilePicker({suggestedName:suggested,types:[{description:'Document PDF',accept:{'application/pdf':['.pdf']}}]});
      const wr=await handle.createWritable();await wr.write(new Blob([bytes],{type:'application/pdf'}));await wr.close();
      /* this new location becomes the one a plain "Enregistrer" writes straight back into next time */
      S.fileHandle=handle;S.fileToken=null;S.dirty=false;S.saveName=handle.name.replace(/\.pdf$/i,'');renderTabs();toast('Fichier enregistré.');
      return;
    }catch(e){
      if(e&&e.name==='AbortError')return; /* the person cancelled the dialog */
      console.warn('showSaveFilePicker indisponible ici, retour à la boîte de dialogue classique.',e);
      /* falls through to the name-only flow below */
    }
  }
  if(PWA&&COARSE){savePdf();return} /* the phone's save dialog already asks for the name and the place */
  const name=await askName(S.saveName||(S.name.replace(/-modifie$/,'')+'-modifie'));
  if(name)savePdf(name);
}

/* ---------- wiring ---------- */
$('#bOpen2').onclick=()=>pickAndOpen();
$('#fPdf').onchange=async e=>{const fs=[...e.target.files];e.target.value='';for(const f of fs)await tryOpen(f)};

/* ---------- "Ouvrir" menu (classic open + recent files) ---------- */
let _recentCache=[];
function closeOpenMenu(){$('#openMenu').hidden=true;$('#bOpen').classList.remove('on')}
async function renderOpenMenu(){
  const box=$('#omRecent');box.textContent='';
  _recentCache=await getRecent();
  if(!_recentCache.length){
    const d=document.createElement('div');d.className='mi-empty';d.textContent='Aucun fichier récent';box.append(d);return;
  }
  _recentCache.forEach((entry,i)=>{
    const b=document.createElement('button');
    b.className='mi';b.type='button';b.setAttribute('role','menuitem');b.dataset.omRecent=i;
    const sp=document.createElement('span');sp.innerHTML=ICONS.doc||'';b.append(sp);
    const nm=document.createElement('span');nm.textContent=entry.name;b.append(nm);
    b.title=entry.name;
    box.append(b);
  });
}
$('#bOpen').onclick=async e=>{
  e.stopPropagation();
  const m=$('#openMenu');
  if(!m.hidden){closeOpenMenu();return}
  await renderOpenMenu();
  const r=$('#bOpen').getBoundingClientRect();
  m.hidden=false;$('#bOpen').classList.add('on');
  m.style.left=Math.max(8,Math.min(r.left,innerWidth-m.offsetWidth-8))+'px';m.style.top=(r.bottom+4)+'px';
};
$('#openMenu').addEventListener('click',e=>{
  const b=e.target.closest('[data-om],[data-om-recent]');if(!b)return;
  closeOpenMenu();
  if(b.dataset.om==='browse')pickAndOpen();
  else if(b.dataset.omRecent!==undefined)openRecentEntry(_recentCache[+b.dataset.omRecent]);
});
document.addEventListener('pointerdown',e=>{if(!$('#openMenu').hidden&&!e.target.closest('#openMenu,#bOpen'))closeOpenMenu()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#openMenu').hidden)closeOpenMenu()});
$('#fImg').onchange=e=>{const fs=[...e.target.files];e.target.value='';fs.forEach(f=>addImageFile(f))};
$('#bSave').onclick=()=>savePdf();
$('#bSaveAs').onclick=()=>saveAs();
$('#bUndo').onclick=()=>{commitEdit();undo()};
$('#bRedo').onclick=()=>{commitEdit();redo()};
$('#bThumbs').onclick=()=>{
  S.thumbsOpen=!S.thumbsOpen;$('#thumbs').hidden=!S.thumbsOpen;$('#bThumbs').classList.toggle('on',S.thumbsOpen);
};
const pane2Active=()=>S.split&&S.active===2;
$('#bPrev').onclick=()=>pane2Active()?goto2(S.cur2-1):goto(S.cur-1);
$('#bNext').onclick=()=>pane2Active()?goto2(S.cur2+1):goto(S.cur+1);
$('#pgIn').onchange=e=>{const n=parseInt(e.target.value,10);pane2Active()?goto2(n||S.cur2):goto(n||S.cur)};
$('#pgIn').onkeydown=e=>{if(e.key==='Enter')e.target.blur()};
$('#bZin').onclick=()=>pane2Active()?stepZoom2(1):stepZoom(1);
$('#bZout').onclick=()=>pane2Active()?stepZoom2(-1):stepZoom(-1);
$('#bFitP').onclick=()=>pane2Active()?fitPage2():fitPage();
$('#bSearch').onclick=()=>{
  if(pane2Active()){$('#search2').hidden?openSearch2():closeSearch2();return}
  $('#search').hidden?openSearch():closeSearch();
};
let sT=0;
const reSearch=()=>{clearTimeout(sT);sT=setTimeout(()=>runSearch($('#sIn').value),180)};
$('#sIn').oninput=reSearch;
$('#sIn').onkeydown=e=>{
  if(e.key==='Enter'){e.preventDefault();clearTimeout(sT);if(S.q!==$('#sIn').value)runSearch($('#sIn').value);else stepHit(e.shiftKey?-1:1)}
  else if(e.key==='Escape'){closeSearch()}
};
$('#rIn').onkeydown=e=>{
  if(e.key==='Enter'){e.preventDefault();doReplace(e.ctrlKey||e.metaKey)}
  else if(e.key==='Escape'){closeSearch()}
};
$('#sNext').onclick=()=>stepHit(1);$('#sPrev').onclick=()=>stepHit(-1);$('#sClose').onclick=closeSearch;
for(const [id,k] of [['oCase','cs'],['oWord','ww'],['oAcc','acc'],['oRe','re']]){
  $('#'+id).onclick=()=>{
    S.so[k]=!S.so[k];$('#'+id).classList.toggle('on',S.so[k]);$('#'+id).setAttribute('aria-pressed',S.so[k]);
    if($('#sIn').value)runSearch($('#sIn').value);
  };
}
$('#sRepT').onclick=()=>showReplace($('#sRep').hidden);
$('#rOne').onclick=()=>doReplace(false);
$('#rAll').onclick=()=>doReplace(true);
$('#sList').onclick=e=>{
  const b=e.target.closest('.si');if(!b)return;
  S.hix=+b.dataset.i;focusHit();
};
let sT2=0;
const reSearch2=()=>{clearTimeout(sT2);sT2=setTimeout(()=>runSearch2($('#sIn2').value),180)};
$('#sIn2').oninput=reSearch2;
$('#sIn2').onkeydown=e=>{
  if(e.key==='Enter'){e.preventDefault();clearTimeout(sT2);if(S.q2!==$('#sIn2').value)runSearch2($('#sIn2').value);else stepHit2(e.shiftKey?-1:1)}
  else if(e.key==='Escape'){closeSearch2()}
};
$('#sNext2').onclick=()=>stepHit2(1);$('#sPrev2').onclick=()=>stepHit2(-1);$('#sClose2').onclick=closeSearch2;
for(const [id,k] of [['oCase2','cs'],['oWord2','ww'],['oAcc2','acc'],['oRe2','re']]){
  $('#'+id).onclick=()=>{
    S.so2[k]=!S.so2[k];$('#'+id).classList.toggle('on',S.so2[k]);$('#'+id).setAttribute('aria-pressed',S.so2[k]);
    if($('#sIn2').value)runSearch2($('#sIn2').value);
  };
}
$('#sList2').onclick=e=>{
  const b=e.target.closest('.si');if(!b)return;
  S.hix2=+b.dataset.i;focusHit2();
};
/* which pane keyboard/toolbar actions apply to (only matters once split view is on, and never for clicks on the floating toolbar/modals, so it never steals focus mid-click) */
const PANE_UI_EXCLUDE='#propbar,#modal,#modal2,#modal3,#modal4,#toast';
$('#stage').addEventListener('pointerdown',e=>{if(S.split&&S.active!==1&&!e.target.closest(PANE_UI_EXCLUDE))setActive(1)},true);
$('#stage2').addEventListener('pointerdown',e=>{if(S.split&&S.active!==2&&!e.target.closest(PANE_UI_EXCLUDE))setActive(2)},true);
/* screenshot capture bar */
$('#shotClose').onclick=()=>{
  $('#shotBar').hidden=true;
  if(S.shotUrl){URL.revokeObjectURL(S.shotUrl);S.shotUrl=null}S.shotBlob=null;
};
$('#shotCopy').onclick=async()=>{
  if(!S.shotBlob)return;
  try{
    await navigator.clipboard.write([new ClipboardItem({'image/png':S.shotBlob})]);
    toast('Image copiée dans le presse-papiers.');
  }catch(e){console.error(e);toast('La copie a échoué : votre navigateur ne le permet peut-être pas ici.')}
};
$('#shotSave').onclick=async()=>{
  if(!S.shotBlob||!DL)return;
  try{await DL.save({filename:S.name+'-capture.png',data:S.shotBlob})}
  catch(e){if(e&&e.code!=='declined'){console.error(e);toast('Le téléchargement a échoué.')}}
};
$('#bRotL').onclick=()=>pageOp('rotl');$('#bRotR').onclick=()=>pageOp('rotr');
$('#bMvUp').onclick=()=>pageOp('up');$('#bMvDn').onclick=()=>pageOp('down');
$('#bBlank').onclick=()=>pageOp('blank');$('#bDelPg').onclick=()=>pageOp('del');
$$('#tools [data-tool]').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));

viewer.addEventListener('pointerdown',e=>{
  if(!S.sel||e.target.closest('[data-id]')||e.target.closest('.al'))return;
  const a=curAnn();S.sel=null;if(a)renderOne(a);renderProps(true);
});

/* drag and drop, paste */
const dz=$('#drop');
['dragenter','dragover'].forEach(ev=>viewer.addEventListener(ev,e=>{
  if(!e.dataTransfer||![...e.dataTransfer.types].includes('Files'))return;
  e.preventDefault();dz.classList.add('over');
}));
['dragleave','drop'].forEach(ev=>viewer.addEventListener(ev,e=>{if(e.target===viewer||e.target===dz||ev==='drop')dz.classList.remove('over')}));
viewer.addEventListener('drop',e=>{
  const fs=[...(e.dataTransfer&&e.dataTransfer.files||[])];if(!fs.length)return;
  e.preventDefault();
  const pdf=fs.find(f=>/pdf$/i.test(f.type)||/\.pdf$/i.test(f.name));
  if(pdf){(async()=>{for(const f of fs.filter(f=>/pdf$/i.test(f.type)||/\.pdf$/i.test(f.name)))await tryOpen(f)})();return}
  fs.filter(f=>/^image\//.test(f.type)).forEach(f=>addImageFile(f,{x:e.clientX,y:e.clientY}));
});
document.addEventListener('paste',e=>{
  const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  const it=[...(e.clipboardData&&e.clipboardData.items||[])].find(i=>i.kind==='file'&&/^image\//.test(i.type));
  if(it){e.preventDefault();addImageFile(it.getAsFile())}
});

/* keyboard */
document.addEventListener('keydown',e=>{
  const t=e.target,typing=t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const mod=e.ctrlKey||e.metaKey,key=e.key.toLowerCase();
  if(mod&&key==='f'){e.preventDefault();pane2Active()?openSearch2():openSearch();return}
  if(mod&&key==='h'){e.preventDefault();openSearch(true);return}
  if(mod&&key==='s'){e.preventDefault();e.shiftKey?saveAs():savePdf();return}
  if(typing||!S.pdf)return;
  if((key==='delete'||key==='backspace')&&t&&t.id==='thumbs'){e.preventDefault();pageOp('del');return}
  if(mod&&key==='c'&&t&&t.id==='thumbs'){e.preventDefault();copyPagesToClip();return}
  if(mod&&key==='v'&&t&&t.id==='thumbs'){e.preventDefault();pastePages();return}
  if(mod&&key==='a'&&t&&t.id==='thumbs'){e.preventDefault();S.thSel=new Set(S.pages.map((p,i)=>i));paintThumbSel();syncUi();return}
  if(mod&&key==='z'){e.preventDefault();e.shiftKey?redo():undo();return}
  if(mod&&key==='y'){e.preventDefault();redo();return}
  if(mod&&(key==='+'||key==='=')){e.preventDefault();pane2Active()?stepZoom2(1):stepZoom(1);return}
  if(mod&&key==='-'){e.preventDefault();pane2Active()?stepZoom2(-1):stepZoom(-1);return}
  if(mod&&key==='0'){e.preventDefault();pane2Active()?fitPage2():fitPage();return}
  if(mod)return;
  if(key==='delete'||key==='backspace'){const a=curAnn();if(a){e.preventDefault();removeAnn(a.id,true)}return}
  if(key==='escape'){
    const a=curAnn();
    if(a){S.sel=null;renderOne(a);renderProps(true)}else setTool('sel');return;
  }
  if(key.startsWith('arrow')){
    const a=curAnn();if(!a)return;
    e.preventDefault();const s=e.shiftKey?10:1;
    const dx=key==='arrowleft'?-s:key==='arrowright'?s:0,dy=key==='arrowup'?-s:key==='arrowdown'?s:0;
    if(a.pts)a.pts=a.pts.map(p=>[p[0]+dx,p[1]+dy]);else{a.x+=dx;a.y+=dy}
    renderOne(a);pushHist();return;
  }
  const map={v:'sel',e:'edit',t:'text',i:'image',h:'hl',r:'rect',p:'pen',c:'shot',l:'link',n:'note'};
  if(map[key]){e.preventDefault();setTool(map[key])}
});
window.addEventListener('beforeunload',e=>{if(S.dirty){e.preventDefault();e.returnValue=''}});
/* keep the text editor focused while using the properties bar; a click elsewhere in the document ends the edit */
$('#propbar').addEventListener('mousedown',e=>{
  if(!S.editing)return;
  if(e.target.closest('button')||(e.target.closest('label')&&!e.target.closest('input')))e.preventDefault();
});
document.addEventListener('pointerdown',e=>{
  if(!S.editing)return;
  const a=findAnn(S.editing),el=a&&layerEl(a);
  if(el&&el.contains(e.target))return;
  if(e.target.closest('#propbar,#mFmt,#modal4,#toast'))return;
  commitEdit();
},true);

/* theme: automatic, light or dark */
const rootEl=document.documentElement,hostTheme=rootEl.getAttribute('data-theme');
function applyTheme(m){
  if(m==='light'||m==='dark')rootEl.setAttribute('data-theme',m);
  else if(hostTheme)rootEl.setAttribute('data-theme',hostTheme);
  else rootEl.removeAttribute('data-theme');
}
let themeMode='auto';
try{themeMode=localStorage.getItem('atelier-theme')||'auto'}catch(e){}
if(!['auto','light','dark'].includes(themeMode))themeMode='auto';
$('#themeSel').value=themeMode;applyTheme(themeMode);
$('#themeSel').onchange=e=>{
  themeMode=e.target.value;applyTheme(themeMode);
  try{localStorage.setItem('atelier-theme',themeMode)}catch(x){}
};
syncUi();

/* ---------- desktop app: files handed over by the launcher, heartbeat, close warning ---------- */
if(DESKTOP){
  const cid=Math.random().toString(36).slice(2);
  const poll=async()=>{
    try{
      const j=await (await fetch('/api/hb?id='+cid,{cache:'no-store'})).json();
      for(const f of j.files||[]){
        const b=await (await fetch('/api/file/'+f.token)).arrayBuffer();
        await tryOpen(new File([b],f.name,{type:'application/pdf'}),f.token);
      }
    }catch(e){}
  };
  poll();setInterval(poll,2000);
  window.addEventListener('beforeunload',e=>{
    if(S.dirty||S.tabs.some(t=>t.snap&&t.snap.dirty)){e.preventDefault();e.returnValue=''}
  });
}

/* ---------- hyperlinks and comments (sticky notes), editable like in Acrobat ----------
   Both live in S.annots like every other annotation: {type:'link',n,x,y,w,h,url|page} and
   {type:'note',n,x,y,text,author,date}. Links and sticky notes that already exist in a PDF are "lifted" out of
   the file when it is opened (see liftAnnots) so they can be edited or deleted; buildPdf writes them back
   as genuine /Link and /Text annotations. */
const NOTE_SIZE=22;
const NOTE_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h15A1.5 1.5 0 0 1 21 4.5v11a1.5 1.5 0 0 1-1.5 1.5H11l-5 4v-4H4.5A1.5 1.5 0 0 1 3 15.5z" fill="#ffd84a" stroke="#9a7b00" stroke-width="1.2" stroke-linejoin="round"/><path d="M7 8h10M7 11.5h7" stroke="#9a7b00" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>';
function getAuthor(){let v='';try{v=localStorage.getItem('atelier-author')||''}catch(e){}return v||'Utilisateur'}
function setAuthor(v){try{localStorage.setItem('atelier-author',v)}catch(e){}}
function normUrl(u){
  u=String(u||'').trim();if(!u)return '';
  if(/^[a-z][a-z0-9+.-]*:/i.test(u))return /^javascript:/i.test(u)?'':u;
  if(/^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(u))return 'mailto:'+u;
  return 'https://'+u;
}
const fmtNoteDate=iso=>{try{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}};
/* desktop app: the backend hands the address to the default browser / mail client; browser: new tab */
function openExternal(u){
  if(DESKTOP){
    fetch('/api/openurl',{method:'POST',headers:{'X-LetUs':'1'},body:u})
      .then(r=>{if(!r.ok)throw new Error('status '+r.status)})
      .catch(e=>{console.error(e);toast('Impossible d\'ouvrir ce lien.')});
    return;
  }
  window.open(u,'_blank','noopener');
}
function followAnnLink(a,pane){
  if(a.page!=null){pane===2?goto2(a.page):goto(a.page);return}
  const u=normUrl(a.url);
  if(!u){toast('Ce lien n\'a pas encore d\'adresse.');return}
  openExternal(u);
}
function linkTitle(a){return a.page!=null?'Aller à la page '+a.page:(a.url||'Lien sans adresse')}
/* ---------- links that are only text ----------
   Many PDFs hold a web address or e-mail as plain text, with no link annotation at all: Acrobat (and other
   readers) still make it clickable. The same is done here by scanning the text layer. Those auto-detected
   links are clickable in reading mode; with the Lien tool, clicking one turns it into a real, editable
   link annotation. "Deleting" one (or a real link lying on top of one) adds an invisible {type:'nolink'}
   marker so it stops being clickable here. */
const AUTO_RE=/(?:https?:\/\/|www\.)[^\s<>"'`]+|[A-Z0-9._%+\-]+@[A-Z0-9\-]+(?:\.[A-Z0-9\-]+)*\.[A-Z]{2,}/gi;
function detectAutoLinks(pg){
  /* geometry only (pdf.js text groups + canvas font metrics): no dependency on DOM layout,
     so it also works for invisible text and whatever the window/zoom/tab state */
  if(pg.autoDone||!pg.groups)return;
  pg.autoDone=true;
  const out=[];
  try{
    for(const g of pg.groups){
      if(Math.abs(g.ang)>1e-3)continue;
      const s=g.str;AUTO_RE.lastIndex=0;let m;
      const nw=natW(s,g.kind,g.bold,g.italic)*g.size,r=nw>0?clamp(g.w/nw,0.2,5):1;
      while((m=AUTO_RE.exec(s))){
        const t=m[0].replace(/[.,;:!?)\]}>]+$/,'');if(!t)continue;
        const x0=g.x+natW(s.slice(0,m.index),g.kind,g.bold,g.italic)*g.size*r;
        const w=natW(t,g.kind,g.bold,g.italic)*g.size*r;
        out.push({url:normUrl(t),x:x0,y:g.y-g.asc*g.size,w,h:(g.asc-g.desc)*g.size});
      }
    }
  }catch(e){console.error(e)}
  pg.autoLinks=out;
  if(out.length)refreshLinkHits(pg);
}
const rectCenterIn=(r,o)=>{const cx=o.x+o.w/2,cy=o.y+o.h/2;return cx>=r.x&&cx<=r.x+r.w&&cy>=r.y&&cy<=r.y+r.h};
function overlapRatio(a,b){
  const w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
  return w>0&&h>0?(w*h)/Math.max(1,b.w*b.h):0;
}
/* an auto-detected link is hidden once a real link or a "nolink" marker already covers it */
function autoCovered(pg,au){
  return S.annots.some(a=>(a.type==='link'||a.type==='nolink')&&a.n===pg.n&&overlapRatio(a,au)>0.4);
}
function autoLinkAt(pg,p){
  return (pg.autoLinks||[]).find(au=>p.x>=au.x&&p.x<=au.x+au.w&&p.y>=au.y&&p.y<=au.y+au.h&&!autoCovered(pg,au))||null;
}
function convertAuto(pg,au){
  const a={id:uid(),type:'link',n:pg.n,x:au.x,y:au.y,w:au.w,h:au.h,url:au.url};
  S.annots.push(a);pushHist();selectAnn(a.id);refreshLinkHits(pg);
  setTimeout(()=>{const i=$('#propbar [data-k="url"]');if(i){i.focus();i.select()}},30);
}
function suppressAuto(a){
  const pg=pageOf(a);if(!pg)return;
  for(const au of pg.autoLinks||[]){
    if(overlapRatio(a,au)>0.5&&!autoCovered(pg,au))S.annots.push({id:uid(),type:'nolink',n:a.n,x:au.x,y:au.y,w:au.w,h:au.h});
  }
}
/* clickable areas (reading mode) for the links stored in S.annots */
function refreshLinkHits(pg){
  if(!pg)return;
  for(const layer of [pg.ll,pg.ll2]){
    if(!layer)continue;
    layer.querySelectorAll('.lnka').forEach(n=>n.remove());
    for(const a of S.annots){
      if(a.type!=='link'||a.n!==pg.n||(a.page==null&&!normUrl(a.url)))continue;
      const hit=document.createElement('div');hit.className='lnkhit lnka';
      Object.assign(hit.style,{left:a.x+'px',top:a.y+'px',width:a.w+'px',height:a.h+'px'});
      hit.title=linkTitle(a);
      const pane=layer===pg.ll2?2:1;
      hit.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();followAnnLink(a,pane)});
      layer.append(hit);
    }
    for(const au of pg.autoLinks||[]){
      if(autoCovered(pg,au))continue;
      const hit=document.createElement('div');hit.className='lnkhit lnka lnkauto';
      Object.assign(hit.style,{left:au.x+'px',top:au.y+'px',width:au.w+'px',height:au.h+'px'});
      hit.title=au.url;
      const pane=layer===pg.ll2?2:1;
      hit.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();followAnnLink({url:au.url},pane)});
      layer.append(hit);
    }
  }
}
function notePop(a,pg){
  const W=250,H=180;
  const p=document.createElement('div');p.className='note-pop';p.dataset.cid=a.id;
  const l=Math.max(4,Math.min(a.x,pg.w-W-4));let t=a.y+NOTE_SIZE+4;if(t+H>pg.h)t=Math.max(4,a.y-H-4);
  Object.assign(p.style,{left:l+'px',top:t+'px',width:W+'px'});
  const h=document.createElement('div');h.className='np-h';
  const au=document.createElement('input');au.className='np-au';au.placeholder='Auteur';au.maxLength=60;au.value=a.author||'';au.setAttribute('aria-label','Auteur du commentaire');
  const d=document.createElement('span');d.className='np-d';d.textContent=fmtNoteDate(a.date);
  const x=document.createElement('button');x.className='np-x';x.type='button';x.title='Supprimer ce commentaire';x.setAttribute('aria-label','Supprimer ce commentaire');x.innerHTML=ICONS.trash;
  h.append(au,d,x);
  const ta=document.createElement('textarea');ta.className='np-t';ta.placeholder='Écrivez votre commentaire…';ta.value=a.text||'';ta.setAttribute('aria-label','Commentaire');
  p.append(h,ta);
  const touch=()=>{a.date=new Date().toISOString();d.textContent=fmtNoteDate(a.date)};
  ta.addEventListener('input',()=>{a.text=ta.value;const ic=layerEl(a);if(ic)ic.title=a.text||'Commentaire vide'});
  ta.addEventListener('change',()=>{touch();pushHist()});
  au.addEventListener('change',()=>{a.author=au.value.trim()||getAuthor();setAuthor(a.author);pushHist()});
  x.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();removeAnn(a.id,true)});
  for(const el of [ta,au])el.addEventListener('keydown',e=>{
    e.stopPropagation();
    if(e.key==='Escape'){e.preventDefault();el.blur();S.sel=null;renderOne(a);renderProps(true)}
  });
  p.addEventListener('pointerdown',e=>e.stopPropagation());
  return p;
}
function createNote(pg,pt){
  const a={id:uid(),type:'note',n:pg.n,x:clamp(pt.x-NOTE_SIZE/2,0,pg.w-NOTE_SIZE),y:clamp(pt.y-NOTE_SIZE/2,0,pg.h-NOTE_SIZE),text:'',author:getAuthor(),date:new Date().toISOString()};
  S.annots.push(a);pushHist();
  setTool('sel');
  renderOne(a);selectAnn(a.id);
  setTimeout(()=>{const ta=pg.al.querySelector('[data-cid="'+a.id+'"] textarea');if(ta)ta.focus()},30);
}
function drawLink(pg,e){
  const p0=ptOf(pg,e);
  const a={id:uid(),type:'link',n:pg.n,x:p0.x,y:p0.y,w:0,h:0,url:''};
  S.annots.push(a);
  const mv=ev=>{
    const p=ptOf(pg,ev);
    a.x=Math.min(p0.x,p.x);a.y=Math.min(p0.y,p.y);a.w=Math.abs(p.x-p0.x);a.h=Math.abs(p.y-p0.y);renderOne(a);
  };
  const up=()=>{
    window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
    if(a.w<6||a.h<6){removeAnn(a.id,false);return}
    pushHist();selectAnn(a.id);
    setTimeout(()=>{const i=$('#propbar [data-k="url"]');if(i)i.focus()},30);
  };
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
}

/* ---------- lifting the links / sticky notes already inside a PDF ---------- */
const pdfDateToIso=s=>{
  const m=/^D?:?(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(String(s||'').replace(/^D:/,'D:'));
  if(!m)return new Date().toISOString();
  const d=new Date(Date.UTC(+m[1],(+m[2]||1)-1,+m[3]||1,+m[4]||0,+m[5]||0,+m[6]||0));
  return isNaN(d)?new Date().toISOString():d.toISOString();
};
const pdfDateStr=iso=>{
  const d=new Date(iso||Date.now()),z=n=>String(n).padStart(2,'0');
  return 'D:'+d.getUTCFullYear()+z(d.getUTCMonth()+1)+z(d.getUTCDate())+z(d.getUTCHours())+z(d.getUTCMinutes())+z(d.getUTCSeconds())+'Z';
};
/* Returns {bytes,annots} (bytes = the PDF without the lifted /Link and /Text annotations) or null when
   there is nothing to lift. Only links with a web address or a resolvable page, and plain sticky notes,
   are lifted - anything else (named actions, replies...) stays in the file untouched. */
async function liftAnnots(pdf,bytes){
  const lifted=[],strip=new Map();
  const objNum=id=>{const m=/^(\d+)R/.exec(String(id||''));return m?+m[1]:null};
  /* an annotation stored as an indirect object is identified by its object number; one written inline in
     the page's /Annots array has none, so it is found again by its subtype and rectangle instead */
  const mark=(i,id,sub,rect)=>{
    if(!strip.has(i))strip.set(i,{nums:new Set(),rects:[]});
    const e=strip.get(i),n=objNum(id);
    if(n!=null)e.nums.add(n);
    else e.rects.push({sub,r:[Math.min(rect[0],rect[2]),Math.min(rect[1],rect[3]),Math.max(rect[0],rect[2]),Math.max(rect[1],rect[3])]});
  };
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i),vp=page.getViewport({scale:1});
    let list;try{list=await page.getAnnotations({intent:'display'})}catch(e){continue}
    const rect=r=>{
      const p1=vp.convertToViewportPoint(r[0],r[1]),p2=vp.convertToViewportPoint(r[2],r[3]);
      return {x:Math.min(p1[0],p2[0]),y:Math.min(p1[1],p2[1]),w:Math.abs(p2[0]-p1[0]),h:Math.abs(p2[1]-p1[1])};
    };
    const liftedIds=new Set();
    for(const an of list){
      if(!an.rect)continue;
      if(an.subtype==='Link'){
        let url=an.url||an.unsafeUrl||'',pageNo=null;
        if(/^javascript:/i.test(url))continue;
        if(!url&&an.dest){
          try{
            let d=an.dest;if(typeof d==='string')d=await pdf.getDestination(d);
            if(d&&d.length){
              if(d[0]&&typeof d[0]==='object')pageNo=(await pdf.getPageIndex(d[0]))+1;
              else if(Number.isInteger(d[0]))pageNo=d[0]+1;
            }
          }catch(e){}
        }
        if(!url&&!pageNo)continue;
        const r=rect(an.rect);if(!(r.w>0.2)||!(r.h>0.2))continue;
        const a={id:uid(),type:'link',n:i,...r};
        if(url)a.url=url;else a.page=pageNo;
        lifted.push(a);mark(i-1,an.id,'Link',an.rect);liftedIds.add(an.id);
      }else if(an.subtype==='Text'&&!an.inReplyTo&&!an.parentId){
        const r=rect(an.rect);
        const co=an.contentsObj&&an.contentsObj.str!=null?an.contentsObj.str:(an.contents||'');
        const au=an.titleObj&&an.titleObj.str!=null?an.titleObj.str:(an.title||'');
        lifted.push({id:uid(),type:'note',n:i,x:clamp(r.x,0,vp.width-NOTE_SIZE),y:clamp(r.y,0,vp.height-NOTE_SIZE),text:String(co).replace(/\r\n?/g,'\n'),author:au||'Utilisateur',date:pdfDateToIso(an.modificationDate||an.creationDate)});
        mark(i-1,an.id,'Text',an.rect);liftedIds.add(an.id);
      }
    }
    /* a sticky note's popup window annotation is meaningless once the note is gone */
    for(const an of list)if(an.subtype==='Popup'&&liftedIds.has(an.parentId)&&objNum(an.id)!=null)mark(i-1,an.id,'Popup',an.rect);
  }
  if(!lifted.length)return null;
  const {PDFDocument,PDFName,PDFDict,PDFRef,PDFNumber}=PDFLib;
  let doc;
  try{doc=await PDFDocument.load(bytes.slice(0))}
  catch(e){
    const err=new Error(/encrypt/i.test(String(e&&e.message))?'encrypted':'unreadable');err.liftFail=true;throw err;
  }
  const ctx=doc.context;
  const near=(a,b)=>Math.abs(a-b)<0.75;
  doc.getPages().forEach((p,idx)=>{
    const e=strip.get(idx);if(!e)return;
    const arr=p.node.Annots();if(!arr)return;
    for(let k=arr.size()-1;k>=0;k--){
      const ent=arr.get(k);
      if(ent instanceof PDFRef&&e.nums.has(ent.objectNumber)){arr.remove(k);continue}
      if(!e.rects.length)continue;
      const d=ent instanceof PDFRef?ctx.lookup(ent):ent;
      if(!(d instanceof PDFDict))continue;
      const st=d.get(PDFName.of('Subtype')),ra=ctx.lookup(d.get(PDFName.of('Rect')));
      if(!st||!ra||!ra.size||ra.size()<4)continue;
      const r=[0,1,2,3].map(j=>{const v=ctx.lookup(ra.get(j));return v instanceof PDFNumber?v.asNumber():NaN});
      const n=[Math.min(r[0],r[2]),Math.min(r[1],r[3]),Math.max(r[0],r[2]),Math.max(r[1],r[3])];
      const sub=String(st.toString()).replace('/','');
      const hit=e.rects.findIndex(q=>q.sub===sub&&near(q.r[0],n[0])&&near(q.r[1],n[1])&&near(q.r[2],n[2])&&near(q.r[3],n[3]));
      if(hit>=0){e.rects.splice(hit,1);arr.remove(k)}
    }
  });
  return {bytes:new Uint8Array(await doc.save()),annots:lifted};
}

/* ---------- export (pdf-lib) ---------- */
let DL=null;
/* desktop app: real "save as" dialog (File System Access API) or a plain download */
/* filename extension -> {label, mime} used by the native "Save as" picker so it offers the right
   file type/filter for whatever is actually being saved (PDF, a screenshot, or one of the Office
   export formats below), instead of always assuming PDF. */
const SAVE_TYPES={
  png:['Image PNG','image/png'],
  pdf:['Document PDF','application/pdf'],
};
const desktopDL={async save({filename,data}){
  if(window.showSaveFilePicker){
    const m=/\.([a-z0-9]+)$/i.exec(filename||'');
    const ext=(m?m[1]:'').toLowerCase();
    const t=SAVE_TYPES[ext]||[null,data.type];
    const types=t[0]?[{description:t[0],accept:{[t[1]]:['.'+ext]}}]:undefined;
    let h;
    try{h=await window.showSaveFilePicker({suggestedName:filename,types})}
    catch(e){if(e&&e.name==='AbortError'){const d=new Error('declined');d.code='declined';throw d}throw e}
    const wr=await h.createWritable();await wr.write(data);await wr.close();return;
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=filename;document.body.append(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);
}};
/* phone / tablet: the share sheet is the way to put a file in "Files", Drive, Mail, WhatsApp... */
const mobileDL={share:true,save({filename,data}){
  const dl=(name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)};
  if(!COARSE){dl(filename);return Promise.resolve()}
  /* phone: a small dialog, so that the share sheet opens from a fresh tap (iOS refuses it otherwise) and
     the person can rename the file; the sheet's "Enregistrer dans Fichiers" lets them pick the folder */
  return new Promise((res,rej)=>{
    const base=filename.replace(/\.pdf$/i,'');
    const ov=document.createElement('div');ov.id='modal';ov.style.zIndex=70;
    const mb=(data.size/1048576).toFixed(data.size>1048576*10?0:1);
    ov.innerHTML='<div class="box savebox"><h2>Enregistrer le fichier</h2><input class="inp" id="svName" aria-label="Nom du fichier" autocapitalize="off" autocomplete="off" spellcheck="false"><small>'+mb+' Mo · PDF</small><div class="row"><button class="btn primary" id="svShare">Choisir l\u2019emplacement…</button></div><div class="row">'+(NATIVE?'':'<button class="btn" id="svDl">Télécharger</button>')+'<button class="btn" id="svNo">Annuler</button></div><small>'+(NATIVE?'Le sélecteur de fichiers de l\u2019iPhone s\u2019ouvre : choisissez le dossier (iCloud Drive, Sur mon iPhone, OneDrive…).':'« Choisir l\u2019emplacement » ouvre le menu du téléphone : choisissez <b>Enregistrer dans Fichiers</b> (iPhone) ou votre application de stockage (Android).')+'</small></div>';
    document.body.append(ov);
    const inp=ov.querySelector('#svName');inp.value=base;
    const nm=()=>(inp.value.trim().replace(/[\\/:*?"<>|]+/g,'-')||base).replace(/\.pdf$/i,'')+'.pdf';
    const close=()=>ov.remove();
    ov.querySelector('#svNo').onclick=()=>{close();const e=new Error('declined');e.code='declined';rej(e)};
    if(!NATIVE)ov.querySelector('#svDl').onclick=()=>{dl(nm());close();res()};
    ov.querySelector('#svShare').onclick=async()=>{
      if(NATIVE){
        const name=nm();
        const b64=await new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>ok(String(fr.result).split(',')[1]||'');fr.onerror=ko;fr.readAsDataURL(data)});
        window.webkit.messageHandlers.letuspdf.postMessage({type:'save',name,b64});
        close();res();return;
      }
      const file=new File([data],nm(),{type:'application/pdf'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){
        try{await navigator.share({files:[file]});close();res();return}
        catch(e){if(e&&e.name==='AbortError')return;console.warn('share failed',e)}
      }
      dl(nm());close();res();
    };
  });
}};
(async()=>{try{if(window.claude&&window.claude.use)DL=await window.claude.use('downloads')}catch(e){}if(!DL&&DESKTOP)DL=desktopDL;if(!DL&&PWA)DL=mobileDL})();

const SF=PDFLib.StandardFonts;
const FN={
  helv:[SF.Helvetica,SF.HelveticaBold,SF.HelveticaOblique,SF.HelveticaBoldOblique],
  times:[SF.TimesRoman,SF.TimesRomanBold,SF.TimesRomanItalic,SF.TimesRomanBoldItalic],
  cour:[SF.Courier,SF.CourierBold,SF.CourierOblique,SF.CourierBoldOblique]
};
function hexRgb(h){
  const m=/^#?([0-9a-f]{6})$/i.exec(h||'');const n=m?parseInt(m[1],16):0;
  return PDFLib.rgb(((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255);
}
function encText(font,s,stat){
  const set=font._cs||(font._cs=new Set(font.getCharacterSet()));
  let o='';
  for(const ch of s.replace(/\u00a0/g,' ').replace(/[\u200b-\u200f\u2028\u2029\ufeff]/g,'')){
    const cp=ch.codePointAt(0);
    if(set.has(cp)){o+=ch;continue}
    const d=ch.normalize('NFD')[0];
    stat.n++;
    o+=set.has(d.codePointAt(0))?d:'?';
  }
  return o;
}
async function buildPdf(){
  const {PDFDocument,degrees,LineCapStyle}=PDFLib;
  const doc=await PDFDocument.load(S.bytes.slice(0));
  const fonts={},imgs={},stat={n:0,fb:0};
  const usesUser=S.annots.some(a=>(a.type==='text'||a.type==='edit')&&String(a.kind).startsWith('u:'));
  let fkOk=false;
  if(usesUser){
    try{await loadFontkit();doc.registerFontkit(fontkit);fkOk=true}catch(e){console.error(e)}
  }
  const getFont=async(kind,b,i)=>{
    if(String(kind).startsWith('u:')){
      const f=fkOk?pickFont(String(kind).slice(2),b,i):null;
      if(f){
        try{
          const key='u'+f.id;
          if(!fonts[key]){
            if(!f.bytes&&f.fd)f.bytes=new Uint8Array(await (await f.fd.blob()).arrayBuffer());
            fonts[key]=await doc.embedFont(f.bytes,{subset:true});
          }
          return fonts[key];
        }catch(e){console.error(e)}
      }
      stat.fb++;kind='helv';
    }
    const nm=FN[kind||'helv'][(b?1:0)+(i?2:0)];
    return fonts[nm]||(fonts[nm]=await doc.embedFont(nm));
  };
  for(const a of S.annots){
    const pg=S.pages[a.n-1],page=doc.getPage(a.n-1);if(!pg||!page)continue;
    const vp=pg.vp1,R=vp.rotation||0;
    const P=(x,y)=>{const q=vp.convertToPdfPoint(x,y);return {x:q[0],y:q[1]}};
    const box=(x,y,w,h)=>{
      const p1=P(x,y),p2=P(x+w,y+h);
      return {x:Math.min(p1.x,p2.x),y:Math.min(p1.y,p2.y),width:Math.abs(p2.x-p1.x),height:Math.abs(p2.y-p1.y)};
    };
    const drawTxt=async()=>{
      const font=await getFont(a.kind,a.bold,a.italic);
      const lines=String(a.text||'').replace(/\r/g,'').replace(/\t/g,'    ').split('\n');
      const bo=baseOff(a.kind,a.bold,a.italic);
      for(let i=0;i<lines.length;i++){
        const s=encText(font,lines[i],stat);if(!s.trim())continue;
        const p=P(a.x,a.y+bo*a.size+i*1.2*a.size);
        page.drawText(s,{x:p.x,y:p.y,size:a.size,font,color:hexRgb(a.color),rotate:degrees(R)});
      }
    };
    if(a.type==='edit'){
      page.drawRectangle({...box(a.cx,a.cy,a.cw,a.ch),color:hexRgb(a.bg),borderWidth:0});
      await drawTxt();
    }else if(a.type==='text'){
      await drawTxt();
    }else if(a.type==='image'){
      const info=S.imgs[a.img];if(!info)continue;
      let im=imgs[a.img];
      if(!im)im=imgs[a.img]=info.type==='jpg'?await doc.embedJpg(info.bytes):await doc.embedPng(info.bytes);
      const bl=P(a.x,a.y+a.h);
      page.drawImage(im,{x:bl.x,y:bl.y,width:a.w,height:a.h,rotate:degrees(R)});
    }else if(a.type==='rect'){
      if(!a.fill&&!a.stroke)continue;
      const o={...box(a.x,a.y,a.w,a.h),borderWidth:0};
      if(a.fill)o.color=hexRgb(a.fill);
      if(a.stroke){o.borderColor=hexRgb(a.stroke);o.borderWidth=a.sw}
      page.drawRectangle(o);
    }else if(a.type==='hl'){
      const o={...box(a.x,a.y,a.w,a.h),color:hexRgb(a.color),borderWidth:0};
      if(PDFLib.BlendMode&&PDFLib.BlendMode.Multiply){o.blendMode=PDFLib.BlendMode.Multiply;o.opacity=0.85}
      else o.opacity=0.42;
      page.drawRectangle(o);
    }else if(a.type==='link'){
      const url=a.page!=null?'':normUrl(a.url);
      if(a.page==null&&!url)continue;
      const b=box(a.x,a.y,a.w,a.h),ctx=doc.context;
      const o={Type:'Annot',Subtype:'Link',Rect:[b.x,b.y,b.x+b.width,b.y+b.height],Border:[0,0,0],F:4};
      if(a.page!=null)o.Dest=[doc.getPage(clamp(a.page,1,doc.getPageCount())-1).ref,'Fit'];
      else o.A=ctx.obj({Type:'Action',S:'URI',URI:PDFLib.PDFString.of(url)});
      page.node.addAnnot(ctx.register(ctx.obj(o)));
    }else if(a.type==='note'){
      const b=box(a.x,a.y,NOTE_SIZE,NOTE_SIZE),ctx=doc.context,HS=PDFLib.PDFHexString;
      const o={Type:'Annot',Subtype:'Text',Rect:[b.x,b.y,b.x+b.width,b.y+b.height],Contents:HS.fromText(a.text||''),T:HS.fromText(a.author||''),
        M:PDFLib.PDFString.of(pdfDateStr(a.date)),Name:'Comment',C:[1,0.85,0.2],F:28,Open:false};
      page.node.addAnnot(ctx.register(ctx.obj(o)));
    }else if(a.type==='pen'){
      const pts=a.pts.map(p=>P(p[0],p[1]));
      if(pts.length===1)pts.push({x:pts[0].x+0.01,y:pts[0].y});
      for(let i=0;i<pts.length-1;i++)page.drawLine({start:pts[i],end:pts[i+1],thickness:a.w,color:hexRgb(a.color),lineCap:LineCapStyle.Round});
    }
  }
  if(stat.fb)toast('Une police ajoutée n\'a pas pu être incorporée : la police standard la plus proche a été utilisée.',5500);
  else if(stat.n)toast(stat.n+' caractère'+(stat.n>1?'s':'')+' non pris en charge par la police '+(stat.n>1?'ont':'a')+' été remplacé'+(stat.n>1?'s':'')+'. Ajoutez une police complète pour les conserver.',5500);
  return await doc.save();
}
async function savePdf(name){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Ce PDF est protégé par un mot de passe : il peut être lu, mais pas enregistré après modification.',5000);return}
  busy(true,'Préparation du fichier…');
  let bytes;
  try{bytes=await buildPdf()}
  catch(e){console.error(e);busy(false);toast('Impossible de générer le PDF : '+(e&&e.message||'erreur inconnue'),5000);return}
  busy(false);
  const blob=new Blob([bytes],{type:'application/pdf'});
  const base=name||S.saveName||(S.name.replace(/[\\/:*?"<>|]+/g,'-').replace(/-modifie$/,'')+'-modifie');
  /* a plain "Enregistrer" (no explicit new name) writes straight back into the file the document was
     opened from or last saved to - no dialog, no new name asked. "Enregistrer sous" is what picks one.
     Desktop app, most direct route: the backend already knows this file's real path (opened via the
     native dialog, a recent entry, "Ouvrir avec…" or a double-click) and writes straight to it. */
  if(!name&&DESKTOP&&S.fileToken){
    try{
      const r=await fetch('/api/savepath?token='+encodeURIComponent(S.fileToken),{method:'POST',headers:{'X-LetUs':'1'},body:blob});
      if(r.ok){S.dirty=false;renderTabs();toast('Fichier enregistré.');return}
      console.warn('L\'enregistrement direct a échoué (statut '+r.status+'), nouvelle tentative via un handle ou le dialogue.');
    }catch(e){console.warn('L\'enregistrement direct est indisponible, nouvelle tentative via un handle ou le dialogue.',e)}
  }
  if(!name&&S.fileHandle){
    try{
      let perm=await S.fileHandle.queryPermission({mode:'readwrite'});
      if(perm!=='granted')perm=await S.fileHandle.requestPermission({mode:'readwrite'});
      if(perm==='granted'){
        const wr=await S.fileHandle.createWritable();await wr.write(blob);await wr.close();
        S.dirty=false;renderTabs();toast('Fichier enregistré.');
        return;
      }
    }catch(e){console.warn('Écriture directe impossible, nouvelle tentative via le dialogue du système.',e)}
  }
  /* no handle yet for this document (opened via « Ouvrir avec… », un glisser-déposer, ou une vue sans
     accès direct au disque) : la première fois, on doit forcément demander où l'écrire - mais le handle
     obtenu est conservé, donc les enregistrements suivants de cette session n'auront plus à le redemander */
  if(!name&&window.showSaveFilePicker){
    try{
      const handle=await window.showSaveFilePicker({suggestedName:base+'.pdf',types:[{description:'Document PDF',accept:{'application/pdf':['.pdf']}}]});
      const wr=await handle.createWritable();await wr.write(blob);await wr.close();
      S.fileHandle=handle;S.fileToken=null;S.dirty=false;S.saveName=handle.name.replace(/\.pdf$/i,'');renderTabs();toast('Fichier enregistré.');
      return;
    }catch(e){
      if(e&&e.name==='AbortError')return;
      console.warn('showSaveFilePicker indisponible ici, retour au téléchargement classique.',e);
    }
  }
  if(!DL){toast('L\'enregistrement n\'est pas disponible dans cette vue.');return}
  try{
    await DL.save({filename:base+'.pdf',data:blob});
    S.dirty=false;S.saveName=base;renderTabs();toast('Fichier enregistré.');
  }catch(e){
    if(e&&e.code==='declined')return;
    if(e&&e.code==='rate_limited'){toast('Une demande d\'enregistrement est déjà ouverte.');return}
    console.error(e);toast('L\'enregistrement a échoué.');
  }
}

/* ---------- "Email" (Spécial menu): send the active PDF as an attachment ---------- */
async function emailActive(){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Ce PDF est protégé par un mot de passe : il peut être lu, mais pas réenregistré pour l\'envoyer.',5000);return}
  const base=S.saveName||(S.name.replace(/[\\/:*?"<>|]+/g,'-').replace(/-modifie$/,''));
  const filename=base+'.pdf';
  busy(true,'Préparation de l\'e-mail…');
  let bytes;
  try{bytes=await buildPdf()}
  catch(e){busy(false);console.error(e);toast('Impossible de générer le PDF : '+(e&&e.message||'erreur inconnue'),5000);return}
  busy(false);
  if(DESKTOP){
    /* the desktop app opens whatever mail client the computer has registered for e-mail messages,
       with the PDF already attached and the subject set to its name */
    try{
      const r=await fetch('/api/email?name='+encodeURIComponent(filename),{method:'POST',headers:{'X-LetUs':'1'},body:bytes});
      if(!r.ok)throw new Error('status '+r.status);
      toast('Le client e-mail s\'ouvre avec « '+filename+' » en pièce jointe.');
    }catch(e){console.error(e);toast('Impossible d\'ouvrir le client e-mail : '+(e&&e.message||'erreur inconnue'),5000)}
    return;
  }
  /* in the browser, a page can't attach a file to an e-mail by itself : download the PDF, then open a
     blank e-mail with the subject pre-filled so it's ready to attach */
  if(!DL){toast('L\'envoi par e-mail n\'est pas disponible dans cette vue.');return}
  try{
    await DL.save({filename,data:new Blob([bytes],{type:'application/pdf'})});
    if(DL.share)return; /* the share sheet already offers the mail app */
    window.open('mailto:?subject='+encodeURIComponent(base),'_blank');
    toast('« '+filename+' » téléchargé : joignez-le au brouillon qui vient de s\'ouvrir.',6000);
  }catch(e){
    if(e&&e.code==='declined')return;
    console.error(e);toast('L\'envoi par e-mail a échoué.');
  }
}

/* ---------- page operations ---------- */
/* Moving and deleting keep your annotations: they follow their pages. Rotating bakes them into the page. */
function moveOrder(n,sel,gap){
  const rest=[];for(let i=0;i<n;i++)if(!sel.includes(i))rest.push(i);
  const at=rest.filter(i=>i<gap).length;
  return rest.slice(0,at).concat(sel,rest.slice(at));
}
async function pageOp(kind,idxs,gap){
  if(!S.pdf)return;
  commitEdit();
  if(S.split)toggleSplit(false);
  if(S.enc){toast('Les PDF protégés par mot de passe ne peuvent pas être modifiés.',4500);return}
  const {PDFDocument,degrees}=PDFLib;
  const n=S.pages.length;
  const sel=(idxs&&idxs.length?[...idxs]:selIdx()).sort((a,b)=>a-b);
  let order=null,target=S.cur,newSel=null;
  if(kind==='del'){
    if(sel.length>=n){toast('Impossible de supprimer toutes les pages.');return}
    order=[];for(let i=0;i<n;i++)if(!sel.includes(i))order.push(i);
    target=Math.min(sel[0],order.length-1)+1;
  }else if(kind==='up'||kind==='down'||kind==='move'){
    let g=gap;
    if(kind==='up'){if(sel[0]<=0)return;g=sel[0]-1}
    else if(kind==='down'){if(sel[sel.length-1]>=n-1)return;g=Math.min(n,sel[sel.length-1]+2)}
    order=moveOrder(n,sel,g);
    if(order.every((v,i)=>v===i))return;
    const pos=new Map(order.map((o,i)=>[o,i]));
    newSel=sel.map(i=>pos.get(i));target=pos.get(sel[0])+1;
  }
  busy(true,'Application…');
  try{
    if(order){
      const src=await PDFDocument.load(S.bytes.slice(0));
      const out=await PDFDocument.create();
      const cps=await out.copyPages(src,order);cps.forEach(p=>out.addPage(p));
      const saved=await out.save();
      const pos=new Map(order.map((o,i)=>[o,i]));
      const ann=S.annots.filter(a=>pos.has(a.n-1)).map(a=>({...a,n:pos.get(a.n-1)+1}));
      await loadBytes(new Uint8Array(saved),null,target,ann);
      S.thSel=new Set(newSel||[target-1]);
    }else if(kind==='blank'){
      const at=sel[sel.length-1];
      const doc=await PDFDocument.load(S.bytes.slice(0));
      const p=doc.getPage(at),sz=p.getSize();
      const np=doc.insertPage(at+1,[sz.width,sz.height]);np.setRotation(p.getRotation());
      const saved=await doc.save();
      const ann=S.annots.map(a=>a.n>at+1?{...a,n:a.n+1}:a);
      await loadBytes(new Uint8Array(saved),null,at+2,ann);
      S.thSel=new Set([at+1]);
    }else if(kind==='rotl'||kind==='rotr'){
      const doc=await PDFDocument.load(await buildPdf());
      for(const i of sel){
        const p=doc.getPage(i);
        p.setRotation(degrees(((p.getRotation().angle+(kind==='rotr'?90:-90))%360+360)%360));
      }
      const saved=await doc.save();
      await loadBytes(new Uint8Array(saved),null,S.cur,[]);
      S.thSel=new Set(sel);
    }else return;
    S.dirty=true;paintThumbSel();syncUi();
  }catch(e){console.error(e);toast('Cette opération a échoué.')}
  finally{busy(false)}
}

/* ---------- fusion de PDF, copier / coller de pages entre onglets ---------- */
/* Inserts every page of another PDF (srcBytes) into the active document, so that the first inserted
   page ends up at 0-based index `at`. Annotations of the pages that get pushed down are renumbered. */
async function insertPagesFrom(srcBytes,at,verb){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Les PDF protégés par mot de passe ne peuvent pas être modifiés.',4500);return}
  if(S.split)toggleSplit(false);
  busy(true,'Fusion…');
  try{
    const {PDFDocument}=PDFLib;
    let src;
    try{src=await PDFDocument.load(srcBytes.slice(0))}
    catch(e){console.error(e);toast('Ce fichier n\'est pas un PDF valide, ou il est protégé par mot de passe.',5000);return}
    let liftedSrc=null;
    try{
      const tmp=await pdfjsLib.getDocument({data:srcBytes.slice(0),isEvalSupported:false}).promise;
      try{liftedSrc=await liftAnnots(tmp,srcBytes)}finally{try{await tmp.destroy()}catch(e){}}
      if(liftedSrc)src=await PDFDocument.load(liftedSrc.bytes.slice(0));
    }catch(e){console.error(e);liftedSrc=null}
    const k=src.getPageCount();
    if(!k){toast('Ce PDF ne contient aucune page.');return}
    const doc=await PDFDocument.load(S.bytes.slice(0));
    at=Math.max(0,Math.min(at,doc.getPageCount()));
    const cps=await doc.copyPages(src,src.getPageIndices());
    cps.forEach((p,j)=>doc.insertPage(at+j,p));
    const saved=await doc.save();
    const ann=S.annots.map(a=>a.n>at?{...a,n:a.n+k}:a);
    if(liftedSrc)for(const a of liftedSrc.annots)ann.push({...a,id:uid(),n:a.n+at});
    await loadBytes(new Uint8Array(saved),null,at+1,ann);
    S.thSel=new Set(Array.from({length:k},(_,j)=>at+j));
    S.dirty=true;paintThumbSel();syncUi();
    toast(k+' page'+(k>1?'s ':' ')+(verb||'ajoutée')+(k>1?'s':'')+'.',3000);
  }catch(e){console.error(e);toast('Cette opération a échoué.')}
  finally{busy(false)}
}
/* Standard "Ouvrir" dialog, but the chosen PDF is only read, never opened as a tab. */
async function pickPdfBytes(){
  if(DESKTOP){
    const j=await (await fetch('/api/pickopen',{cache:'no-store'})).json();
    if(j.cancelled)return null;
    if(!j.token){toast('Impossible d\'ouvrir ce fichier.');return null}
    return {name:j.name,bytes:new Uint8Array(await (await fetch('/api/file/'+j.token)).arrayBuffer())};
  }
  if(window.showOpenFilePicker){
    try{
      const [h]=await window.showOpenFilePicker({multiple:false,types:[{description:'Document PDF',accept:{'application/pdf':['.pdf']}}]});
      const f=await h.getFile();
      return {name:f.name,bytes:new Uint8Array(await f.arrayBuffer())};
    }catch(e){
      if(e&&e.name==='AbortError')return null;
      console.warn('showOpenFilePicker indisponible ici, retour à la boîte de dialogue classique.',e);
    }
  }
  return new Promise(res=>{
    const i=$('#fMerge');
    i.onchange=async()=>{const f=i.files[0];i.value='';res(f?{name:f.name,bytes:new Uint8Array(await f.arrayBuffer())}:null)};
    i.click();
  });
}
async function mergePdf(){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Les PDF protégés par mot de passe ne peuvent pas être modifiés.',4500);return}
  let f;
  try{f=await pickPdfBytes()}catch(e){console.error(e);toast('Impossible d\'ouvrir le sélecteur de fichier.');return}
  if(!f)return;
  if(!/pdf$/i.test(f.name)&&!(f.bytes[0]===0x25&&f.bytes[1]===0x50)){toast('Ce fichier n\'est pas un PDF.');return}
  await insertPagesFrom(f.bytes,S.pages.length,'ajoutée');
}
/* "Copier" keeps the selected pages (with their edits and annotations baked in) in memory, shared by all
   tabs; "Coller" inserts them after the selected page of whichever tab is active. */
async function copyPagesToClip(){
  if(!S.pdf)return;
  commitEdit();
  if(S.enc){toast('Les PDF protégés par mot de passe ne peuvent pas être copiés.',4500);return}
  const sel=selIdx();
  busy(true,'Copie…');
  try{
    const {PDFDocument}=PDFLib;
    const full=await PDFDocument.load(await buildPdf());
    const out=await PDFDocument.create();
    const cps=await out.copyPages(full,sel);cps.forEach(p=>out.addPage(p));
    pageClip={bytes:new Uint8Array(await out.save()),count:sel.length,from:S.name,pages:sel.map(i=>i+1)};
    syncUi();
    toast((sel.length>1?sel.length+' pages copiées':'Page '+(sel[0]+1)+' copiée')+'. Ouvrez l\'autre document puis cliquez sur « Coller ».',4000);
  }catch(e){console.error(e);toast('La copie a échoué.')}
  finally{busy(false)}
}
async function pastePages(){
  if(!S.pdf)return;
  if(!pageClip){toast('Aucune page copiée : utilisez d\'abord « Copier » sur une page.');return}
  const sel=selIdx();
  await insertPagesFrom(pageClip.bytes,sel[sel.length-1]+1,'collée');
}
$('#bMerge').onclick=()=>mergePdf();
$('#bCopyPg').onclick=()=>copyPagesToClip();
$('#bPastePg').onclick=()=>pastePages();

/* ---------- touch screens: pinch to zoom ---------- */
/* iOS Safari zooms the whole page on pinch (and on double-tap) whatever the viewport says: cancel it,
   the document is zoomed by the handler below and the bars never move */
for(const t of ['gesturestart','gesturechange','gestureend'])document.addEventListener(t,e=>e.preventDefault(),{passive:false});
document.addEventListener('touchmove',e=>{if(e.touches.length>1||(e.scale&&e.scale!==1))e.preventDefault()},{passive:false});
(function(){
  let d0=0,z0=1,on=false,fx=0,fy=0;
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)||1;
  const mid=t=>{const r=viewer.getBoundingClientRect();return[(t[0].clientX+t[1].clientX)/2-r.left,(t[0].clientY+t[1].clientY)/2-r.top]};
  /* the point of the document between the two fingers stays between them while zooming */
  viewer.addEventListener('touchstart',e=>{if(e.touches.length===2&&S.pages.length){
    d0=dist(e.touches);z0=S.zoom;on=true;
    const[ox,oy]=mid(e.touches);fx=(viewer.scrollLeft+ox)/(viewer.scrollWidth||1);fy=(viewer.scrollTop+oy)/(viewer.scrollHeight||1);
  }},{passive:true});
  viewer.addEventListener('touchmove',e=>{if(!on||e.touches.length!==2)return;e.preventDefault();
    setZoom(z0*dist(e.touches)/d0,true);
    const[ox,oy]=mid(e.touches);viewer.scrollLeft=fx*viewer.scrollWidth-ox;viewer.scrollTop=fy*viewer.scrollHeight-oy;
  },{passive:false});
  const end=e=>{if(e.touches.length<2)on=false};
  viewer.addEventListener('touchend',end,{passive:true});viewer.addEventListener('touchcancel',end,{passive:true});
})();

/* ---------- installable web app (PWA): offline, "open with / share to", install hint ---------- */
if(PWA){
  if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('service worker',e));
  /* Android: "Partager > Let Us PDF" posts the file to the service worker, which parks it in a cache and
     reloads the page with ?shared=N so it can be opened here */
  (async()=>{
    const m=/[?&]shared=(\d+)/.exec(location.search);if(!m)return;
    try{
      history.replaceState(null,'',location.pathname);
      const c=await caches.open('letuspdf-share');
      const keys=await c.keys();
      for(const rq of keys){
        const r=await c.match(rq);if(!r)continue;
        const name=decodeURIComponent(r.headers.get('X-Name')||'document.pdf');
        const b=await r.blob();await c.delete(rq);
        await tryOpen(new File([b],name,{type:'application/pdf'}));
      }
    }catch(e){console.error(e)}
  })();
  /* desktop / Android Chrome: PDF opened with the installed app */
  if('launchQueue' in window)launchQueue.setConsumer(async p=>{
    for(const h of (p&&p.files)||[]){try{await tryOpen(await h.getFile(),h)}catch(e){console.error(e)}}
  });
  /* iPhone app: PDF handed over by iOS ("Ouvrir avec", Fichiers, Mail…) */
  window.__nativeOpen=async(name,b64)=>{try{const b=await (await fetch('data:application/pdf;base64,'+b64)).blob();await tryOpen(new File([b],name||'document.pdf',{type:'application/pdf'}))}catch(e){console.error(e);toast('Impossible d\u2019ouvrir ce fichier.')}};
  /* iPhone / iPad: no install prompt exists, so show how once */
  try{
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    const standalone=navigator.standalone||(matchMedia&&matchMedia('(display-mode:standalone)').matches);
    if(ios&&!standalone&&!NATIVE&&!localStorage.getItem('letus-ios-hint')){
      const d=document.createElement('div');d.className='ioshint';
      d.innerHTML='<span>Pour installer : touchez <b>Partager</b> puis <b>Sur l’écran d’accueil</b>.</span><button class="btn">OK</button>';
      d.querySelector('button').onclick=()=>{d.remove();try{localStorage.setItem('letus-ios-hint','1')}catch(e){}};
      document.body.append(d);
    }
  }catch(e){}
}

/* ---------- phone layout: header, bottom tool bar and "Plus" sheet (installed web app, small touch screen) ---------- */
if(PWA){
  const APP_VER='v15';
  const root=document.documentElement,mq=matchMedia('(pointer:coarse) and (max-width:700px)');
  const setPhone=()=>root.classList.toggle('phone',mq.matches);
  setPhone();(mq.addEventListener?mq.addEventListener('change',setPhone):mq.addListener(setPhone));
  $$('#mhead [data-i],#mbar [data-i]').forEach(e=>{e.innerHTML=ICONS[e.dataset.i]||''});
  $('#mVer').textContent=APP_VER;
  /* iOS keyboard: it overlays the fixed layout, so lift floating panels above it */
  const vv=window.visualViewport;
  const isEd=e=>e&&(e.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName))&&!e.closest('#modal,#modal2,#modal3,#modal4,#msheet');
  const kbSync=()=>{
    const hh=$('#mhead').getBoundingClientRect().bottom;root.style.setProperty('--hh',Math.round(hh)+'px');const vt=vv?Math.max(0,vv.offsetTop):0;root.style.setProperty('--ptop',Math.round(Math.max(hh,vt)+6)+'px');
    const kb=vv?Math.max(0,Math.round(window.innerHeight-vv.height-vv.offsetTop)):0;
    root.style.setProperty('--kb',kb+'px');
    root.style.setProperty('--pbot',(kb>80?kb+56:70)+'px');
    root.classList.toggle('kb',kb>80||isEd(document.activeElement));
    if(window.scrollY)window.scrollTo(0,0);
  };
  if(vv){vv.addEventListener('resize',kbSync);vv.addEventListener('scroll',kbSync)}
  document.addEventListener('focusin',()=>{kbSync();setTimeout(()=>{kbSync();revealEdit()},450)});
  document.addEventListener('focusout',()=>setTimeout(kbSync,150));
  /* keep the text being edited visible between the floating tool panel (top) and the keyboard */
  /* floating "Aa" button + options panel: placed on the side opposite to the text being edited */
  const fmtEl=()=>{const a=document.activeElement;if(a&&a.isContentEditable)return a;return document.querySelector('#pages .a.sel,#pages .a-edit.sel')};
  function placeFmt(){
    const el=fmtEl(),top=vv?vv.offsetTop:0,h=vv?vv.height:innerHeight;
    let atTop=false;
    if(el){const r=el.getBoundingClientRect();atTop=(r.top+r.height/2)>(top+h/2)}
    root.classList.toggle('fmtTop',atTop);root.classList.toggle('fmtBot',!atTop);
  }
  function revealEdit(){
    const el=document.activeElement;if(!el||!el.isContentEditable)return;
    placeFmt();
    const pb=$('#propbar'),v=$('#viewer');
    let top=$('#mhead').getBoundingClientRect().bottom+10,bot=(vv?vv.offsetTop+vv.height:innerHeight)-60;
    if(root.classList.contains('fmt')){const r=pb.getBoundingClientRect();if(root.classList.contains('fmtTop'))top=Math.max(top,r.bottom+10);else bot=Math.min(bot,r.top-10)}
    const r=el.getBoundingClientRect();
    if(r.top<top)v.scrollTop-=top-r.top;else if(r.bottom>bot)v.scrollTop+=Math.min(r.bottom-bot,r.top-top);
    const sel=getSelection();
    if(sel.rangeCount){const cr=sel.getRangeAt(0).getClientRects()[0];const vr=v.getBoundingClientRect();
      if(cr&&cr.height){if(cr.left<vr.left+12)v.scrollLeft-=vr.left+12-cr.left;else if(cr.right>vr.right-12)v.scrollLeft+=cr.right-vr.right+12}}
  }
  const txSync=()=>{const pb=$('#propbar'),tx=!!pb.querySelector('[data-k="kind"]')&&!pb.hidden;root.classList.toggle('tx',tx);if(!tx)root.classList.remove('fmt');else if(!root.classList.contains('fmtTop')&&!root.classList.contains('fmtBot'))placeFmt()};
  new MutationObserver(txSync).observe($('#propbar'),{childList:true,attributes:true,attributeFilter:['hidden']});
  const fb=$('#mFmt');
  ['mousedown','pointerdown'].forEach(ev=>fb.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
  fb.onclick=()=>{const on=!root.classList.contains('fmt');if(on)placeFmt();root.classList.toggle('fmt',on);if(on)setTimeout(revealEdit,60)};
  kbSync();
  const q=sel=>document.querySelector(sel);
  const click=sel=>{const e=q(sel);if(e&&!e.disabled)e.click()};
  $('#mSave').onclick=()=>click('#bSave');
  $$('#mbar [data-mt]').forEach(b=>b.onclick=()=>click('[data-tool="'+b.dataset.mt+'"]'));
  /* sheet content: [icon, label, selector of the existing control, keep the sheet open] */
  const TABS={
    'Outils':[['search','Rechercher','#bSearch'],['undo','Annuler','#bUndo',1],['redo','Rétablir','#bRedo',1],['pen','Stylo','[data-tool="pen"]'],['hl','Surligner','[data-tool="hl"]'],['rect','Rectangle','[data-tool="rect"]'],['link','Lien','[data-tool="link"]'],['note','Note','[data-tool="note"]'],['shot','Capture','[data-tool="shot"]'],['font','Polices','#bFonts']],
    'Pages':[['blank','Page vide','#bBlank'],['rotl','Pivoter à gauche','#bRotL',1],['rotr','Pivoter à droite','#bRotR',1],['mvup','Monter','#bMvUp',1],['mvdn','Descendre','#bMvDn',1],['dup','Copier','#bCopyPg',1],['paste','Coller','#bPastePg'],['trash','Supprimer','#bDelPg'],['sidebar','Miniatures','#bThumbs']],
    'Fichier':[['open','Ouvrir un PDF','#bOpen2'],['merge','Fusionner','#bMerge'],['saveas','Enregistrer sous','#bSaveAs'],['special','Partager / envoyer','[data-sp="email"]'],['special','Invoice → CN','[data-sp="cn"]']],
    'Affichage':[]
  };
  let tab='Outils',sheetOpen=false;
  const sheet=$('#msheet');
  const close=()=>{sheet.hidden=true;sheetOpen=false};
  const toolOn=sel=>{const e=q(sel);return !!(e&&e.classList.contains('on'))};
  function drawSheet(){
    $('#mTabs').innerHTML=Object.keys(TABS).map(t=>'<button data-t="'+t+'"'+(t===tab?' class="on"':'')+'>'+t+'</button>').join('');
    const body=$('#mBody');
    if(tab==='Affichage'){
      body.innerHTML='<div class="mzoom"><button class="btn" id="zM" aria-label="Zoom arrière">'+ICONS.minus+'</button><span class="zl" id="zL"></span><button class="btn" id="zP" aria-label="Zoom avant">'+ICONS.plus+'</button></div>'
        +'<div class="mgrid"><button id="zFit">'+ICONS.doc+'Ajuster à la page</button></div>'
        +'<div class="mrow"><label for="mPg">Aller à la page</label><input class="inp num" id="mPg" inputmode="numeric" style="width:84px"><span class="lbl" id="mPgT"></span></div>'
        +'<div class="mrow"><label for="mTh">Thème</label><select class="inp" id="mTh"><option value="auto">Automatique</option><option value="light">Clair</option><option value="dark">Sombre</option></select></div>';
      $('#zM').onclick=()=>click('#bZout');$('#zP').onclick=()=>click('#bZin');
      $('#zFit').onclick=()=>{click('#bFitP')};
      const pg=$('#mPg');pg.value=$('#pgIn').value;$('#mPgT').textContent=$('#pgTot').textContent;
      pg.onchange=()=>{const t=$('#pgIn');t.value=pg.value;t.dispatchEvent(new Event('change',{bubbles:true}));t.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}))};
      const th=$('#mTh');th.value=$('#themeSel').value;th.onchange=()=>{const t=$('#themeSel');t.value=th.value;t.dispatchEvent(new Event('change',{bubbles:true}))};
      syncSheet();return;
    }
    body.innerHTML='<div class="mgrid">'+TABS[tab].map((it,i)=>'<button data-i2="'+i+'">'+(ICONS[it[0]]||'')+it[1]+'</button>').join('')+'</div>';
    syncSheet();
  }
  function syncSheet(){
    if(!sheetOpen)return;
    if(tab==='Affichage'){const z=$('#zL');if(z)z.textContent=$('#zLbl').textContent;return}
    $$('#mBody [data-i2]').forEach(b=>{
      const it=TABS[tab][+b.dataset.i2],e=q(it[2]);
      b.disabled=!e||e.disabled;b.classList.toggle('on',it[2].indexOf('data-tool')>0&&toolOn(it[2]));
    });
  }
  $('#mTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.t;drawSheet()});
  $('#mBody').addEventListener('click',e=>{
    const b=e.target.closest('[data-i2]');if(!b)return;
    const it=TABS[tab][+b.dataset.i2];if(!it[3])close();
    click(it[2]);setTimeout(syncSheet,80);
  });
  const open=t=>{tab=t||tab;sheetOpen=true;sheet.hidden=false;drawSheet()};
  $('#mMore').onclick=()=>open('Outils');
  /* home: a shortcut in the header to open another PDF (or switch / close the open documents) */
  const mh=$('#mHome');mh.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>';
  const home=document.createElement('div');home.id='mhome';home.hidden=true;document.body.append(home);
  const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function drawHome(){
    const items=S.tabs.map((t,i)=>{const d=i===S.ti?S:t.snap;return {i,name:d.name,dirty:d.dirty}});
    home.innerHTML='<h1>Let Us PDF</h1><p>Ouvrez un PDF pour le lire et le modifier. Rien n\u2019est envoy\u00e9 : tout reste sur votre appareil.</p>'
      +'<button class="btn primary big" id="hOpen">'+ICONS.open+'Choisir un PDF</button>'
      +(items.length?'<h2>Documents ouverts</h2>'+items.map(x=>'<div class="doc'+(x.i===S.ti?' on':'')+'"><button class="nm" data-s="'+x.i+'">'+esc(x.name)+(x.dirty?' \u2022':'')+'.pdf</button><button class="x" data-c="'+x.i+'" aria-label="Fermer ce document">\u00d7</button></div>').join(''):'')
      +(items.length?'<div class="back"><button class="btn big" id="hBack">Retour au document</button></div>':'');
  }
  const closeHome=()=>{home.hidden=true};
  const openHome=()=>{drawHome();home.hidden=false};
  mh.onclick=openHome;
  home.addEventListener('click',e=>{
    if(e.target.closest('#hBack')){closeHome();return}
    if(e.target.closest('#hOpen')){closeHome();$('#bOpen2').click();return}
    const s=e.target.closest('[data-s]');if(s){switchTab(+s.dataset.s);closeHome();return}
    const c=e.target.closest('[data-c]');if(c){closeTab(+c.dataset.c).then(()=>{if(!S.pdf)closeHome();else drawHome()});return}
  });
  $('#mTitleBtn').onclick=()=>open('Pages');$('#mPgBtn').onclick=()=>open('Affichage');
  sheet.querySelector('.mback').onclick=close;
  /* swipe the sheet down to close */
  let y0=null;const pnl=sheet.querySelector('.mpanel');
  pnl.addEventListener('touchstart',e=>{if(e.target.closest('#mBody')&&$('#mBody').scrollTop>0)return;y0=e.touches[0].clientY},{passive:true});
  pnl.addEventListener('touchend',e=>{if(y0!==null&&e.changedTouches[0].clientY-y0>70)close();y0=null},{passive:true});
  /* keep header / bar in step with the (hidden) desktop controls */
  setInterval(()=>{
    if(!root.classList.contains('phone'))return;
    const on=t=>toolOn('[data-tool="'+t+'"]');
    $$('#mbar [data-mt]').forEach(b=>b.classList.toggle('on',on(b.dataset.mt)));
    const more=!['sel','edit','text','image'].some(on);$('#mMore').classList.toggle('on',more||sheetOpen);
    for(const [a,b2] of [['#mSave','#bSave']])q(a).disabled=!!q(b2).disabled;
    const tx=!!q('#propbar [data-k="kind"]')&&!q('#propbar').hidden;root.classList.toggle('tx',tx);if(!tx)root.classList.remove('fmt');else if(!root.classList.contains('fmtTop')&&!root.classList.contains('fmtBot'))placeFmt();
    const has=S.pdf;mh.hidden=!has;if(!has&&!home.hidden)closeHome();
    $('#mTitle').textContent=has?(S.name||'Document')+(S.dirty?' •':''):'Let Us PDF';
    $('#mSub').textContent=has?$('#pgIn').value+' '+$('#pgTot').textContent:'—';
    syncSheet();
  },250);
}
})();
