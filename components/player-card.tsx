'use client';
import Link from 'next/link';
import {useRef,useState} from 'react';
import {useInView,motion} from 'framer-motion';
import type {CSSProperties} from 'react';
import type {Player} from '@/lib/data';
import {useCinematicMotion} from './motion-context';
export function PlayerCard({player,index,swap=false}:{player:Player;index:number;swap?:boolean}){
 const ref=useRef<HTMLAnchorElement>(null);const inView=useInView(ref,{once:true,amount:.08});const [loaded,setLoaded]=useState(false);const active=useCinematicMotion();
 const imageVariants=swap?{hidden:{clipPath:'inset(0% 0% 100% 0%)',y:8},shown:{clipPath:'inset(0% 0% 0% 0%)',y:0,transition:{duration:active?.75:0,ease:[.22,.6,.25,1] as const}},exit:{clipPath:'inset(0% 0% 100% 0%)',y:-6,transition:{duration:active?.4:0,ease:[.4,0,.7,1] as const}}}:undefined;
 const textVariants=swap?{hidden:{clipPath:'inset(100% -5% -15% -5%)',y:12},shown:{clipPath:'inset(-15% -5% -15% -5%)',y:0,transition:{duration:active?.65:0,delay:active?.1:0,ease:[.22,.6,.25,1] as const}},exit:{clipPath:'inset(-15% -5% 115% -5%)',y:-12,transition:{duration:active?.32:0,ease:[.4,0,.7,1] as const}}}:undefined;
 return <Link ref={ref} href={'/rosters/'+player.slug} className={`portrait-card${(inView&&loaded)||!active?' portrait-ready':''}${!active?' portrait-static':''}`} style={{'--portrait-delay':`${(index%3)*.085}s`} as CSSProperties}>
 <div className="portrait-frame"><motion.div variants={imageVariants} className="portrait-image-motion"><img src={player.image} alt={player.nick.toUpperCase()} loading="eager" onLoad={()=>setLoaded(true)} ref={img=>{if(img?.complete&&img.naturalWidth)setLoaded(true)}}/></motion.div></div>
 <motion.div variants={textVariants} className="portrait-caption"><h2>{player.nick.toUpperCase()}</h2></motion.div></Link>;
}
