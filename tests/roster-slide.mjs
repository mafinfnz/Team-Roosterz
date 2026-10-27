import {chromium,expect} from '@playwright/test';
const b=await chromium.launch();
const ssr=await b.newPage({javaScriptEnabled:false});await ssr.goto('http://localhost:3000');await expect(ssr.locator('[role="tabpanel"]')).toHaveCount(1);await expect(ssr.locator('.portrait-card')).toHaveCount(5);await ssr.close();
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:3000');await p.evaluate(()=>document.fonts.ready);
 await expect(p.locator('.roster-viewport')).toHaveAttribute('data-measured','true');
 await expect.poll(()=>p.locator('.roster-viewport').evaluate(e=>Math.abs(e.getBoundingClientRect().height-document.querySelector('#roster-panel-0').getBoundingClientRect().height)<2)).toBe(true);
 const clipped=await p.evaluate(()=>{const v=document.querySelector('.roster-viewport').getBoundingClientRect();const a=document.querySelector('#roster-panel-1').getBoundingClientRect();return a.top>=v.bottom-1});expect(clipped).toBe(true);
 await p.locator('#roster').scrollIntoViewIfNeeded();await p.getByRole('tab',{name:'ACADEMY',exact:true}).click();await p.waitForTimeout(250);
 const mid=await p.locator('.roster-track').evaluate(e=>({y:new DOMMatrix(getComputedStyle(e).transform).m42,opacity:getComputedStyle(e).opacity}));expect(mid.y).toBeLessThan(0);expect(mid.opacity).toBe('1');
 await expect.poll(()=>p.locator('.roster-track').evaluate(e=>Math.round(new DOMMatrix(getComputedStyle(e).transform).m42))).toBe(-Math.round(await p.locator('#roster-panel-0').evaluate(e=>e.offsetHeight)));
 await p.getByRole('tab',{name:'MAIN',exact:true}).click();await expect.poll(()=>p.locator('.roster-track').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42)).toBe(0);
 expect(await p.locator('.tabs').evaluate(e=>getComputedStyle(e).borderBottomWidth)).toBe('0px');expect(errors).toEqual([]);
 console.log('PASS',width,'SSR one roster; clipped first frame; vertical swap; no opacity change');await p.close();
}
await b.close();
