import {chromium,expect} from '@playwright/test';
const b=await chromium.launch();
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000');await expect(p.locator('header a[href="/rosters"]')).toHaveCount(0);
 await p.locator('.hero-roster-link').click();await expect(p).toHaveURL(/#roster$/);
 await expect(p.getByRole('tab',{name:'MAIN',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(5);
 for(const n of ['GASTON','KOKOSIC147','MAFIN','OVERFLOD','UKKIS'])await expect(p.getByRole('heading',{name:n,exact:true})).toBeVisible();
 const grid=await p.locator('.roster-slide[aria-hidden="false"] .roster-gallery').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);expect(grid).toBe(width===390?2:3);
 await p.getByRole('tab',{name:'ACADEMY',exact:true}).click();await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(3);
 for(const n of ['SV1NTUZZ','MATV1K','VANYA'])await expect(p.getByRole('heading',{name:n,exact:true})).toBeVisible();
 await p.locator('a[href="/rosters/sv1ntuzz"]').click();await p.waitForURL('**/rosters/sv1ntuzz');await expect(p.locator('h1')).toHaveText('SV1NTUZZ');
 await p.locator('.back-link').click();await p.waitForURL('**/#academy');await expect(p.getByRole('tab',{name:'ACADEMY',exact:true})).toHaveAttribute('aria-selected','true');await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(3);
 await p.getByRole('tab',{name:'MAIN',exact:true}).click();await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(5);
 await p.getByRole('tab',{name:'MAIN',exact:true}).focus();await p.keyboard.press('ArrowRight');await expect(p.getByRole('tab',{name:'ACADEMY',exact:true})).toBeFocused();await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(3);
 await p.reload();await expect(p.getByRole('tab',{name:'ACADEMY',exact:true})).toHaveAttribute('aria-selected','true');
 await p.goto('http://localhost:3000/rosters');await p.waitForURL('**/#roster');await expect(p.locator('h1')).toHaveText('ROOSTERZ');await expect(p.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(5);
 await p.evaluate(()=>document.fonts.ready);expect(await p.locator('.roster-slide[aria-hidden="false"] .portrait-caption h2').first().evaluate(e=>getComputedStyle(e).fontFamily)).toBe('Luckies');
 expect(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);expect(errors).toEqual([]);
 console.log('PASS',width,'home gallery, tabs, keyboard, profile return, reload, redirect, font, overflow');
 if(width===1440){await p.locator('#roster').scrollIntoViewIfNeeded();await p.waitForTimeout(1600);await p.screenshot({path:'/home/user/home-roster-transferred.png'});}
 await p.close();
}
await b.close();
