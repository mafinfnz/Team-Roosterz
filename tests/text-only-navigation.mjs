import {chromium,expect} from '@playwright/test';
const b=await chromium.launch();
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000/matches');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1400);
 if(width===390)await p.getByRole('button',{name:'Открыть меню'}).click();
 await p.locator('header nav').getByRole('link',{name:'Контакты',exact:true}).click();await p.waitForTimeout(150);
 const out=await p.evaluate(()=>({textY:new DOMMatrix(getComputedStyle(document.querySelector('h1 .text-motion')).transform).m42,main:getComputedStyle(document.querySelector('main')).transform,header:getComputedStyle(document.querySelector('header')).transform,footer:getComputedStyle(document.querySelector('footer')).transform,opacity:getComputedStyle(document.querySelector('h1 .text-motion')).opacity}));
 expect(out.textY).toBeLessThan(0);expect(out.main).toBe('none');expect(out.header).toBe('none');expect(out.footer).toBe('none');expect(out.opacity).toBe('1');
 await p.waitForURL('**/contact');await p.waitForTimeout(120);expect(await p.locator('h1 .text-motion').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m42)).toBeGreaterThan(0);
 await expect.poll(()=>p.evaluate(()=>document.documentElement.dataset.routeSwap||'idle')).toBe('idle');await expect(p.locator('h1')).toHaveText('Контакты');await expect(p.locator('[data-text-window]')).toHaveCount(0);
 if(width===390)await p.getByRole('button',{name:'Открыть меню'}).click();await p.locator('header nav').getByRole('link',{name:'О клубе',exact:true}).click();await p.waitForURL('**/about');await expect.poll(()=>p.evaluate(()=>document.documentElement.dataset.routeSwap||'idle')).toBe('idle');await expect(p.locator('h1')).toHaveText('О клубе');
 expect(errors).toEqual([]);console.log('PASS',width,'only text moves: OUT up, IN from below; all page containers stationary');await p.close();
}
await b.close();
