import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import heroPrinter from "@/assets/hero-printer.jpg";
import hpLogo from "@/assets/brands/hp.png";
import kyoceraLogo from "@/assets/brands/kyocera.png";
import brotherLogo from "@/assets/brands/brother.png";
import canonLogo from "@/assets/brands/canon.png";
import epsonLogo from "@/assets/brands/epson.png";
import pantumLogo from "@/assets/brands/pantum.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, Star,
  Instagram, Facebook,
} from "lucide-react";
import { z } from "zod";

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

const BRANDS: { name: string; src: string }[] = [
  { name: "HP", src: hpLogo },
  { name: "Kyocera", src: kyoceraLogo },
  { name: "Brother", src: brotherLogo },
  { name: "Canon", src: canonLogo },
  { name: "Epson", src: epsonLogo },
  { name: "Pantum", src: pantumLogo },
];

const STATS = [
  { value: "+30", label: "anos de mercado" },
  { value: "+5.000", label: "clientes satisfeitos" },
  { value: "+500 mil", label: "cópias realizadas" },
  { value: "+150", label: "empresas no RJ" },
];

const PAINS = [
  "Equipamento quebrando na hora errada",
  "Gasto imprevisível com toner e peças",
  "Sem técnico disponível quando precisa",
  "Capital imobilizado em equipamento depreciando",
];

const BENEFITS = [
  { title: "Locação de Multifuncionais", desc: "Laser ou jato de tinta, mono ou colorido — escolha o ideal para sua operação." },
  { title: "Manutenção Inclusa", desc: "Preventiva e corretiva sem custo extra. Equipamento sempre rodando." },
  { title: "Suporte Especializado", desc: "Atendimento remoto ou presencial com técnicos experientes." },
  { title: "Insumos Originais", desc: "Cartuchos e toner inclusos. Sem mais surpresas no orçamento." },
  { title: "Custo Previsível", desc: "Franquias a partir de 1.500 cópias/mês. Você sabe exatamente quanto vai pagar." },
  { title: "Entrega Ágil", desc: "Atendimento em toda a região do Rio de Janeiro." },
];

const STEPS = [
  "Entre em contato pelo WhatsApp",
  "Avaliamos a demanda de impressão da sua empresa",
  "Indicamos o equipamento ideal",
  "Instalamos e configuramos sem custo",
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

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#solucao" className="hover:text-foreground transition-colors">Soluções</a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
          <a href="#servicos" className="hover:text-foreground transition-colors">Serviços</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="btn-metallic font-semibold">
            Falar no WhatsApp
          </Button>
        </a>
      </div>
    </header>
  );
}

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const text = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <span className={`font-display ${text} font-extrabold tracking-tight`}>
        In <span className="text-primary">Black</span> Toner
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:py-28 lg:py-32">
        <div className="flex flex-col justify-center" data-reveal>
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            +30 anos no Rio de Janeiro
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Alugue Impressoras para sua Empresa e <span className="text-primary">Esqueça os Problemas</span> com Impressão
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Manutenção preventiva, suporte técnico e insumos incluídos — tudo em um único contrato.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-metallic h-14 px-7 text-base font-semibold">
                Quero alugar agora via WhatsApp
              </Button>
            </a>
            <a href="#formulario">
              <Button size="lg" className="btn-metallic-outline h-14 px-7 text-base font-semibold">
                Solicitar proposta
              </Button>
            </a>
          </div>
          <div className="mt-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Trabalhamos com as principais marcas
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {BRANDS.map((b) => (
                <img
                  key={b.name}
                  src={b.src}
                  alt={`Logo ${b.name}`}
                  className="h-7 w-auto object-contain opacity-90 transition-opacity hover:opacity-100 md:h-8"
                  loading="lazy"
                />
              ))}
            </div>
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
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center" data-reveal>
            <div className="font-display text-3xl font-extrabold text-primary md:text-4xl">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
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
          <div key={p} className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-5 h-full" data-reveal>
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
          {BENEFITS.map(({ title, desc }) => (
            <div
              key={title}
              data-reveal
              className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card p-7 shadow-[var(--shadow-glow)]"
            >
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="container mx-auto px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center" data-reveal>
        <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">Simples assim:</h2>
        <p className="mt-4 text-muted-foreground">Em poucos passos sua empresa está operando com a melhor solução de impressão do RJ.</p>
      </div>
      <ol className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-5">
        {STEPS.map((step, i) => (
          <li
            key={step}
            data-reveal
            className="relative rounded-2xl border border-border bg-card p-6 pt-12 text-center"
          >
            <span
              className="text-metallic-number absolute -top-6 left-1/2 -translate-x-1/2 font-display text-7xl font-extrabold leading-none"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="text-sm">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex justify-center" data-reveal>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
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
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-6"
            >
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
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-7"
          >
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">
              "{t.text}"
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-4">
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
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
      window.open(`${WHATSAPP_URL}?text=${msg}`, "_blank", "noopener,noreferrer");
      toast.success("Redirecionando para o WhatsApp...");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 300);
  };

  return (
    <section id="formulario" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div data-reveal>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Receba uma <span className="text-primary">proposta personalizada</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Preencha os campos e fale com um especialista. Respondemos em poucos minutos no horário comercial.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {["Atendimento em todo o RJ", "Resposta em até 1 hora útil", "Sem compromisso"].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={onSubmit}
          data-reveal
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
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
    <section className="relative overflow-hidden border-y border-border" style={{ background: "var(--gradient-hero)" }}>
      <div className="container mx-auto px-4 py-20 text-center md:py-28">
        <h2 className="mx-auto max-w-3xl text-4xl font-extrabold sm:text-5xl md:text-6xl" data-reveal>
          Sua empresa merece <span className="text-primary">imprimir sem estresse</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground" data-reveal>
          Fale agora com um especialista e receba uma proposta personalizada.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4" data-reveal>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
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
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto flex items-center justify-center gap-4 px-4 py-6">
        <a href="https://www.instagram.com/inblacktoner/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Instagram className="h-4 w-4" />
        </a>
        <a href="https://www.facebook.com/inblacktonerbr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Facebook className="h-4 w-4" />
        </a>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
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
      aria-label="Falar no WhatsApp"
      className="btn-metallic animate-pulse-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full !p-0 transition-transform hover:scale-110"
    >
      <span className="font-bold text-sm">WhatsApp</span>
    </a>
  );
}
