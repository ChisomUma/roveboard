import './style.css';import './landing.css';
import {Plus_Jakarta_Sans} from 'next/font/google';
const font=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-sans'});
export const metadata={title:'Roveboard',description:'A calmer way to coordinate travel suppliers'};
// suppressHydrationWarning: browser extensions (Grammarly, Scribe…) add attributes to <html>/<body> before React loads.
export default function Layout({children}){return <html lang="en" className={font.variable} suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>}
