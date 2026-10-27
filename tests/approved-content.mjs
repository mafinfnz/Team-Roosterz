import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();const errors=[];
const main=['gaston','kokosic147','mafin','overflod','ukkis'],academy=['sv1ntuzz','matv1k','vanya'];
for(const mobile of [false,true]){
 const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000');await page.evaluate(()=>document.fonts.ready);
 for(const [name,path] of [['Матчи','/matches'],['О клубе','/about'],['Контакты','/contact'],['Главная','/']]){
  if(mobile)await page.getByRole('button',{name:'Открыть меню'}).click();
  await page.locator('header nav').getByRole('link',{name,exact:true}).click();
  // Curtain closes BEFORE navigation and always releases after navigation.
  await page.waitForURL('http://localhost:3000'+path);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.dataset.routeSwap||'idle'),{timeout:8000}).toBe('idle');
  await expect.poll(()=>page.locator('.route-enter').evaluate(e=>Number(getComputedStyle(e).opacity)),{timeout:8000}).toBe(1);
  await expect(page.locator('h1')).toBeVisible();
  console.log('Navigation',mobile?'mobile':'desktop',path,'PASS');
 }
 await expect(page.getByRole('button',{name:/ЭФФЕКТЫ/})).toHaveCount(0);await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('html')).toHaveAttribute('data-effects','off');
 await page.goto('http://localhost:3000/#roster');await expect(page.locator('html')).toHaveAttribute('data-effects','off');
 for(const nick of main)await expect(page.getByRole('heading',{name:nick.toUpperCase(),exact:true})).toBeVisible();
 await expect(page.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(5);
 await page.getByRole('tab',{name:'ACADEMY',exact:true}).click();await expect(page.locator('.roster-slide[aria-hidden="false"] .portrait-card')).toHaveCount(3);
 for(const nick of academy)await expect(page.getByRole('heading',{name:nick.toUpperCase(),exact:true})).toBeVisible();
 await page.locator('a[href="/rosters/sv1ntuzz"]').click();await page.waitForURL('**/rosters/sv1ntuzz');await expect(page.locator('h1')).toHaveText('SV1NTUZZ');
 for(const nick of [...main,...academy]){await page.goto('http://localhost:3000/rosters/'+nick);await expect(page.locator('h1')).toHaveText(nick.toUpperCase());const img=page.locator('.profile-photo img');await expect.poll(()=>img.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true)}
 for(const path of ['/','/matches','/about','/contact']){
  await page.goto('http://localhost:3000'+path);const text=await page.locator('body').innerText();
  if(/SH1ROV|NORTH|NAVI|Vitality|Rating|European Open|teamroosterz.example|Александр Волков|MVP|FACEIT/.test(text))throw Error('Unapproved fixture on '+path);
  expect(await page.locator('a[href^="mailto:"]')).toHaveCount(0);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+path);
 }
 const removed=await page.goto('http://localhost:3000/rosters/shirov');expect(removed.status()).toBe(404);
 await page.close();
}
const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://localhost:3000');await expect(reduced.locator('html')).toHaveAttribute('data-effects','off');await expect(reduced.locator('.film-exposure')).toHaveCSS('display','none');await reduced.close();
await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('PASS: correct photos and roster assignments, navigation curtain, mobile, no effects UI, reduced motion, no invented data');
