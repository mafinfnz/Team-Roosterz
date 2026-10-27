'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <section className="status-page"><div className="status-mark" aria-hidden="true"/><span className="status-code">PAUSE</span><h1>Не удалось открыть страницу</h1><p>Попробуйте ещё раз или вернитесь на главную.</p><div className="status-actions"><button className="button" onClick={reset}>Повторить ↗</button><Link className="button" href="/">На главную ↗</Link></div></section>}
