/* Public portfolio: database content only; the original page is a fallback. */
(() => {
 'use strict';
 const script=document.currentScript;
 if(!script)return;
 const templateUrl=new URL('index.html',script.src).href;
 const base="https://vbtnshafykocfootqvaz.supabase.co", apiKey="sb_publishable_6NrjWh41zcaG1FZIZ-5feg_dFBEa49G";
 const keys=['PUBLIC_BRANDS','PUBLIC_SITE_LINKS','PUBLIC_POSTS','PUBLIC_CASES','PUBLIC_TESTIMONIALS','PUBLIC_HEADING_EDITS','PUBLIC_EXTRA_PROJECT_LINKS','PUBLIC_COPYWRITING','PUBLIC_VIDEOS','PUBLIC_THEME','PUBLIC_LOCALIZED_TITLES','PUBLIC_PF_SERVICES','PUBLIC_PF_SERVICE_INTRO','PUBLIC_PF_ABOUT','PUBLIC_PF_LAYOUT','PUBLIC_PF_LIVE_TEXT'];
 function assignment(page,k){const m=new RegExp('window\\.'+k+'\\s*=\\s*').exec(page);if(!m)throw Error('Missing '+k);let a=m.index+m[0].length,d=0,q=false,e=false;for(let i=a;i<page.length;i++){const c=page[i];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='['||c==='{')d++;else if(c===']'||c==='}')if(--d===0)return {start:a,end:i+1,value:JSON.parse(page.slice(a,i+1))}}throw Error('Invalid '+k)}
 function merge(page,data){for(const k of keys){if(!Object.prototype.hasOwnProperty.call(data,k))continue;const a=assignment(page,k),v=data[k];if(v===null||typeof v!==typeof a.value||Array.isArray(v)!==Array.isArray(a.value))continue;const json=JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');page=page.slice(0,a.start)+json+page.slice(a.end)}return page.replace(/<script src="portfolio-sync\.js" defer><\/script>/g,'')}
 async function init(){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);
  try{const r=await fetch(base+'/rest/v1/portfolio_content?id=eq.1&select=revision,data',{headers:{apikey:apiKey},cache:'no-store',signal:controller.signal});if(!r.ok)return;const rows=await r.json(),row=rows?.[0];if(!(Number(row?.revision)>0)||!row.data||typeof row.data!=='object'||Array.isArray(row.data))return;
  const t=await fetch(templateUrl,{cache:'no-store',signal:controller.signal});if(!t.ok)return;const html=merge(await t.text(),row.data);
  if(!html.startsWith('<!DOCTYPE html>')||!html.endsWith('</html>')||html.includes('<script src="portfolio-sync.js" defer>'))return;
  document.open();document.write(html);document.close();
  }catch(e){console.warn('Portfolio: using bundled content.',e?.message||'sync unavailable')}finally{clearTimeout(timer)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
