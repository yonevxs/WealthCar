import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  TrendingUp,
  Wrench,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/* ── Ícone Apple ──────────────────────────────────────────────────── */
function AppleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 270-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.4 189.8-49.4 30.6 0 132.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

/* ── Ícone Google Play ────────────────────────────────────────────── */
function GooglePlayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.18 23.76a2 2 0 0 0 2.06-.22l12.27-11.32L5.24.46A2 2 0 0 0 2 2.25v19.5a2 2 0 0 0 1.18 2.01z" opacity=".6" />
      <path d="M20.67 10.13 18.1 8.67l-2.9 3.33 2.9 3.33 2.6-1.48a2 2 0 0 0 0-3.72z" opacity=".8" />
      <path d="M5.24.46 17.51 12l-2.9 3.33L4.24.84A1.98 1.98 0 0 1 5.24.46z" opacity=".9" />
      <path d="M5.24 23.54a1.98 1.98 0 0 1-1-.38L14.62 8.67 17.51 12z" opacity=".7" />
    </svg>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[500px] flex flex-col justify-center items-center text-white text-center px-5 py-20"
        style={{
          background:
            "linear-gradient(rgba(21,15,140,0.82),rgba(0,0,0,0.72)), url('https://images.unsplash.com/photo-1602951172321-fe0aa8865e6b?w=1920&q=80&auto=format&fit=crop') center/cover no-repeat",
        }}
      >
        <span className="bg-accent/20 text-accent border border-accent/50 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
          O seu carro inteligente
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl drop-shadow-lg leading-tight">
          O Controle do seu Veículo{" "}
          <br className="hidden md:block" />
          na Palma da Mão
        </h1>

        <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 text-gray-200 drop-shadow-md">
          Conecte seu veículo ao nosso app e receba dados precisos de
          desempenho, alertas de manutenção e localização em tempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          {/* App Store */}
          <button className="bg-white text-dark flex items-center justify-center gap-3 py-3 px-6 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg w-full sm:w-auto">
            <AppleIcon className="w-7 h-7 text-dark" />
            <div className="text-left">
              <span className="block text-[0.65rem] font-medium leading-none uppercase text-gray-500">
                Baixar na
              </span>
              <span className="block text-sm leading-none mt-1">App Store</span>
            </div>
          </button>

          {/* Google Play */}
          <button className="bg-transparent border-2 border-white text-white flex items-center justify-center gap-3 py-3 px-6 rounded-lg font-bold hover:bg-white/10 transition-colors shadow-lg w-full sm:w-auto">
            <GooglePlayIcon className="w-6 h-6 text-white" />
            <div className="text-left">
              <span className="block text-[0.65rem] font-medium leading-none uppercase text-gray-300">
                Disponível no
              </span>
              <span className="block text-sm leading-none mt-1">Google Play</span>
            </div>
          </button>
        </div>
      </section>

      {/* ── RECURSOS ──────────────────────────────────────────────────── */}
      <section id="recursos" className="py-20 px-6 md:px-16 text-center bg-surface">
        <h2 className="text-3xl font-bold text-dark mb-4">
          Por que usar o Wealth Car?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          Tudo o que você precisa para gerenciar, proteger e otimizar o uso do
          seu carro, reunido em um aplicativo simples e intuitivo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 mx-auto">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">
              Telemetria em Tempo Real
            </h3>
            <p className="text-sm text-gray-600">
              Acompanhe consumo de combustível, velocidade média e saúde do
              motor diretamente na tela do seu celular.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Wrench className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">
              Alertas Preventivos
            </h3>
            <p className="text-sm text-gray-600">
              Nunca mais esqueça a troca de óleo. O app te avisa sobre
              revisões, calibragem de pneus e desgaste de peças.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">
              Rastreamento e Segurança
            </h3>
            <p className="text-sm text-gray-600">
              Saiba exatamente onde seu veículo está estacionado e receba
              notificações em caso de movimentações suspeitas.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOBRE / COMO FUNCIONA ─────────────────────────────────────── */}
      <section id="sobre" className="py-20 px-6 md:px-16 bg-white overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Seu carro conectado em minutos.
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Nossa missão é transformar informações automotivas complexas em
              conhecimento acessível. Ajudamos motoristas comuns e frotistas a
              tomarem decisões seguras, economizando tempo e dinheiro.
            </p>

            <ul className="text-left space-y-4 mb-8 inline-block lg:block">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0 w-5 h-5" />
                <span className="text-gray-700 font-medium">
                  Instalação rápida e sem fios (Plug &amp; Play via OBD2).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0 w-5 h-5" />
                <span className="text-gray-700 font-medium">
                  Interface amigável e relatórios simplificados.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0 w-5 h-5" />
                <span className="text-gray-700 font-medium">
                  Suporte técnico especializado 24/7.
                </span>
              </li>
            </ul>

            <Link
              href="/#baixar"
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors"
            >
              Conheça os planos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Imagem do carro */}
          <div className="flex-1 relative flex justify-center">
            <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-primary/5 rounded-full -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <Image
              src="/img/lancer_branca.png"
              alt="Carro Wealth Car"
              width={500}
              height={340}
              className="relative z-10 w-full max-w-[500px] drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── BAIXAR / CTA ──────────────────────────────────────────────── */}
      <section
        id="baixar"
        className="bg-primary text-white py-16 text-center px-5 border-t-4 border-accent"
      >
        <h2 className="text-3xl font-bold mb-4">
          Pronto para assumir a direção dos seus dados?
        </h2>
        <p className="mb-8 text-gray-300 max-w-xl mx-auto">
          Junte-se a milhares de motoristas que já estão economizando e
          dirigindo com mais segurança. O download é gratuito.
        </p>
        <Link
          href="/cadastro"
          className="inline-block bg-accent hover:bg-blue-500 text-white py-4 px-10 text-lg font-bold rounded-full transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
        >
          Criar Minha Conta Grátis
        </Link>
      </section>

      <Footer />
    </>
  );
}
