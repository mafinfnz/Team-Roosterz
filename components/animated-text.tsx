'use client';
import {useRef,useEffect,useState} from 'react';
import {useInView} from 'framer-motion';
import type {CSSProperties} from 'react';
import {useCinematicMotion} from './motion-context';
/** One intact text run: no per-character staggering, font reshaping or animated blur. */
export function AnimatedText({text,delay=0,hero=false,variant='title'}:{text:string;delay?:number;hero?:boolean;variant?:'title'|'section'|'profile'}){
 const ref=useRef<HTMLSpanElement>(null);const inView=useInView(ref,{once:true,amount:.2});const active=useCinematicMotion();
 const [ready,setReady]=useState(false);
 useEffect(()=>{let mounted=true;document.fonts.ready.then(()=>{if(mounted)setReady(true)});return()=>{mounted=false}},[]);
 return <span ref={ref} className={`text-width text-${hero?'hero':variant}`}><span className={`text-motion${(inView&&ready)||!active?' text-ready':''}${!active?' text-static':''}`} style={{'--text-delay':`${delay}s`} as CSSProperties}>{text}</span></span>;
}
