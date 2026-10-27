import Link from 'next/link';
export default function NotFound(){return <section className="status-page"><div className="status-mark" aria-hidden="true"/><span className="status-code">404</span><h1>Страница не найдена</h1><p>Возможно, ссылка изменилась. Вернёмся к команде?</p><Link className="button" href="/">На главную ↗</Link></section>}
