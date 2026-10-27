import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();
const raw=await browser.newPage({javaScriptEnabled:false});await raw.goto('http://localhost:3000');await expect(raw.locator('[role="tabpanel"]')).toHaveCount(1);await expect(raw.locator('.portrait-card')).toHaveCount(5);await expect(raw.locator('#roster-panel-1')).toHaveCount(0);await raw.close();console.log('PASS SSR and first paint: only MAIN exists');
for(const width of [390,1440]){
 const p=await browser.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000');await expect(p.locator('#roster-panel-0')).toHaveAttribute('aria-hidden','false');
 await p.locator('#roster').scrollIntoViewIfNeeded();await p.getByRole('tab',{name:'ACADEMY',exact:true}).click();await expect(p.locator('#roster-panel-1')).toHaveAttribute('aria-hidden','false');await p.getByRole('tab',{name:'MAIN',exact:true}).click();await expect(p.locator('#roster-panel-0')).toHaveAttribute('aria-hidden','false');
 for(const selector of ['.header','.tabs','.quiet-footer','.hero-grid']){const borders=await p.locator(selector).evaluate(e=>['borderTopWidth','borderBottomWidth','borderLeftWidth','borderRightWidth'].map(k=>getComputedStyle(e)[k]));expect(borders.every(b=>b==='0px')).toBe(true)}
 for(const [label,path] of [['Матчи','/matches'],['О клубе','/about'],['Контакты','/contact']]){
  if(width===390)await p.getByRole('button',{name:'Открыть меню'}).click();await p.locator('header nav').getByRole('link',{name:label,exact:true}).click();await p.waitForURL('http://localhost:3000'+path);await expect.poll(()=>p.evaluate(()=>document.documentElement.dataset.routeSwap||'idle')).toBe('idle');await expect(p.locator('h1')).toHaveText(label);await expect(p.locator('main')).toHaveCSS('transform','none');
 }
 expect(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);expect(errors).toEqual([]);
 console.log('PASS',width,'local OUT/IN, no duplicate panel, no moving page, sentence-case titles, no lines');await p.close();
}
const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://localhost:3000/#academy');await expect(reduced.locator('#roster-panel-1')).toHaveCount(1);await expect(reduced.locator('#roster-panel-1 .portrait-card')).toHaveCount(3);await reduced.close();await browser.close();
