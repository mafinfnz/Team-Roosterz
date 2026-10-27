import Link from 'next/link';
import {AnimatedText} from '@/components/animated-text';
import {notFound} from 'next/navigation';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {allPlayers} from '@/lib/data';
export function generateStaticParams(){return allPlayers.map(p=>({slug:p.slug}))}
export default async function Profile({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=allPlayers.find(p=>p.slug===slug);if(!p)notFound();const next=allPlayers[(allPlayers.indexOf(p)+1)%allPlayers.length];return <section className="container portrait-profile"><Link href="/" data-roster-target={p.academy?"academy":"roster"} className="back-link"><ArrowLeft size={15}/>К команде</Link><div className="profile-stage"><div className="profile-photo"><span className="profile-glow" aria-hidden="true"/><img src={p.image} alt={p.nick}/><span className="profile-veil" aria-hidden="true"/></div><div className="profile-name"><h1><AnimatedText text={p.nick.toUpperCase()} variant="profile" delay={.12}/></h1></div></div><Link className="next-player" href={'/rosters/'+next.slug}><span className="next-player-label">Следующий игрок</span><span className="next-player-value">{next.nick.toUpperCase()}<ArrowRight size={18}/></span></Link></section>}
