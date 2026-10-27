import {chromium,expect} from '@playwright/test';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/fonts/**',async route=>{await new Promise(r=>setTimeout(r,1200));await route.continue()});
await p.goto('http://localhost:3000',{waitUntil:'domcontentloaded'});await expect(p.locator('.boot-screen')).toBeVisible();await expect(p.locator('.boot-content')).toHaveCSS('visibility','hidden');await expect(p.locator('.boot-ready')).toBeVisible({timeout:15000});await expect(p.locator('h1')).toHaveText('ROOSTERZ');
await p.goto('http://localhost:3000/does-not-exist');await expect(p.locator('.boot-ready')).toBeVisible();await expect(p.locator('.status-code')).toHaveText('404');await p.screenshot({path:'/home/user/roosterz-404.png'});await p.getByRole('link',{name:/На главную/}).click();await p.waitForURL('http://localhost:3000/');
expect(errors).toEqual([]);console.log('PASS slow fonts, boot completion, 404, return home');
const fail=await b.newPage();await fail.route('**/fonts/**',r=>r.abort());await fail.goto('http://localhost:3000');await expect(fail.getByRole('button',{name:'Попробовать снова'})).toBeVisible({timeout:15000});await fail.unroute('**/fonts/**');await fail.getByRole('button',{name:'Попробовать снова'}).click();await expect(fail.locator('.boot-ready')).toBeVisible({timeout:15000});console.log('PASS font failure and retry');await b.close();
