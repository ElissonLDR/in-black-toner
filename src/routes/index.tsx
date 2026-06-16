import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import heroPrinter from "@/assets/hero-printer.jpg";
import brandLogo from "@/assets/logo-inblacktoner.png";
import hpLogo from "@/assets/brands/hp.png";
import kyoceraLogo from "@/assets/brands/kyocera.png";
import brotherLogo from "@/assets/brands/brother.png";
import canonLogo from "@/assets/brands/canon.png";
import epsonLogo from "@/assets/brands/epson.png";
import pantumLogo from "@/assets/brands/pantum.png";
import benefitLocacao from "@/assets/servico-locacao.png";
import benefitManutencao from "@/assets/servico-remanufatura.png";
import benefitSuporte from "@/assets/servico-suporte-tecnico.png";
import benefitInsumos from "@/assets/servico-cartuchos-originais.png";
import benefitCusto from "@/assets/servico-impressao.png";
import benefitEntrega from "@/assets/servico-entrega.png";
import bgLeadForm from "@/assets/bg-lead-form.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, Star,
  Instagram, Facebook, Menu,
  Quote, User,
} from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Aluguel de Impressoras RJ | In Black Toner" },
      { name: "description", content: "Alugue impressoras multifuncionais no RJ com manutenção, suporte e toner inclusos. +30 anos de experiência, +150 empresas atendidas. Fale no WhatsApp." },
      { property: "og:title", content: "Aluguel de Impressoras RJ | In Black Toner" },
      { property: "og:description", content: "Locação de impressoras com tudo incluso para sua empresa." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const WHATSAPP_URL = "https://wa.me/5524999313230";
const PHONE_DISPLAY = "(24) 99931-3230";

// Webhook para receber os leads (será preenchido pelo usuário)
const LEAD_WEBHOOK_URL = "";

async function sendLeadToWebhook(payload: Record<string, unknown>) {
  if (!LEAD_WEBHOOK_URL) return;
  try {
    await fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        source: "landing-inblacktoner",
        createdAt: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });
  } catch {
    // noop — não bloqueia o redirect
  }
}

// ---- Store simples para abrir o modal de lead a partir de qualquer botão ----
type LeadModalState = { open: boolean; origin: string };
let leadState: LeadModalState = { open: false, origin: "" };
const leadListeners = new Set<() => void>();
const leadStore = {
  subscribe(cb: () => void) {
    leadListeners.add(cb);
    return () => leadListeners.delete(cb);
  },
  getSnapshot: () => leadState,
  set(next: LeadModalState) {
    leadState = next;
    leadListeners.forEach((l) => l());
  },
};
function openLeadModal(origin: string) {
  leadStore.set({ open: true, origin });
}
function useLeadModalState() {
  return useSyncExternalStore(leadStore.subscribe, leadStore.getSnapshot, leadStore.getSnapshot);
}

const trackLeadConversion = () => {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", "conversion", {
      send_to: "AW-780139321/HlDtCM6Dt78cELn2__MC",
    });
    w.fbq?.("track", "Lead");
    w.dataLayer?.push({ event: "lead_whatsapp" });
  } catch {
    // noop
  }
};



const BRANDS: { name: string; src: string }[] = [
  { name: "HP", src: hpLogo },
  { name: "Kyocera", src: kyoceraLogo },
  { name: "Brother", src: brotherLogo },
  { name: "Canon", src: canonLogo },
  { name: "Epson", src: epsonLogo },
  { name: "Pantum", src: pantumLogo },
];

const STATS: { to: number; prefix?: string; suffix?: string; label: string }[] = [
  { to: 30, prefix: "+", label: "anos de mercado" },
  { to: 5000, prefix: "+", label: "clientes satisfeitos" },
  { to: 500, prefix: "+", suffix: "mil", label: "cópias realizadas" },
  { to: 150, prefix: "+", label: "empresas no RJ" },
];

const PAINS = [
  "Equipamento quebrando na hora errada",
  "Gasto imprevisível com toner e peças",
  "Sem técnico disponível quando precisa",
  "Capital imobilizado em equipamento depreciando",
];

const BENEFITS: { title: string; desc: string; image: string }[] = [
  { title: "Locação de Multifuncionais", desc: "Laser ou jato de tinta, mono ou colorido — escolha o ideal para sua operação.", image: benefitLocacao },
  { title: "Manutenção Inclusa", desc: "Preventiva e corretiva sem custo extra. Equipamento sempre rodando.", image: benefitManutencao },
  { title: "Suporte Especializado", desc: "Atendimento remoto ou presencial com técnicos experientes.", image: benefitSuporte },
  { title: "Linha completa de toners e cartuchos", desc: "Cartuchos e toner inclusos. Sem mais surpresas no orçamento.", image: benefitInsumos },
  { title: "Custo Previsível", desc: "Franquias a partir de 1.500 cópias/mês. Você sabe exatamente quanto vai pagar.", image: benefitCusto },
  { title: "Entrega Ágil", desc: "Atendimento em toda a região do Rio de Janeiro.", image: benefitEntrega },
];

