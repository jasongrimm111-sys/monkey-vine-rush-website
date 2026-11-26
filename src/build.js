// Builds the site in every language the app speaks.
//   node src/build.js
// English goes at the root (/, /support/, /privacy/); every other language under its code (/es/, /es/support/, ...).
// Each page is a template in src/ whose {{keys}} are filled from src/i18n/<lang>.json, falling back to English.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SITE = 'https://monkeyvinerush.com';
const LANGS = { en:'English', es:'Español', fr:'Français', de:'Deutsch', pt:'Português', it:'Italiano', nl:'Nederlands', pl:'Polski', sv:'Svenska',
  ru:'Русский', zh:'简体中文', ja:'日本語', ko:'한국어', 'zh-TW':'繁體中文', tr:'Türkçe', id:'Bahasa Indonesia' };
const HTML_LANG = { zh:'zh-Hans', 'zh-TW':'zh-Hant' };
// Google Analytics (G-2M1YFDZQH2) only loads once the visitor accepts cookies; until then nothing is set and nothing is sent.
// The choice is kept in localStorage as mvr-consent ('yes' or 'no'). Rejecting after accepting deletes the _ga cookies and reloads.
const GA_ID = 'G-2M1YFDZQH2';
const CONSENT_HEAD = `<script>(()=>{const ID='${GA_ID}',K='mvr-consent';window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
let c=null;try{c=localStorage.getItem(K);}catch(e){}
const load=()=>{if(window.__mvrGA)return;window.__mvrGA=1;gtag('consent','update',{analytics_storage:'granted'});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(s);gtag('js',new Date());gtag('config',ID);};
const wipe=()=>{for(const n of document.cookie.split(';').map(x=>x.split('=')[0].trim()))if(/^_ga/.test(n))for(const d of ['',location.hostname,'.'+location.hostname.replace(/^www\\./,'')])document.cookie=n+'=; Max-Age=0; path=/'+(d?'; domain='+d:'');};
window.mvrConsent={get:()=>{try{return localStorage.getItem(K);}catch(e){return null;}},set:v=>{const was=window.mvrConsent.get();try{localStorage.setItem(K,v);}catch(e){}if(v==='yes')load();else{wipe();if(was==='yes'&&window.__mvrGA)location.reload();}}};
if(c==='yes')load();})();</script>`;
const consentBanner = t => `<div class="ckbar" id="ckBar" role="dialog" aria-live="polite" aria-label="${t('footer_cookies')}" hidden>
  <p>${t('ck_text')} <a href="{{base}}cookies/">${t('ck_more')}</a></p>
  <div class="ckbtns"><button type="button" class="ckb ghost" data-ck="no">${t('ck_reject')}</button><button type="button" class="ckb" data-ck="yes">${t('ck_accept')}</button></div>
</div>
<style>.ckbar{position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;width:min(720px,calc(100% - 24px));display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px;padding:16px 18px;border-radius:20px;background:rgba(6,23,15,.96);border:1.5px solid rgba(255,210,63,.55);box-shadow:0 18px 50px rgba(0,0,0,.5);color:#eaf7ee;font-family:'Fredoka',system-ui,sans-serif;font-size:16px;line-height:1.45}
.ckbar[hidden]{display:none}.ckbar p{margin:0;flex:1 1 300px}.ckbar a{color:#ffd23f;font-weight:600}.ckbtns{display:flex;gap:10px;flex:0 0 auto;margin-left:auto}
.ckb{font:inherit;font-weight:700;font-size:1rem;background:#ffd23f;color:#3a2210;border:0;border-radius:999px;padding:10px 22px;cursor:pointer;box-shadow:0 4px 0 #c48a12}
.ckb.ghost{background:transparent;color:#eaf7ee;box-shadow:none;border:1.5px solid rgba(255,255,255,.4)}.cklink{all:unset;cursor:pointer;color:inherit;font-weight:600;text-decoration:underline;text-underline-offset:3px}
@media (max-width:520px){.ckbtns{width:100%}.ckb{flex:1}}</style>
<script>(()=>{const bar=document.getElementById('ckBar'),now=document.getElementById('ckNow'),C=window.mvrConsent;if(!bar||!C)return;
const sync=()=>{if(now){const v=C.get();now.textContent=v==='yes'?now.dataset.yes:v==='no'?now.dataset.no:now.dataset.none;}};
if(!C.get())bar.hidden=false;sync();
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ck]');if(b){C.set(b.dataset.ck);bar.hidden=true;sync();return;}
if(e.target.closest&&e.target.closest('#ckOpen')){e.preventDefault();bar.hidden=false;bar.querySelector('[data-ck="yes"]').focus();}});})();</script>`;
const PAGES = [['home.html', ''], ['support.html', 'support/'], ['privacy.html', 'privacy/'], ['cookies.html', 'cookies/'], ['terms.html', 'terms/']];
const EN_ONLY = new Set(['terms.html']);   // in English only, so other languages link to it in English
// The game's fonts (Lilita One, Fredoka) only cover Latin letters, so these languages get a matching chunky font of their own
const SCRIPT_FONTS = {
  ja:{ css:'M+PLUS+Rounded+1c:wght@500;800', display:"'M PLUS Rounded 1c'", body:"'M PLUS Rounded 1c'" },
  ko:{ css:'Jua&family=Gothic+A1:wght@500;700', display:"'Jua'", body:"'Gothic A1'" },
  zh:{ css:'Noto+Sans+SC:wght@500;900', display:"'Noto Sans SC'", body:"'Noto Sans SC'" },
  'zh-TW':{ css:'Noto+Sans+TC:wght@500;900', display:"'Noto Sans TC'", body:"'Noto Sans TC'" },
  ru:{ css:'Rubik:wght@500;800', display:"'Rubik'", body:"'Rubik'" },
};
const EN = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'en.json'), 'utf8'));
const base = l => l === 'en' ? '/' : `/${l}/`;
let missing = 0;

