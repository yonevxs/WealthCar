"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBLE } from "@/hook/useBLE";
import {
  Gauge,
  Thermometer,
  Fuel,
  BatteryFull,
  AlertTriangle,
  Activity,
  LogOut,
  Car,
  Wifi,
  Calendar,
  Hash,
  Bluetooth,
  BluetoothOff,
  BluetoothSearching,
  Milestone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ─── Tipos ───────────────────────────────────────────────────────── */
interface Veiculo {
  id_veiculo: string;
  nome_apelido: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  quilometragem_atual: number;
  ultima_sincronizacao: string | null;
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
const statusColor = {
  ok:     "text-green-600 bg-green-50 border-green-200",
  warn:   "text-yellow-700 bg-yellow-50 border-yellow-200",
  danger: "text-red-600 bg-red-50 border-red-200",
};
const statusDot = {
  ok:     "bg-green-500",
  warn:   "bg-yellow-500",
  danger: "bg-red-500",
};

function getStatusVel(v: number): "ok" | "warn" | "danger" {
  if (v > 110) return "danger";
  if (v > 80)  return "warn";
  return "ok";
}
function getStatusRpm(r: number): "ok" | "warn" | "danger" {
  if (r > 5000) return "danger";
  if (r > 3500) return "warn";
  return "ok";
}
function getStatusComb(c: number): "ok" | "warn" | "danger" {
  if (c < 10) return "danger";
  if (c < 25) return "warn";
  return "ok";
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();

  /* Supabase */
  const [usuario,  setUsuario]  = useState("");
  const [veiculo,  setVeiculo]  = useState<Veiculo | null>(null);
  const [loadingV, setLoadingV] = useState(true);

  /* BLE */
  const { dados, erro, conectado, conectando, conectar, desconectar } = useBLE();

  /* ── Carrega sessão e veículo ── */
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setUsuario(user.user_metadata?.username || user.email || "Motorista");

      const { data, error } = await supabase
        .from("veiculo")
        .select("*")
        .eq("id_usuario", user.id)
        .maybeSingle();

      if (!error && data) {
        setVeiculo(data as Veiculo);
      } else {
        // Primeira vez — redireciona para cadastrar veículo
        router.push("/onboarding");
        return;
      }

      setLoadingV(false);
    };
    load();
  }, [router]);

  /* ── Logout ── */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  /* ── Formata data ── */
  const formatSync = (ts: string | null) => {
    if (!ts) return "Nunca";
    return new Date(ts).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  /* ── Métricas dinâmicas — BLE se conectado, placeholder se não ── */
  const vel  = dados?.vel  ?? null;
  const rpm  = dados?.rpm  ?? null;
  const comb = dados?.comb ?? null;
  const hodo = dados?.hodo ?? null;

  const metricas = [
    {
      label: "Velocidade",
      value: vel  !== null ? String(vel)  : "--",
      unit: "km/h",
      icon: <Gauge className="w-6 h-6" />,
      status: vel !== null ? getStatusVel(vel) : "ok" as const,
      description: "Velocidade atual do veículo",
    },
    {
      label: "RPM",
      value: rpm  !== null ? rpm.toLocaleString("pt-BR") : "--",
      unit: "rpm",
      icon: <Activity className="w-6 h-6" />,
      status: rpm !== null ? getStatusRpm(rpm) : "ok" as const,
      description: "Rotação do motor",
    },
    {
      label: "Temperatura Motor",
      value: "--",
      unit: "°C",
      icon: <Thermometer className="w-6 h-6" />,
      status: "ok" as const,
      description: "Aguardando sensor de temperatura",
    },
    {
      label: "Combustível",
      value: comb !== null ? String(comb) : "--",
      unit: "%",
      icon: <Fuel className="w-6 h-6" />,
      status: comb !== null ? getStatusComb(comb) : "ok" as const,
      description: "Nível de combustível no tanque",
    },
    {
      label: "Hodômetro",
      value: hodo !== null ? hodo.toLocaleString("pt-BR") : "--",
      unit: "km",
      icon: <Milestone className="w-6 h-6" />,
      status: "ok" as const,
      description: "Quilometragem total registrada",
    },
    {
      label: "Tensão da Bateria",
      value: "--",
      unit: "V",
      icon: <BatteryFull className="w-6 h-6" />,
      status: "ok" as const,
      description: "Aguardando sensor de bateria",
    },
    {
      label: "Códigos de Falha",
      value: "0",
      unit: "DTC",
      icon: <AlertTriangle className="w-6 h-6" />,
      status: "ok" as const,
      description: "Códigos de diagnóstico detectados",
    },
  ];

  /* ── UI do botão BLE ── */
  const BluetoothIcon = conectando
    ? BluetoothSearching
    : conectado
    ? Bluetooth
    : BluetoothOff;

  const btLabel = conectando
    ? "Conectando..."
    : conectado
    ? "Desconectar ESP32"
    : "Conectar ESP32";

  const btClass = conectado
    ? "bg-green-500 hover:bg-green-600 text-white"
    : conectando
    ? "bg-yellow-500 text-white cursor-wait"
    : "bg-white/15 hover:bg-white/25 text-white";

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ── Header ── */}
      <header className="bg-primary h-14 flex items-center justify-between px-5 shadow">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/img/logo_wealthcar.png" alt="Logo" width={40} height={40} className="h-7 w-auto" />
          <span className="text-white text-base">Wealth Car</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Botão BLE */}
          <button
            onClick={conectado ? desconectar : conectar}
            disabled={conectando}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${btClass}`}
          >
            <BluetoothIcon size={13} />
            {btLabel}
          </button>

          {/* Botão BLE mobile (só ícone) */}
          <button
            onClick={conectado ? desconectar : conectar}
            disabled={conectando}
            className={`sm:hidden p-2 rounded-full transition-all ${btClass}`}
            aria-label={btLabel}
          >
            <BluetoothIcon size={16} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {/* Boas-vindas */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Olá, <span className="text-primary">{usuario || "..."}</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aqui estão os dados em tempo real do seu veículo.
          </p>
        </div>

        {/* Erro BLE */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
            <BluetoothOff size={14} />
            {erro}
          </div>
        )}

        {/* ── Card do veículo ── */}
        {loadingV ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-6 shadow-sm animate-pulse h-16" />
        ) : veiculo ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">
                  {veiculo.nome_apelido || `${veiculo.marca} ${veiculo.modelo}`}
                </p>
                <p className="text-xs text-gray-500">
                  {veiculo.marca} {veiculo.modelo} · {veiculo.ano}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Hash size={12} /> {veiculo.placa}
                </span>
                <span className="flex items-center gap-1">
                  <Gauge size={12} /> {veiculo.quilometragem_atual?.toLocaleString("pt-BR")} km
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Sync: {formatSync(veiculo.ultima_sincronizacao)}
                </span>
              </div>

              {/* Badge status BLE */}
              {conectado ? (
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  ESP32 ao vivo
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  BLE desconectado
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 px-5 py-6 mb-6 text-center">
            <Car className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Nenhum veículo cadastrado</p>
            <p className="text-xs text-gray-400 mt-1">
              Adicione seu veículo no banco de dados para visualizar os dados.
            </p>
          </div>
        )}

        {/* ── Banner "conecte o ESP32" quando BLE desconectado ── */}
        {!conectado && !conectando && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BluetoothOff className="w-5 h-5 text-primary/50 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-primary">ESP32 desconectado.</span>{" "}
                Conecte via Bluetooth para ver os dados em tempo real.
              </p>
            </div>
            <button
              onClick={conectar}
              className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-primaryHover transition-colors flex-shrink-0 flex items-center gap-2"
            >
              <Bluetooth size={13} /> Conectar agora
            </button>
          </div>
        )}

        {/* ── Grid de métricas ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {metricas.map((m, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-2 transition-all duration-300 ${statusColor[m.status]}`}
            >
              <div className="flex items-center justify-between">
                <span className="opacity-70">{m.icon}</span>
                <span className={`w-2 h-2 rounded-full ${
                  !conectado ? "bg-gray-300" : statusDot[m.status]
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${!conectado && m.value === "--" ? "text-gray-300" : "text-gray-900"}`}>
                  {m.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{m.unit}</span>
                </p>
                <p className="text-xs font-semibold mt-0.5">{m.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aviso construção */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
          <p className="text-primary font-semibold text-sm mb-1">🚧 Página em construção</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Velocidade, RPM, combustível e hodômetro já são lidos via BLE do ESP32.
            Temperatura e tensão da bateria serão adicionados quando os sensores forem integrados.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-3 text-center">
        <p className="text-white/50 text-xs">© 2026 Wealth Car. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}