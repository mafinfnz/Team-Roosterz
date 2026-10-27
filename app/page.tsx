import Link from 'next/link';
import {AnimatedText} from '@/components/animated-text';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {HomeRoster} from '@/components/home-roster';
export default function Home(){return <>
<section className="cinema-hero"><div className="cinema-landscape"/><div className="cinema-vignette"/><div className="hero-grid" aria-hidden="true"/><div className="cinema-center"><div className="hero-emblem" aria-hidden="true"><img src="/images/roosterz-mark.png" alt=""/></div><h1 className="luckies"><AnimatedText text="ROOSTERZ" delay={.18} hero/></h1><Link className="hero-roster-link" href="/" data-roster-target="roster">КОМАНДА<ArrowUpRight size={18}/></Link></div><div className="hero-bottom"><a href="/" data-roster-target="roster" aria-label="Перейти к составу"><ArrowDown size={18}/></a></div></section>
<HomeRoster/>
</>}
