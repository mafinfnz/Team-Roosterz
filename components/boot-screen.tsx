'use client';
import {useEffect,useState} from 'react';
import {allPlayers} from '@/lib/data';
export function BootScreen({children}:{children:React.ReactNode}){
 const [phase,setPhase]=useState<'loading'|'opening'|'ready'|'error'>('loading');
 useEffect(()=>{
  let live=true;let reveal:ReturnType<typeof setTimeout>;let deadline:ReturnType<typeof setTimeout>;
  const loadImage=(src:string)=>new Promise<void>((resolve,reject)=>{
   const img=new Image();img.decoding='async';
   img.onload=()=>{img.decode().then(()=>{if(img.naturalWidth>0)resolve();else reject(Error('Empty image: '+src))}).catch(reject)};
   img.onerror=()=>reject(Error('Image unavailable: '+src));img.src=src;
  });
  const fonts=Promise.all([document.fonts.load('400 32px Luckies'),document.fonts.load('900 32px "ONY Track"')]).then(async results=>{
   if(results.some(r=>!r.length))throw Error('Fonts unavailable');
   await document.fonts.ready;
   if(!document.fonts.check('400 32px Luckies')||!document.fonts.check('900 32px "ONY Track"'))throw Error('Fonts not ready');
  });
  // Explicit site-wide manifest includes inactive academy and CSS background assets.
  const sources=new Set(['/images/atmosphere-toned.jpg','/images/roosterz-mark.png','/images/film-grain.png',...allPlayers.flatMap(p=>[p.image,p.image.replace('/players/','/carousel/')]),...Array.from(document.querySelectorAll<HTMLImageElement>('.boot-content img')).map(img=>img.currentSrc||img.src)]);
  const imgs=Array.from(sources,loadImage);
  const timeout=new Promise<never>((_,reject)=>{deadline=setTimeout(()=>reject(Error('Loading timeout')),30000)});
  Promise.race([Promise.all([fonts,Promise.all(imgs)]),timeout]).then(()=>{
   if(!live)return;clearTimeout(deadline);setPhase('opening');window.dispatchEvent(new Event('roosterz-ready'));
   reveal=setTimeout(()=>{if(live)setPhase('ready')},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:650);
  }).catch(()=>{clearTimeout(deadline);if(live)setPhase('error')});
  return()=>{live=false;clearTimeout(deadline);clearTimeout(reveal)};
 },[]);
 return <div className={`boot-gate boot-${phase}`}><div className="boot-content">{children}</div>{phase!=='ready'&&<div className="boot-screen" role="status" aria-live="polite" aria-label={phase==='error'?'Ошибка загрузки':'Подготовка Team Roosterz'}>
 {phase==='error'?<div className="boot-error-content"><span className="boot-error-brand">ROOSTERZ</span><h1>Загрузка прервана</h1><p>Не удалось загрузить часть файлов.<br/>Проверьте соединение и попробуйте снова.</p><button onClick={()=>window.location.reload()}>Попробовать снова</button></div>:<div className="boot-word-window"><div className="boot-word">LOADING<span className="boot-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></div></div>}
 </div>}</div>;
}
