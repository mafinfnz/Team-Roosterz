import {chromium,expect} from '@playwright/test';
const b=await chromium.launch();
for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3000');await p.evaluate(()=>document.fonts.ready);
 await expect(p.locator('h1')).toHaveText('ROOSTERZ');await expect(p.locator('.type-letter')).toHaveCount(0);
 const hero=p.locator('h1 .text-motion');await expect(hero).toHaveCSS('animation-name','hero-veil');await expect.poll(()=>hero.evaluate(e=>getComputedStyle(e).opacity),{timeout:3000}).toBe('1');
 await expect(hero).toHaveCSS('filter','none');
 if(width===1440)await p.screenshot({path:'/home/user/refined-type.png'});
 await p.goto('http://localhost:3000/matches');await expect(p.locator('h1 .text-motion')).toHaveCSS('animation-name','title-settle');await p.goto('http://localhost:3000/#roster');
 for(const n of ['GASTON','KOKOSIC147','MAFIN','OVERFLOD','UKKIS'])await expect(p.getByRole('heading',{name:n,exact:true})).toBeVisible();
 await p.locator('.portrait-card').first().scrollIntoViewIfNeeded();await expect.poll(()=>p.locator('.portrait-image-motion').first().evaluate(e=>getComputedStyle(e).opacity),{timeout:3500}).toBe('1');
 await p.goto('http://localhost:3000/rosters/mafin');await expect(p.locator('h1')).toHaveText('MAFIN');await expect(p.locator('h1 .text-motion')).toHaveCSS('animation-name','profile-arrive');
 await p.emulateMedia({reducedMotion:'reduce'});await expect(p.locator('h1 .text-motion')).toHaveCSS('animation-name','none');await expect(p.locator('h1 .text-motion')).toHaveCSS('opacity','1');
 expect(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);expect(errors).toEqual([]);
 console.log('PASS',width,'distinct full-text transitions, uppercase nicknames, portrait entrance, system reduced motion');await p.close();
}
const p=await b.newPage({javaScriptEnabled:false});await p.goto('http://localhost:3000');await expect(p.locator('h1 .text-motion')).toHaveCSS('opacity','1');console.log('PASS no-JS');await b.close();
