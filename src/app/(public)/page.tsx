"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Aperture, Bot, CalendarDays, Check, ChevronRight, CirclePlay, Camera, Mail, Menu, Moon, Play, Quote, Sparkles, Star, Sun, MessageCircle, Users, WandSparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const faqs = [
  ["Can I try Lumodesk before paying?", "Yes. Every plan begins with a 14-day free trial, with no credit card required."],
  ["Can I migrate my existing clients?", "Absolutely. Import contacts, projects, and contracts from a CSV, or let our concierge team handle it."],
  ["Are client galleries included?", "Every plan includes beautiful, mobile-ready galleries. Storage limits vary by plan."],
  ["Does Lumodesk take a commission?", "Never. Payments go directly to your connected account, with no Lumodesk commission."],
  ["Can my team use the same workspace?", "Studio plans include five seats, granular permissions, and shared workflow templates."],
];

function BrandMark() {
  return <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-luminous"><Aperture className="size-4" /></span>;
}

export default function Page() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [yearly, setYearly] = useState(true);
  const { scrollYProgress } = useScroll();
  const dashboardY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);

  useEffect(() => {
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(preferred);
    document.documentElement.classList.toggle("dark", preferred);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] mesh-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] grid-fade opacity-60" />

      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border border-border/70 bg-background/75 px-3 shadow-lg backdrop-blur-xl md:px-5">
          <a href="#top" className="flex items-center gap-2.5 font-display text-sm font-bold"><BrandMark /> Lumodesk</a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">Features</a>
            <a className="transition-colors hover:text-foreground" href="#workflow">How it works</a>
            <a className="transition-colors hover:text-foreground" href="#pricing">Pricing</a>
            <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</Button>
            <Button size="sm" className="hidden sm:inline-flex">Get started <ArrowRight /></Button>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="md:hidden">{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </nav>
        {menuOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-xl border border-border bg-background p-3 shadow-xl md:hidden">{[["Features","features"], ["How it works","workflow"], ["Pricing","pricing"], ["FAQ","faq"]].map(([item,id]) => <a key={item} onClick={() => setMenuOpen(false)} href={`#${id}`} className="rounded-lg px-3 py-2 text-sm hover:bg-accent">{item}</a>)}</motion.div>}
      </header>

      <section id="top" className="relative mx-auto max-w-7xl px-5 pt-36 text-center md:pt-44">
        <motion.div {...reveal}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur"><Sparkles className="size-3.5 text-primary" /> The creative operating system</span>
          <h1 className="mx-auto max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.02] md:text-7xl lg:text-[5.6rem]">Your Entire Photography Business, <span className="text-primary">In One Place.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground md:text-lg">Manage bookings, deliver stunning client galleries, and automate your workflow with AI.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="luminous" size="xl">Start free trial <ArrowRight /></Button>
            <Button variant="glass" size="xl"><CirclePlay /> Watch demo</Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">14 days free · No credit card required</p>
        </motion.div>

        <motion.div style={{ y: dashboardY }} initial={{ opacity: 0, rotateX: 12, scale: 0.94 }} animate={{ opacity: 1, rotateX: 0, scale: 1 }} transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.18 }} className="relative mx-auto mt-14 max-w-6xl [perspective:1600px]">
          <div className="absolute inset-x-[14%] bottom-[-5%] h-1/2 rounded-full bg-primary/20 blur-3xl" />
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-2 shadow-2xl md:p-3 md:[transform:rotateX(2deg)]">
            <div className="flex h-9 items-center gap-1.5 border-b border-border px-2"><i className="size-2 rounded-full bg-destructive" /><i className="size-2 rounded-full bg-chart-4" /><i className="size-2 rounded-full bg-chart-2" /><span className="ml-3 text-[10px] text-muted-foreground">lumodesk / overview</span></div>
            <div className="grid min-h-[390px] grid-cols-[52px_1fr] md:grid-cols-[180px_1fr]">
              <aside className="border-r border-border p-3 text-left"><div className="mb-7 hidden items-center gap-2 text-xs font-semibold md:flex"><BrandMark /> Studio North</div>{[Aperture, CalendarDays, Users, Mail].map((Icon, i) => <div key={i} className={`mb-2 flex items-center gap-2 rounded-md p-2 text-xs ${i === 0 ? "bg-accent text-foreground" : "text-muted-foreground"}`}><Icon className="size-3.5" /><span className="hidden md:inline">{["Overview", "Bookings", "Clients", "Messages"][i]}</span></div>)}</aside>
              <div className="p-4 text-left md:p-6"><div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Monday, September 21</p><h3 className="mt-1 text-xl font-semibold md:text-2xl">Good morning, Alex.</h3></div><Button size="sm" className="hidden sm:flex">New project</Button></div>
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Revenue", "$24,860"],["Projects", "18"],["Inquiries", "32"],["Gallery views", "8.4k"]].map(([a,b],i)=><div key={a} className="rounded-lg border border-border bg-background p-3"><p className="text-[10px] text-muted-foreground">{a}</p><p className="mt-1 font-display text-lg font-bold">{b}</p><div className={`mt-3 h-1 rounded-full ${i === 0 ? "bg-primary" : "bg-accent"}`} /></div>)}</div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_.8fr]"><div className="overflow-hidden rounded-lg border border-border bg-background p-3"><div className="mb-3 flex justify-between text-xs font-medium"><span>Latest gallery</span><span className="text-muted-foreground">View all</span></div><img src="/images/lumodesk-editorial.jpg" alt="Editorial project contact sheet" width={1600} height={1104} className="h-44 w-full rounded-md object-cover" /></div><div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-medium">This month</p><div className="mt-6 flex h-28 items-end gap-2">{[38,60,44,78,56,92,70].map((h,i)=><motion.i initial={{height:0}} whileInView={{height:`${h}%`}} transition={{delay:i*.08}} key={i} className="flex-1 rounded-t-sm bg-primary/70" />)}</div></div></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-border bg-card py-8"><p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Trusted by creatives at</p><div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"><div className="flex w-max animate-marquee gap-16 pr-16 font-display text-xl font-bold text-muted-foreground/70">{[...Array(2)].flatMap((_,i)=>["VOGUE","SONY α","Canon","NATIONAL GEOGRAPHIC","Leica","Adobe"].map(x=><span key={`${x}-${i}`}>{x}</span>))}</div></div></section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <motion.div {...reveal} className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">Everything connected</p><h2 className="text-4xl font-semibold leading-tight md:text-6xl">Less admin. More time behind the lens.</h2><p className="mt-5 text-muted-foreground">Every client touchpoint, beautifully considered and perfectly in sync.</p></motion.div>
        <div className="mt-12 grid auto-rows-[300px] grid-cols-1 gap-4 md:grid-cols-6">
          <motion.article {...reveal} whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-4"><div className="relative z-10"><Users className="size-5 text-primary"/><h3 className="mt-4 text-xl font-semibold">Smart CRM</h3><p className="mt-2 max-w-xs text-sm text-muted-foreground">Know every client, conversation, and milestone at a glance.</p></div><div className="absolute -bottom-5 right-[-4%] w-[68%] rounded-lg border border-border bg-background p-4 shadow-xl"><div className="flex items-center gap-3"><img src="/images/lumodesk-portrait.jpg" alt="Client profile" width={1200} height={1504} loading="lazy" className="size-10 rounded-full object-cover"/><div><p className="text-xs font-semibold">Mara Cole</p><p className="text-[10px] text-muted-foreground">Editorial · September 28</p></div><span className="ml-auto rounded-full bg-chart-2/15 px-2 py-1 text-[9px] text-chart-2">Confirmed</span></div>{["Contract signed","Invoice paid","Questionnaire received"].map((x,i)=><div key={x} className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground"><Check className="size-3 text-chart-2"/>{x}<span className="ml-auto">{i+1}d ago</span></div>)}</div></motion.article>
          <motion.article {...reveal} whileHover={{ y: -5 }} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2 md:row-span-2"><Aperture className="size-5 text-primary"/><h3 className="mt-4 text-xl font-semibold">Client Galleries</h3><p className="mt-2 text-sm text-muted-foreground">Deliver work that feels as premium as it looks.</p><div className="relative mt-7 h-[390px]"><motion.img whileHover={{rotate:-2,scale:1.02}} src="/images/lumodesk-gallery.jpg" alt="Wedding gallery" width={1200} height={1504} loading="lazy" className="absolute left-2 top-2 h-72 w-48 -rotate-6 rounded-md border-[6px] border-card object-cover shadow-xl"/><motion.img whileHover={{rotate:2,scale:1.02}} src="/images/lumodesk-editorial.jpg" alt="Editorial gallery" width={1600} height={1104} loading="lazy" className="absolute left-12 top-24 h-52 w-48 rotate-6 rounded-md border-[6px] border-card object-cover shadow-xl"/></div></motion.article>
          <motion.article {...reveal} whileHover={{ y: -5 }} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2"><div className="absolute right-4 top-4 size-24 rounded-full bg-primary/25 blur-2xl"/><WandSparkles className="relative size-5 text-primary"/><h3 className="mt-4 text-xl font-semibold">AI Assistant</h3><p className="mt-2 text-sm text-muted-foreground">Draft emails, curate galleries, and plan timelines in seconds.</p><div className="mt-6 flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs"><Bot className="size-5 text-primary"/>Your follow-up is ready to send.<ChevronRight className="ml-auto size-4"/></div></motion.article>
          <motion.article {...reveal} whileHover={{ y: -5 }} className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-luminous md:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Automated invoicing</p><div className="mt-3 flex items-end justify-between"><div><p className="text-3xl font-bold">$48.2k</p><p className="text-xs text-muted-foreground">Collected this year</p></div><span className="text-xs text-chart-2">+18.4%</span></div><svg viewBox="0 0 300 90" className="mt-5 w-full text-primary" fill="none"><motion.path initial={{pathLength:0}} whileInView={{pathLength:1}} transition={{duration:1.4}} d="M0 75 C30 72, 45 34, 78 49 S122 76, 151 39 S194 60, 225 25 S268 31,300 5" stroke="currentColor" strokeWidth="3"/><path d="M0 75 C30 72, 45 34, 78 49 S122 76, 151 39 S194 60, 225 25 S268 31,300 5 V90 H0Z" fill="currentColor" opacity=".08"/></svg></motion.article>
        </div>
      </section>

      <section id="workflow" className="border-y border-border bg-card/50"><div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[.8fr_1.2fr] md:py-32"><div className="md:sticky md:top-28 md:h-fit"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">How it works</p><h2 className="mt-3 text-4xl font-semibold md:text-5xl">From inquiry to final gallery.</h2><p className="mt-5 max-w-md text-muted-foreground">A thoughtful workflow that keeps your clients delighted and your business moving.</p></div><div className="space-y-20">{[["01","Capture every inquiry","Beautiful lead forms feed directly into your workspace. Lumodesk follows up while the moment is fresh.",CalendarDays],["02","Create the experience","Contracts, questionnaires, timelines, and invoices—sent at precisely the right moment.",Sparkles],["03","Deliver beautifully","Publish a cinematic gallery, collect favorites, and make print sales without lifting a finger.",Aperture]].map(([n,t,d,Icon],i)=>{const I=Icon as typeof Aperture;return <motion.article key={n as string} {...reveal} className="min-h-[420px] overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm"><span className="font-mono text-xs text-primary">{n as string}</span><h3 className="mt-4 text-2xl font-semibold">{t as string}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{d as string}</p><div className="relative mt-8 h-52 overflow-hidden rounded-lg border border-border bg-soft"><div className="absolute inset-0 grid-fade opacity-50"/><motion.div whileInView={{scale:1, y:0}} initial={{scale:.9,y:30}} transition={{type:"spring",bounce:.2}} className="absolute inset-x-[12%] top-10 rounded-lg border border-border bg-card p-4 shadow-xl"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><I className="size-4"/></span><div><p className="text-xs font-semibold">{["New inquiry received","Workflow running","Gallery published"][i]}</p><p className="text-[10px] text-muted-foreground">{["Sofia & James · October 12","7 of 9 steps complete","418 photos · Ready to share"][i]}</p></div><Check className="ml-auto size-4 text-chart-2"/></div></motion.div></div></motion.article>})}</div></div></section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32"><motion.div {...reveal} className="text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Loved by working creatives</p><h2 className="mt-3 text-4xl font-semibold md:text-5xl">The calm behind the craft.</h2></motion.div><div className="mt-12 grid gap-4 md:grid-cols-3">{[["Lumodesk gave me back my Sundays. My clients feel cared for, and I finally feel in control.","Maya Chen","Wedding photographer"],["It’s the first tool that understands both the art and business of what we do.","Theo Martins","Commercial director"],["Our booking rate jumped almost immediately. Every touchpoint finally feels like our brand.","Nina Ross","Portrait studio"]].map(([q,n,r],i)=><motion.article key={n} {...reveal} transition={{...reveal.transition,delay:i*.1}} className={`rounded-xl border border-border bg-card/80 p-6 backdrop-blur ${i===1?"md:-translate-y-5":""}`}><Quote className="size-6 text-primary"/><div className="mt-5 flex gap-1">{[1,2,3,4,5].map(x=><Star key={x} className="size-3.5 fill-primary text-primary"/>)}</div><p className="mt-5 leading-7">“{q}”</p><div className="mt-7 flex items-center gap-3"><img src={i===1?"/images/lumodesk-portrait.jpg":i===0?"/images/lumodesk-gallery.jpg":"/images/lumodesk-editorial.jpg"} alt={n} width={1200} height={1504} loading="lazy" className="size-10 rounded-full object-cover"/><div><p className="text-sm font-semibold">{n}</p><p className="text-xs text-muted-foreground">{r}</p></div></div></motion.article>)}</div></section>

      <section id="pricing" className="border-y border-border bg-card/50"><div className="mx-auto max-w-6xl px-5 py-24 md:py-32"><motion.div {...reveal} className="text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Simple pricing</p><h2 className="mt-3 text-4xl font-semibold md:text-5xl">Grow at your own pace.</h2><div className="mt-7 inline-flex rounded-lg border border-border bg-background p-1"><button onClick={()=>setYearly(false)} className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${!yearly?"bg-foreground text-background":"text-muted-foreground"}`}>Monthly</button><button onClick={()=>setYearly(true)} className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${yearly?"bg-foreground text-background":"text-muted-foreground"}`}>Yearly <span className="text-primary">−20%</span></button></div></motion.div><div className="mt-12 grid items-center gap-4 md:grid-cols-3">{[["Starter",19,["3 active projects","20 GB gallery storage","Contracts & invoices"]],["Pro",39,["Unlimited projects","250 GB gallery storage","AI workflow assistant","Automations & analytics"]],["Studio",79,["5 team members","1 TB gallery storage","Priority concierge","Custom branding"]]].map(([name,price,features],i)=><motion.article key={name as string} {...reveal} whileHover={{y:-5}} className={`relative rounded-xl bg-background p-7 ${i===1?"border-2 border-primary py-10 shadow-luminous md:scale-105":"border border-border"}`}>{i===1&&<span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary">Most popular</span>}<h3 className="text-lg font-semibold">{name as string}</h3><div className="mt-5 flex items-end gap-1"><span className="text-4xl font-bold">${yearly?price as number:Math.round((price as number)*1.25)}</span><span className="pb-1 text-sm text-muted-foreground">/ month</span></div><p className="mt-2 text-xs text-muted-foreground">{yearly?"Billed annually":"Billed monthly"}</p><Button variant={i===1?"luminous":"outline"} className="mt-7 w-full">Start free trial</Button><div className="mt-7 space-y-3">{(features as string[]).map(f=><p key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary"/>{f}</p>)}</div></motion.article>)}</div></div></section>

      <section id="faq" className="mx-auto grid max-w-5xl gap-12 px-5 py-24 md:grid-cols-[.7fr_1.3fr] md:py-32"><motion.div {...reveal}><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Questions, answered</p><h2 className="mt-3 text-4xl font-semibold">A few things you might wonder.</h2><p className="mt-5 text-sm text-muted-foreground">Still curious? <a href="mailto:hello@lumodesk.co" className="text-primary underline underline-offset-4">Talk to our team.</a></p></motion.div><motion.div {...reveal}><Accordion type="single" collapsible>{faqs.map(([q,a],i)=><AccordionItem key={q} value={`item-${i}`}><AccordionTrigger className="py-5 text-base hover:no-underline">{q}</AccordionTrigger><AccordionContent className="max-w-xl pb-5 leading-6 text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></motion.div></section>

      <section className="px-5 pb-8"><motion.div {...reveal} className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-primary px-6 py-20 text-center text-primary-foreground shadow-luminous md:py-28"><div className="absolute inset-0 grid-fade opacity-20"/><div className="relative"><Aperture className="mx-auto size-8"/><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold md:text-6xl">Ready to level up your studio?</h2><p className="mx-auto mt-5 max-w-xl text-primary-foreground/75">Join thousands of photographers running calmer, more profitable businesses.</p><Button size="xl" variant="secondary" className="mt-8">Start your free trial <ArrowRight/></Button></div></motion.div></section>

      <footer className="mx-auto max-w-7xl px-5 py-10"><div className="flex flex-col items-center justify-between gap-6 border-b border-border pb-8 md:flex-row"><a href="#top" className="flex items-center gap-2 font-display text-sm font-bold"><BrandMark/> Lumodesk</a><div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><a href="#">Privacy</a><a href="#">Terms</a></div><div className="flex gap-2"><Button variant="ghost" size="icon" aria-label="Instagram"><Camera/></Button><Button variant="ghost" size="icon" aria-label="Twitter"><MessageCircle/></Button><Button variant="ghost" size="icon" aria-label="Play videos"><Play/></Button></div></div><p className="pt-6 text-center text-[11px] text-muted-foreground md:text-left">© 2026 Lumodesk, Inc. Built for the ones who see differently.</p></footer>
    </main>
  );
}
