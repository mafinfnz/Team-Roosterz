'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {motion,useMotionValue,animate} from 'framer-motion';
import {useCinematicMotion} from './motion-context';
import {AnimatedText} from './animated-text';
import {PlayerCard} from './player-card';
import {players,academy} from '@/lib/data';
export function HomeRoster(){
 const [tab,setTab]=useState(0);const [ready,setReady]=useState(false);
 const active=useCinematicMotion();const buttons=useRef<(HTMLButtonElement|null)[]>([]);const panels=useRef<(HTMLDivElement|null)[]>([]);
 const viewportHeight=useMotionValue(0);const trackY=useMotionValue(0);
 useEffect(()=>{const sync=()=>setTab(location.hash==='#academy'?1:0);sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[]);
 useLayoutEffect(()=>{
  let heightAnimation:ReturnType<typeof animate>|undefined;let trackAnimation:ReturnType<typeof animate>|undefined;
  const measure=()=>{
   const height=panels.current[tab]?.offsetHeight||0;if(!height)return;
   const y=tab?-(panels.current[0]?.offsetHeight||0):0;
   if(!ready){viewportHeight.set(height);trackY.set(y);setReady(true);return}
   heightAnimation?.stop();trackAnimation?.stop();
   const transition={duration:active?.95:0,ease:[.65,0,.2,1] as const};
   heightAnimation=animate(viewportHeight,height,transition);trackAnimation=animate(trackY,y,transition);
  };
  measure();const observer=new ResizeObserver(measure);panels.current.forEach(panel=>{if(panel)observer.observe(panel)});
  return()=>{observer.disconnect();heightAnimation?.stop();trackAnimation?.stop()};
 },[tab,ready,active,viewportHeight,trackY]);
 function select(i:number){setTab(i);history.replaceState(history.state,'',i?'#academy':'#roster')}
 return <section className="container confirmed-roster home-roster-section" id="roster"><span id="academy" className="roster-anchor" aria-hidden="true"/><h2 className="collection-title"><AnimatedText text="ROSTER" variant="section"/></h2><div className="tabs" role="tablist" aria-label="Основной состав и академия">{['MAIN','ACADEMY'].map((label,i)=><button key={label} ref={el=>{buttons.current[i]=el}} id={`roster-tab-${i}`} type="button" role="tab" aria-selected={tab===i} aria-controls={`roster-panel-${i}`} tabIndex={tab===i?0:-1} className={tab===i?'active':''} onClick={()=>select(i)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;select(next);buttons.current[next]?.focus()}}}>{label}</button>)}</div>
 <motion.div className="roster-viewport" data-measured={ready} style={ready?{height:viewportHeight}:undefined}>
 <motion.div className="roster-track" style={{y:trackY}}>
 {[players,academy].map((group,i)=>(ready||i===tab)&&<div ref={el=>{panels.current[i]=el}} id={`roster-panel-${i}`} aria-labelledby={`roster-tab-${i}`} role="tabpanel" aria-hidden={tab!==i} inert={tab!==i} key={i} className="roster-slide"><div className={'photo-grid roster-gallery '+(i?'academy-three':'')}>{group.map((p,j)=><PlayerCard key={p.slug} player={p} index={j}/>)}</div></div>)}
 </motion.div></motion.div></section>
}