const STEPS = [
  "Entre em contato pelo WhatsApp",
  "Avaliamos a demanda de impressão da sua empresa",
  "Indicamos o equipamento ideal",
  "Suporte especializado na instalação e configuração",
  "Suporte contínuo durante todo o contrato",
];

const SERVICES = [
  "Locação de Multifuncionais",
  "Cartuchos Originais",
  "Cartuchos Compatíveis",
  "Remanufatura de Cartuchos",
  "Suporte Técnico",
  "Cópia e Impressão",
];

const TESTIMONIALS = [
  { name: "Marcelo Andrade", role: "Diretor Administrativo", company: "Construtora Horizonte", text: "Trocar nossas impressoras pela locação da In Black foi a melhor decisão. Custo previsível e zero dor de cabeça." },
  { name: "Patrícia Lima", role: "Gerente de Escritório", company: "Advocacia Lima & Sousa", text: "Suporte rápido e equipamentos modernos. Em 3 anos nunca tivemos paradas críticas." },
  { name: "Rodrigo Mendes", role: "Sócio-fundador", company: "Mendes Contabilidade", text: "Reduzimos quase 40% do custo com impressão e ainda ganhamos qualidade. Recomendo de olhos fechados." },
];

const FAQS = [
  { q: "Qual o prazo mínimo de contrato?", a: "Os contratos partem de 12 meses, com condições flexíveis para renovação e upgrade de equipamento." },
  { q: "O que está incluído na mensalidade?", a: "Equipamento, manutenção preventiva e corretiva, suporte técnico, peças, toner e cartuchos originais dentro da franquia contratada." },
  { q: "Atende qual região?", a: "Atendemos todo o Estado do Rio de Janeiro — regiões Metropolitana, Serrana, Norte e Sul Fluminense." },
  { q: "Como funciona o suporte técnico?", a: "Atendimento remoto imediato e visitas presenciais quando necessário, com SLA definido em contrato." },
  { q: "Posso alugar mais de um equipamento?", a: "Sim. Montamos parques de impressão completos, com diferentes modelos conforme a necessidade de cada setor." },
];

const formSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  numero: z.string().trim().min(8, "Informe um telefone válido").max(20),
  email: z.string().trim().email("E-mail inválido").max(200),
  cidade: z.string().trim().min(2, "Informe a cidade").max(100),
  servico: z.string().trim().min(2, "Informe o serviço").max(120),
});

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("animate-fade-up");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

function LandingPage() {
  const rootRef = useReveal();

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <Hero />
      <Stats />
      <Pain />
      <Solution />
      <HowItWorks />
      <Services />
      <Testimonials />
      <LeadForm />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
      <Toaster richColors theme="dark" position="top-center" />
    </div>
  );
}

const NAV_LINKS: { href: string; targetId: string; label: string }[] = [
  { href: "#solucao", targetId: "solucao", label: "Soluções" },
  { href: "#como-funciona", targetId: "como-funciona", label: "Como funciona" },
  { href: "#servicos", targetId: "servicos", label: "Serviços" },
  { href: "#faq", targetId: "faq", label: "FAQ" },
];

