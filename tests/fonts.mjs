import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();const names=['gaston','kokosic147','mafin','overflod','ukkis','sv1ntuzz','matv1k','vanya'];
const paths=['/','/matches','/about','/contact',...names.map(n=>'/rosters/'+n)];const actual=new Set();
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const client=await page.context().newCDPSession(page);await client.send('DOM.enable');await client.send('CSS.enable');
 for(const path of paths){
  await page.goto('http://localhost:3000'+path);await page.evaluate(()=>document.fonts.ready);
  const {root}=await client.send('DOM.getDocument',{depth:-1});const {nodeIds}=await client.send('DOM.querySelectorAll',{nodeId:root.nodeId,selector:'body *'});
  for(const nodeId of nodeIds){const {fonts}=await client.send('CSS.getPlatformFontsForNode',{nodeId});for(const f of fonts){if(!f.glyphCount)continue;actual.add(f.familyName);if(!f.isCustomFont||!['ONY Track UltraCondensed Black','Luckies'].includes(f.familyName))throw Error('Fallback font '+JSON.stringify(f)+' '+path);}}
  expect(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily)).toBe(path==='/'||path.startsWith('/rosters/')?'Luckies':'"ONY Track"');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width+path);
  console.log('Fonts PASS',width,path);
 }
 await page.close();
}
await browser.close();expect(actual.size).toBe(2);console.log('Actual fonts:',[...actual]);
