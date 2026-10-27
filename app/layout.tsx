import type {Metadata} from 'next';
import './globals.css';
import {BootScreen} from '@/components/boot-screen';
import {Shell} from '@/components/site';
export const metadata:Metadata={title:'Team Roosterz',description:'Team Roosterz — CS2. Основной состав и академия.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><head><noscript><style>{`.boot-screen{display:none!important}.boot-content{visibility:visible!important}.text-motion,.portrait-image-motion,.portrait-caption{opacity:1!important;transform:none!important;mask-image:none!important;-webkit-mask-image:none!important}`}</style></noscript><link rel="preload" href="/fonts/Luckies.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/><link rel="preload" href="/fonts/ONYTrack-UltraCondensedBlack.4328c6d0.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/></head><body><BootScreen><Shell>{children}</Shell></BootScreen></body></html>}