function smoothScrollTo(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
  e.preventDefault();
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Header() {
  return (
    <header className="sticky top-3 z-40 px-4 md:top-4">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 shadow-[var(--shadow-card)] backdrop-blur-md md:h-16 md:px-6">
        <Logo />
        <nav className="hidden gap-8 text-sm text-muted-foreground lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => smoothScrollTo(e, l.targetId)}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button
          size="sm"
          onClick={() => openLeadModal("header")}
          className="btn-metallic hidden font-semibold lg:inline-flex"
        >
          Falar no WhatsApp
        </Button>
        <MobileMenu />
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menu"
          className="lg:hidden rounded-full text-foreground hover:bg-secondary/60"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm border-l border-border bg-background p-6"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="mt-10 flex h-full flex-col">
          <nav className="flex flex-col gap-1 text-base">
            {NAV_LINKS.map((l) => (
              <SheetClose asChild key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => smoothScrollTo(e, l.targetId)}
                  className="rounded-md px-3 py-3 font-medium transition-colors hover:bg-secondary/60"
                >
                  {l.label}
                </a>
              </SheetClose>
            ))}
          </nav>
          <SheetClose asChild>
            <Button
              onClick={() => openLeadModal("mobile-menu")}
              className="btn-metallic mt-8 h-12 w-full font-semibold"
            >
              Falar no WhatsApp
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const height = size === "lg" ? "h-12 md:h-14" : "h-9 md:h-10";
  return (
    <a href="#" aria-label="In Black Toner" className="flex items-center">
      <img
        src={brandLogo}
        alt="In Black Toner"
        className={`${height} w-auto object-contain`}
        loading="eager"
        decoding="async"
      />
    </a>
  );
}

function Hero() {
  return (
    <section className="container mx-auto mt-6 px-4">
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ background: "var(--gradient-hero)" }}
      >
      <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col justify-center text-center lg:text-left" data-reveal>
          <span className="mb-5 inline-flex w-fit items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary lg:self-start">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            +30 anos no Rio de Janeiro
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Alugue Impressoras para sua Empresa e <span className="text-primary">Esqueça os Problemas</span> com Impressão
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground mx-auto lg:mx-0">
            Manutenção preventiva, suporte técnico e insumos incluídos — tudo em um único contrato.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={trackLeadConversion}>
              <Button size="lg" className="btn-metallic h-14 px-7 text-base font-semibold">
                Quero alugar agora via WhatsApp
              </Button>
            </a>
            <a href="#formulario" onClick={(e) => smoothScrollTo(e, "formulario")}>
              <Button size="lg" className="btn-metallic-outline h-14 px-7 text-base font-semibold">
                Solicitar proposta
              </Button>
            </a>
          </div>
        </div>
        <div className="relative" data-reveal>
          <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-card)]">
            <img
              src={heroPrinter}
              alt="Impressora multifuncional profissional em escritório moderno"
              width={1280}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="w-full px-6 pb-10 md:px-12 md:pb-12" data-reveal>
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Trabalhamos com as principais marcas
        </p>
        <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-full bg-[#cacaca] px-8 py-5">
          {BRANDS.map((b) => (
            <img
              key={b.name}
              src={b.src}
              alt={`Logo ${b.name}`}
              className="h-7 w-auto object-contain opacity-95 transition-opacity hover:opacity-100 md:h-8"
              loading="lazy"
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container mx-auto px-4">
        <div
          data-reveal
          className="mx-auto max-w-[1280px] rounded-3xl border border-border/70 bg-card/60 px-6 py-10 shadow-[var(--shadow-card)] backdrop-blur-sm md:px-12 md:py-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-5xl font-extrabold leading-none text-primary md:text-6xl lg:text-7xl">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({
  to,
  prefix = "",
  suffix = "",
  durationMs = 1800,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }

    let rafId = 0;
    let started = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString("pt-BR")}
      {suffix && (
        <span className="ml-2 text-2xl md:text-3xl lg:text-4xl">
          {suffix}
        </span>
      )}
    </span>
  );
}

function Pain() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Você ainda perde <span className="text-primary">tempo e dinheiro</span> com impressora própria?
        </h2>
        <p className="mt-4 text-muted-foreground">A maioria das empresas convive com esses problemas todos os meses:</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((p) => (
          <div
            key={p}
            className="flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center sm:items-start sm:text-left"
            data-reveal
          >
            <XCircle className="h-5 w-5 shrink-0 text-destructive" />
            <span className="text-sm md:text-base">{p}</span>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center" data-reveal>
        <div className="h-16 w-px bg-gradient-to-b from-transparent to-primary" />
        <div className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          Existe uma solução melhor ↓
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section id="solucao" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Com a In Black Toner, sua empresa imprime com <span className="text-primary">tranquilidade</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Tudo o que você precisa em um único contrato, com previsibilidade total.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ title, desc, image }) => (
            <div
              key={title}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/40 bg-card shadow-[var(--shadow-glow)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary/60">
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent"
                  aria-hidden
                />
              </div>
              <div className="p-7">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLLIElement>("li[data-stagger]"));
    items.forEach((item) => {
      item.style.opacity = "0";
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item) => item.classList.add("animate-fade-up"));
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Simples assim:</h2>
        <p className="mt-4 text-muted-foreground">Em poucos passos sua empresa está operando com a melhor solução de impressão do RJ.</p>
      </div>
      <ol
        ref={listRef}
        className="mx-auto mt-14 grid max-w-6xl gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      >
        {STEPS.map((step, i) => (
          <li
            key={step}
            data-stagger
            style={{ animationDelay: `${i * 0.15}s` }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
          >
            <span
              className="text-metallic-number font-display text-6xl font-extrabold leading-none"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="mt-4 text-sm">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex justify-center" data-reveal>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={trackLeadConversion}>
          <Button size="lg" className="btn-metallic font-semibold">
            Começar agora
          </Button>
        </a>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="servicos" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Soluções para <span className="text-primary">cada necessidade</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s}
              data-reveal
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-base font-semibold">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
          Empresas que <span className="text-primary">confiam</span> na In Black Toner
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            data-reveal
            className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-7"
          >
            <div
              aria-hidden
              className="absolute -right-7 -top-7 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background shadow-[var(--shadow-card)]"
            >
              <Quote className="h-7 w-7 fill-primary text-primary" />
            </div>
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">
              "{t.text}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <div
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-muted-foreground"
              >
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function LeadForm() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      nome: fd.get("nome"),
      numero: fd.get("numero"),
      email: fd.get("email"),
      cidade: fd.get("cidade"),
      servico: fd.get("servico"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os campos");
      return;
    }
    setLoading(true);
    const { nome, numero, email, cidade, servico } = parsed.data;
    const msg = `Olá! Meu nome é ${nome}.%0ATelefone: ${numero}%0AE-mail: ${email}%0ACidade: ${cidade}%0AServiço: ${servico}%0AGostaria de uma proposta.`;
    setTimeout(() => {
      trackLeadConversion();
      window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank", "noopener,noreferrer");
      toast.success("Redirecionando para o WhatsApp...");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 300);
  };

  return (
    <section id="formulario" className="container mx-auto px-4 py-20 md:py-28">
      <div
        className="relative mx-auto max-w-[1280px] overflow-hidden rounded-3xl shadow-[var(--shadow-card)]"
        style={{
          backgroundImage: `url(${bgLeadForm})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative grid gap-12 p-8 md:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
          <div data-reveal className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Receba uma <span className="text-primary">proposta personalizada</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground lg:mx-0">
              Preencha os campos e fale com um especialista. Respondemos em poucos minutos no horário comercial.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Atendimento em todo o RJ", "Resposta em até 1 hora útil", "Sem compromisso"].map((i) => (
                <li key={i} className="flex items-center justify-center gap-2 lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <form
            onSubmit={onSubmit}
            data-reveal
            className="space-y-4 rounded-3xl border border-border/60 bg-card/85 p-6 shadow-[var(--shadow-card)] backdrop-blur-md md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="nome" label="Nome" placeholder="Seu nome completo" />
              <Field name="numero" label="Telefone / WhatsApp" placeholder="(00) 00000-0000" />
            </div>
            <Field name="email" label="E-mail" type="email" placeholder="voce@empresa.com" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="cidade" label="Cidade" placeholder="Ex: Rio de Janeiro" />
              <Field name="servico" label="Qual serviço busca" placeholder="Ex: Aluguel multifuncional" />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="btn-metallic h-12 w-full text-base font-semibold"
            >
              {loading ? "Enviando..." : "Enviar e abrir WhatsApp"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ao enviar, você concorda em receber contato comercial da In Black Toner.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, type = "text", placeholder }: { name: string; label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-11 border-border bg-background"
        required
      />
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Perguntas frequentes</h2>
      </div>
      <div className="mx-auto mt-10 max-w-3xl" data-reveal>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-5"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="container mx-auto px-4 py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl md:text-6xl" data-reveal>
          Sua empresa merece <span className="text-primary">imprimir sem estresse</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground" data-reveal>
          Fale agora com um especialista e receba uma proposta personalizada.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4" data-reveal>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={trackLeadConversion}>
            <Button size="lg" className="btn-metallic h-16 px-10 text-lg font-bold">
              Falar no WhatsApp agora
            </Button>
          </a>
          <a href={`tel:+5524999313230`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-6">
        <a href="https://www.instagram.com/inblacktoner/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary">
          <Instagram className="h-4 w-4" />
        </a>
        <a href="https://www.facebook.com/inblacktonerbr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary">
          <Facebook className="h-4 w-4" />
        </a>
      </div>
      <div className="py-5 text-center text-xs text-muted-foreground">
        IN BLACK TONER © 2026 — Todos os direitos reservados.
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackLeadConversion}
      aria-label="Falar no WhatsApp"
      className="btn-metallic animate-pulse-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 01-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 01-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035 1.043 2.722 1.043.847 0 2.521-.515 2.722-1.39.029-.13.029-.244.029-.387 0-.703-1.475-1.243-1.79-1.39zM16.029 28.493c-2.392 0-4.7-.685-6.749-1.952l-4.829 1.547 1.578-4.715a12.486 12.486 0 01-2.235-7.155c0-6.954 5.643-12.6 12.6-12.6 3.366 0 6.531 1.31 8.91 3.693a12.486 12.486 0 013.69 8.907c0 6.957-5.658 12.6-12.615 12.6h-.35zm0-23.087c-5.79 0-10.5 4.71-10.5 10.5 0 2.314.738 4.523 2.142 6.385l-1.392 4.16 4.275-1.365a10.471 10.471 0 005.586 1.62h.305c5.79 0 10.5-4.71 10.5-10.5 0-2.806-1.092-5.443-3.077-7.428a10.45 10.45 0 00-7.42-3.077z" />
    </svg>
  );
}
