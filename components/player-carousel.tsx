'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion} from 'framer-motion';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {useCinematicMotion} from './motion-context';
import type {Player} from '@/lib/data';
export function PlayerCarousel({players}:{players:Player[]}){
 const [index,setIndex]=useState(Math.floor(players.length/2));const active=useCinematicMotion();
 const root=useRef<HTMLDivElement>(null);const current=useRef(index);const last=useRef(0);const touch=useRef<{x:number;y:number}|null>(null);
 current.current=index;
 const select=(i:number)=>setIndex(Math.max(0,Math.min(players.length-1,i)));
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const wheel=(e:WheelEvent)=>{
   if(e.ctrlKey||el.closest('[inert]'))return;
   const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(Math.abs(delta)<3)return;
   const dir=delta>0?1:-1;const next=current.current+dir;const now=performance.now();
   if(next<0||next>=players.length){if(now-last.current<1100){e.preventDefault();e.stopPropagation()}return}
   e.preventDefault();e.stopPropagation();if(now-last.current<1100)return;
   last.current=now;current.current=next;setIndex(next);
  };
  el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);
 },[players.length]);
 return <div ref={root} className="player-carousel" role="region" aria-roledescription="карусель" aria-label="Игроки состава" tabIndex={0}
 onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();select(e.key==='Home'?0:e.key==='End'?players.length-1:index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1))}}}
 onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}}
 onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x;const dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))select(index+(dx<0?1:-1));touch.current=null}}>
 <div className="carousel-stage">
 {players.map((p,i)=>{const distance=i-index;const selected=i===index;const contents=<motion.img src={p.image.replace('/players/','/carousel/')} alt={p.nick} draggable={false} initial={{opacity:active?0:1}} whileInView={{opacity:1}} viewport={{once:true,amount:.12}} transition={{duration:active?1.15:0,delay:active?Math.abs(i-Math.floor(players.length/2))*.06:0,ease:[.25,.6,.3,1]}}/>;return <motion.div key={p.slug} className={'carousel-player '+(selected?'is-current':'')} data-player={p.slug} style={{zIndex:10-Math.abs(distance)}} initial={false} animate={{opacity:selected?1:.62,x:`${distance*46}%`,scale:selected?1:Math.abs(distance)===1?.92:.85,y:0}} transition={{duration:active?1.1:0,ease:[.32,0,.2,1]}}>
 {contents}{selected?<Link href={'/rosters/'+p.slug} aria-label={'Открыть профиль '+p.nick}/>:<button type="button" onClick={()=>select(i)} aria-label={'Выбрать '+p.nick} tabIndex={Math.abs(distance)>2?-1:0}/>}
 </motion.div>})}
 </div>
 <div className="carousel-bottom"><button className="carousel-arrow" onClick={()=>select(index-1)} disabled={index===0} aria-label="Предыдущий игрок"><ArrowLeft/></button><motion.div className="carousel-name" aria-live="polite" initial={{opacity:active?0:1}} whileInView={{opacity:1}} viewport={{once:true,amount:.1}} transition={{duration:active?1:0,ease:[.25,.6,.3,1]}}><AnimatePresence mode="sync" initial={false}><motion.h3 key={players[index].slug} initial={{y:active?'110%':0}} animate={{y:0}} exit={{y:active?'-110%':0}} transition={{duration:active?.9:0,ease:[.32,0,.2,1]}}><Link href={'/rosters/'+players[index].slug}>{players[index].nick.toUpperCase()}</Link></motion.h3></AnimatePresence></motion.div><button className="carousel-arrow" onClick={()=>select(index+1)} disabled={index===players.length-1} aria-label="Следующий игрок"><ArrowRight/></button></div>
 </div>;
}