const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;   // e.g. ONLY=en to build one language while working
for (const lang of Object.keys(LANGS)){
  if (ONLY && !ONLY.includes(lang)) continue;
  const file = path.join(__dirname, 'i18n', lang + '.json');
  const T = lang === 'en' ? EN : JSON.parse(fs.readFileSync(file, 'utf8'));
  const t = k => { if (T[k] != null) return T[k]; if (EN[k] == null) throw new Error(`no English text for "${k}"`); if (lang !== 'en'){ missing++; console.warn(`  ${lang}: missing "${k}"`); } return EN[k]; };
  for (const [tpl, rel] of PAGES){
    if (EN_ONLY.has(tpl) && lang !== 'en') continue;
    const relFor = l => EN_ONLY.has(tpl) && l !== 'en' ? '' : rel;
    const pageName = tpl.replace('.html', '');
    const url = l => SITE + base(l) + rel;
    const parts = {
      htmlLang: HTML_LANG[lang] || lang, base:base(lang), canonical:url(lang),
      num_1200: new Intl.NumberFormat(HTML_LANG[lang] || lang).format(1200),
      hreflang: Object.keys(LANGS).map(l => `<link rel="alternate" hreflang="${HTML_LANG[l] || l}" href="${url(l)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${url('en')}">`,
      // first visit to an English page: go to the visitor's own language if the site has it (their own choice always wins)
      autoLang: lang !== 'en' ? '' : `<script>(()=>{try{if(localStorage.getItem('mvr-lang'))return;const L=${JSON.stringify(Object.keys(LANGS).filter(l => l !== 'en' && l !== 'zh-TW'))};for(const x of (navigator.languages||[navigator.language||'']).map(s=>String(s).toLowerCase())){let m=null;if(/^zh-(tw|hk|mo|hant)/.test(x))m='zh-TW';else{const b=x.split('-')[0];if(b==='en')return;if(L.includes(b))m=b;}if(m){location.replace('/'+m+location.pathname+location.hash);return;}}}catch(e){}})()</script>`,
      langMenu: `<details class="lang"><summary aria-label="${t('lang_label')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>${lang === 'zh-TW' ? '繁中' : lang.toUpperCase()}</summary><ul>`
        + Object.entries(LANGS).map(([l, n]) => `<li><a href="${base(l) + relFor(l)}" hreflang="${HTML_LANG[l] || l}" lang="${HTML_LANG[l] || l}" data-lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${n}</a></li>`).join('') + `</ul></details>`,
      // remembers a chosen language, and opens/closes the phone menu
      langScript: `<script>(()=>{document.querySelectorAll('[data-lang]').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('mvr-lang',a.dataset.lang)}catch(e){}}));const top=document.getElementById('top'),btn=document.getElementById('menuBtn'),set=o=>{top.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));};btn.addEventListener('click',e=>{e.stopPropagation();set(!top.classList.contains('open'));});document.querySelectorAll('#mainNav > a').forEach(a=>a.addEventListener('click',()=>set(false)));addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});addEventListener('resize',()=>{if(innerWidth>760)set(false);});document.addEventListener('click',e=>{const d=document.querySelector('.lang[open]');if(d&&!d.contains(e.target)&&innerWidth>760)d.open=false;if(top.classList.contains('open')&&!top.contains(e.target))set(false);});})()</script>`,
      // Google Play badge next to the App Store one (user, 2026-11-08: show both stores as live)
      googlePlay: `<a class="badge-link" href="https://play.google.com/store/apps/details?id=com.grimmittgames.vinerush"><img src="/img/google-play-badge.png" alt="${t('badge_play_alt')}" width="208" height="62"></a>`,
      // the top bar: logo, links (a drop-down panel behind the menu button on phones), language picker, App Store badge
      pageHeader: `<header class="top" id="top">
  <div class="wrap">
    <a class="brand" href="${base(lang)}"${pageName === 'home' ? ' id="homeLink"' : ''}><img src="/img/logo-120.png" alt="" width="50" height="53"><span>Monkey <b>Vine Rush</b></span></a>
    <nav id="mainNav" aria-label="${t('nav_label')}">
      <a href="${base(lang)}"${pageName === 'home' ? ' class="jsHome" aria-current="page"' : ''}>${t('nav_home')}</a>
      <a href="${pageName === 'home' ? '' : base(lang)}#features">${t('nav_features')}</a>
      <a href="${base(lang)}support/"${pageName === 'support' ? ' aria-current="page"' : ''}>${t('nav_support')}</a>
      <a href="${base(lang)}privacy/"${pageName === 'privacy' ? ' aria-current="page"' : ''}>${t('nav_privacy')}</a>
      {{langMenu}}
    </nav>
    <a class="badge-link sm hdr-badge" href="https://apps.apple.com/app/id6825472830"><img src="/img/app-store-badge.svg" alt="${t('badge_alt')}" width="132" height="44"></a>
    <a class="badge-link sm hdr-badge hdr-play" href="https://play.google.com/store/apps/details?id=com.grimmittgames.vinerush" hidden><img src="/img/google-play-badge.png" alt="${t('badge_play_alt')}" width="148" height="44"></a>
    <script>(()=>{const u=navigator.userAgent,an=/Android/i.test(u),ios=/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1),[ap,gp]=document.querySelectorAll('.hdr-badge');if(!ap||!gp)return;if(an){ap.hidden=true;gp.hidden=false}else if(!ios){gp.hidden=false;gp.classList.add('dual')}})()</script>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mainNav" aria-label="${t('menu')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path class="l1" d="M4 7h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 17h16"/></svg></button>
  </div>
</header>`,
      footer: `<footer>
  <div class="wrap">
    <div class="studio"><img src="/img/icon-96.png" alt="" width="40" height="40" style="border-radius:10px"><div><a class="studio-link" href="https://www.grimmittgames.com/">Grimmitt Games</a><small>${t('footer_makers')}</small></div></div>
    <div class="links">
      <a href="${base(lang)}"${pageName === 'home' ? ' aria-current="page"' : ''}>${t('nav_home')}</a>
      <a href="${base(lang)}support/"${pageName === 'support' ? ' aria-current="page"' : ''}>${t('nav_support')}</a>
      <a href="${base(lang)}privacy/"${pageName === 'privacy' ? ' aria-current="page"' : ''}>${t('footer_privacy')}</a>
      <a href="${base(lang)}cookies/"${pageName === 'cookies' ? ' aria-current="page"' : ''}>${t('footer_cookies')}</a>
      <a href="/terms/"${pageName === 'terms' ? ' aria-current="page"' : ''}>${t('footer_terms')}</a>
      <button type="button" class="cklink" id="ckOpen">${t('ck_settings')}</button>
      <a href="https://apps.apple.com/app/id6825472830">App Store</a>
      <a href="https://play.google.com/store/apps/details?id=com.grimmittgames.vinerush">Google Play</a>
    </div>
    <p class="social"><span>${t('footer_follow')}</span><a href="https://www.tiktok.com/@monkey.vine.rush" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a><a href="https://www.youtube.com/@MonkeyVineRush" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg></a><a href="https://www.instagram.com/monkeyvinerush/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg></a><a href="https://www.facebook.com/122110616157516891" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg></a><a href="https://x.com/MonkeyVineRush" target="_blank" rel="noopener" aria-label="X" title="X"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a></p>
    <p class="langs" aria-label="${t('lang_label')}">${Object.entries(LANGS).map(([l, n]) => `<a href="${base(l) + relFor(l)}" hreflang="${HTML_LANG[l] || l}" lang="${HTML_LANG[l] || l}" data-lang="${l}"${l === lang ? ' aria-current="true"' : ''}>${n}</a>`).join('')}</p>
    <p class="legal">© 2026 <a class="studio-link" href="https://www.grimmittgames.com/">Grimmitt Games</a>. ${t('legal')}</p>
  </div>
</footer>`,
      copyScript: `<script>
document.getElementById('copyEmail').addEventListener('click', e => {
  const b = e.currentTarget, addr = document.getElementById('email').textContent, status = document.getElementById('copyStatus');
  const pick = () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('email')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); status.textContent = b.dataset.selected; };
  try { navigator.clipboard.writeText(addr).then(() => { status.textContent = b.dataset.copied; }, pick); } catch (err) { pick(); }
});
</script>`,
      scriptFont: !SCRIPT_FONTS[lang] ? '' : `<link href="https://fonts.googleapis.com/css2?family=${SCRIPT_FONTS[lang].css}&display=swap" rel="stylesheet">
<style>:root{--display:${SCRIPT_FONTS[lang].display},'Lilita One',sans-serif;--body:${SCRIPT_FONTS[lang].body},'Fredoka',system-ui,sans-serif}h1,h2,h3,.stat b,.final h2,.side b,.brand,.soon,.chip,summary{font-weight:${lang === 'ko' ? 400 : 800}}body{font-weight:500}</style>`,
      transNote: lang === 'en' ? '' : `<p class="note">${t(pageName === 'cookies' ? 'c_trans_note' : 'trans_note')}</p>`,
    };
    let html = fs.readFileSync(path.join(__dirname, tpl), 'utf8');
    // fill in parts (which may hold {{keys}} themselves), then strings, then any {{base}} the strings carry
    html = html.replace('</head>', () => CONSENT_HEAD + '\n</head>').replace(/<\/body>(?![\s\S]*<\/body>)/, () => consentBanner(t) + '\n</body>');
    for (let pass = 0; pass < 3; pass++) html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => k in parts ? parts[k] : t(k));
    if (/\{\{\w+\}\}/.test(html)) throw new Error(`${lang}/${tpl}: unfilled ${html.match(/\{\{\w+\}\}/)[0]}`);
    const out = path.join(ROOT, base(lang).slice(1), rel, 'index.html');
    fs.mkdirSync(path.dirname(out), { recursive:true }); fs.writeFileSync(out, html);
  }
}
// a sitemap so search engines find every language
const urls = Object.keys(LANGS).flatMap(l => PAGES.filter(([tpl]) => l === 'en' || !EN_ONLY.has(tpl)).map(([, rel]) => SITE + base(l) + rel));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`built ${ONLY ? ONLY.length : Object.keys(LANGS).length} languages × ${PAGES.length} pages${missing ? `, ${missing} strings fell back to English` : ''}`);
