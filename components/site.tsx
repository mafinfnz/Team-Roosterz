'use client';
import Link from 'next/link';
import {AnimatedText} from './animated-text';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useLayoutEffect,useState,useContext,useRef} from 'react';
import {motion} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import {ArrowUpRight,Menu,X,ArrowRight} from 'lucide-react';
import {MotionContext} from './motion-context';
export {useCinematicMotion} from './motion-context';
export function Logo({small=false}:{small?:boolean}){return <span className={'brand '+(small?'small':'')}><img src="/images/roosterz-mark.png" alt=""/>{!small&&<span>ROOSTERZ</span>}</span>}
const nav=[['/','Главная'],['/matches','Матчи'],['/about','О клубе'],['/contact','Контакты']];
export function Shell({children}:{children:React.ReactNode}){
 const pendingAnchor=useRef<string|null>(null);
 const scrollEngine=useRef<Lenis|null>(null);
 const router=useRouter();const leaving=useRef(false);const exits=useRef<Animation[]>([]);
 const [arrival,setArrival]=useState<string|null>(null);
 const [staticBackPath,setStaticBackPath]=useState<string|null>(null);
 const path=usePathname();const [open,setOpen]=useState(false);const [reduced,setReduced]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const active=!reduced;
 useEffect(()=>{document.documentElement.dataset.effects=active?'on':'off'},[active]);
 useEffect(()=>{if(!active)return;const lenis=new Lenis({duration:1.545,smoothWheel:true,wheelMultiplier:.85});scrollEngine.current=lenis;let id:number;function raf(t:number){lenis.raf(t);id=requestAnimationFrame(raf)}id=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(id);lenis.destroy();scrollEngine.current=null}},[active]);
 useLayoutEffect(()=>{
  const hash=pendingAnchor.current||window.location.hash.slice(1);
  if(hash==='academy'||hash==='roster'){
   try{sessionStorage.setItem('roosterz-tab',hash==='academy'?'1':'0')}catch{}
   window.dispatchEvent(new Event('roster-select'));
   if(location.hash)history.replaceState(history.state,'',location.pathname+location.search);
  }
  const reset=()=>{
   let anchor:HTMLElement|null=null;
   try{anchor=hash?document.getElementById(decodeURIComponent(hash)):null}catch{}
   const top=anchor?Math.max(0,anchor.getBoundingClientRect().top+window.scrollY-120):0;
   // Reset both the native position and Lenis' target so old momentum cannot return.
   scrollEngine.current?.resize();
   scrollEngine.current?.scrollTo(top,{immediate:true,force:true});
   window.scrollTo({top,left:0,behavior:'instant'});
  };
  reset();
  const frame=requestAnimationFrame(()=>{reset();pendingAnchor.current=null});
  return()=>cancelAnimationFrame(frame);
 },[path]);
 useEffect(()=>{setOpen(false);leaving.current=false;exits.current.forEach(a=>a.cancel());exits.current=[]},[path]);
 useEffect(()=>{if(arrival!==path)return;const timer=setTimeout(()=>setArrival(null),1600);return()=>clearTimeout(timer)},[path,arrival]);
 useEffect(()=>()=>{exits.current.forEach(a=>a.cancel())},[]);
 async function leavePage(e:React.MouseEvent<HTMLDivElement>){
  const profile=path.startsWith('/rosters/');
  if((!profile&&!['/','/matches','/about','/contact'].includes(path))||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const link=(e.target as HTMLElement).closest('a');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin)return;
  const target=link.dataset.rosterTarget||url.hash.slice(1);
  if(url.pathname===path){
   if(!target)return;
   let anchor:HTMLElement|null=null;
   try{anchor=document.getElementById(decodeURIComponent(target))}catch{}
   if(!anchor)return;
   e.preventDefault();e.stopPropagation();if(leaving.current)return;
   try{sessionStorage.setItem('roosterz-tab',target==='academy'?'1':'0')}catch{}
   window.dispatchEvent(new Event('roster-select'));
   const top=Math.max(0,anchor.getBoundingClientRect().top+window.scrollY-120);
   if(scrollEngine.current)scrollEngine.current.scrollTo(top,{duration:1.03,easing:(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2});
   else window.scrollTo({top,behavior:active?'smooth':'instant'});
   return;
  }
  e.preventDefault();e.stopPropagation();if(leaving.current)return;
  pendingAnchor.current=target||null;
  if(target){try{sessionStorage.setItem('roosterz-tab',target==='academy'?'1':'0')}catch{}}
  if(!active){router.push(url.pathname+url.search,{scroll:false});return}
  leaving.current=true;setOpen(false);router.prefetch(url.pathname);
  const betweenPlayers=profile&&url.pathname.startsWith('/rosters/');
  setStaticBackPath(betweenPlayers?url.pathname:null);
  // All exit elements finish together; no invisible ease-out tail before navigation.
  const nodes=document.querySelectorAll<HTMLElement>(path==='/'?'.cinema-center h1,.hero-emblem img,.hero-roster-link,.hero-bottom,.collection-title,.tabs,.roster-slide[aria-hidden="false"] .player-carousel':profile?'.profile-photo img,.profile-name .text-motion,.portrait-profile .back-link,.portrait-profile .next-player-label,.portrait-profile .next-player-value':'main .page-title .text-motion,main .route-copy,main .club-minimal img');
  const animations=Array.from(nodes).filter(node=>{if(betweenPlayers&&node.matches('.back-link,.next-player-label'))return false;const r=node.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map((node,i)=>{
   const style=getComputedStyle(node);
   const start={clipPath:style.clipPath==='none'?'inset(0% 0% 0% 0%)':style.clipPath,transform:style.transform==='none'?'translate(0px,0px)':style.transform};
   const name=node.matches('.text-motion');const photo=node.matches('img');
   const duration=profile?780:550;
   if(path==='/'){
    return node.animate([{clipPath:'polygon(-10% -10%,110% -10%,110% 110%,-10% 110%)'},{clipPath:'polygon(-30% -10%,-30% -10%,-10% 110%,-10% 110%)'}],{duration:740,delay:Math.min(i,3)*20,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
   }
   if(!profile){
    const heading=node.matches('.text-motion');
    const end=heading&&path==='/matches'?{clipPath:'inset(0 0 100% 0)',transform:'translateY(24px)'}:heading&&path==='/contact'?{clipPath:'inset(100% 0 0 0)',transform:'translateY(-24px)'}:{clipPath:'inset(-20% 100% -20% 0)',transform:'translateX(-12px)'};
    return node.animate([start,end],{duration,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
   }
   return node.animate([start,{clipPath:name?'inset(-20% 100% -20% 0)':'inset(0 0 100% 0)',transform:name?'translateX(22px)':photo?'translateY(18px)':'translateY(8px)'}],{duration,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
  });
  const glow=document.querySelector<HTMLElement>('.profile-glow');
  if(glow)animations.push(glow.animate([{opacity:getComputedStyle(glow).opacity},{opacity:0}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}));
  const veil=document.querySelector<HTMLElement>('.profile-veil');
  if(veil)animations.push(veil.animate([{opacity:getComputedStyle(veil).opacity},{opacity:0}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}));
  exits.current=animations;
  await Promise.all(animations.map(a=>a.finished.catch(()=>{})));
  // Give the fully clipped final frame a paint before replacing the route.
  await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  setArrival(profile||url.pathname==='/'?url.pathname:null);
  router.push(url.pathname+url.search,{scroll:false});
  window.setTimeout(()=>{animations.forEach(a=>a.cancel());leaving.current=false},2500);
 }

 return <MotionContext.Provider value={active}><div onClickCapture={leavePage}>
 <div className="film-grain" aria-hidden="true"/><div className="film-exposure" aria-hidden="true"/>
 <header className="header"><nav className={open?'nav open':'nav'} aria-label="Основная навигация">{nav.map(([href,label])=><Link className={path===href?'active':''} aria-current={path===href?'page':undefined} href={href} key={href}>{label}</Link>)}</nav><button className="mobile-toggle" aria-label="Открыть меню" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
 <main data-back-static={staticBackPath!==null&&path.startsWith('/rosters/')?'true':undefined} className={active&&arrival===path?'profile-arrival':undefined}>{children}</main>


 </div></MotionContext.Provider>
}
export function Reveal({children,className=''}:{children:React.ReactNode;className?:string}){const active=useContext(MotionContext);return <motion.div className={className} initial={{opacity:0,y:active?12:0}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:active?1.05:0,ease:[.22,1,.36,1]}}>{children}</motion.div>}
export function Button({href,children,secondary=false}:{href:string;children:React.ReactNode;secondary?:boolean}){return <Link href={href} className={'button '+(secondary?'secondary':'')}>{children}<ArrowUpRight size={17}/></Link>}
export function Title({title}:{title:string}){const path=usePathname();return <section className={`page-title container title-${path.slice(1)}`}><h1><AnimatedText text={title} delay={.08}/></h1></section>}
