"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  UserSearch,
} from "lucide-react";
import CarIcon from "@/components/CarIcon";

/* ─── Tipos ───────────────────────────────────────────────────────── */
interface MetricCard {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  status: "ok" | "warn" | "danger";
  description: string;
}

/* ─── Dados de exemplo (virão da API real) ────────────────────────── */
const metrics: MetricCard[] = [
  {
    label: "Velocidade",
    value: "87",
    unit: "km/h",
    icon: <Gauge className="w-6 h-6" />,
    status: "ok",
    description: "Velocidade atual do veículo",
  },
  {
    label: "RPM",
    value: "2.400",
    unit: "rpm",
    icon: <Activity className="w-6 h-6" />,
    status: "ok",
    description: "Rotação do motor",
  },
  {
    label: "Temperatura Motor",
    value: "91",
    unit: "°C",
    icon: <Thermometer className="w-6 h-6" />,
    status: "warn",
    description: "Temperatura do líquido de arrefecimento",
  },
  {
    label: "Combustível",
    value: "62",
    unit: "%",
    icon: <Fuel className="w-6 h-6" />,
    status: "ok",
    description: "Nível de combustível no tanque",
  },
  {
    label: "Tensão da Bateria",
    value: "12,6",
    unit: "V",
    icon: <BatteryFull className="w-6 h-6" />,
    status: "ok",
    description: "Tensão atual da bateria",
  },
  {
    label: "Códigos de Falha",
    value: "1",
    unit: "DTC",
    icon: <AlertTriangle className="w-6 h-6" />,
    status: "warn",
    description: "Códigos de diagnóstico detectados",
  },
];

const statusColor = {
  ok: "text-green-600 bg-green-50 border-green-200",
  warn: "text-yellow-700 bg-yellow-50 border-yellow-200",
  danger: "text-red-600 bg-red-50 border-red-200",
};

const statusDot = {
  ok: "bg-green-500",
  warn: "bg-yellow-500",
  danger: "bg-red-500",
};

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [connected] = useState(true); // TODO: estado real da conexão
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    // Tenta pegar o usuário do localStorage; caso não exista, usa "Motorista"
    setUsuario(localStorage.getItem("usuario") || "Motorista");
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ── Top bar ── */}
      <header className="bg-navy h-12 flex items-center justify-between px-5 shadow">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold mb-4 md:mb-0 cursor-pointer">
          <Image
            src="/img/logo_wealthcar.png"
            alt="Logo Wealth Car"
            width={40}
            height={40}
            className="h-7 w-auto"
          />
          <span className="text-white">Wealth Car</span>
        </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Status conexão ESP32 */}
          <span
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
              connected ? "text-green-300" : "text-red-300"
            }`}
          >
            <Wifi size={14} />
            {connected ? "ESP32 conectado" : "Desconectado"}
          </span>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} /> Sair
          </Link>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Welcome */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-gray-900">
            Olá, <span className="text-brand">{usuario}</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aqui estão os dados em tempo real do seu veículo.
          </p>
        </div>

        {/* Veículo info */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4 mb-7 shadow-sm">
          <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
            <Car className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Meu Veículo</p>
            <p className="text-xs text-gray-500">
              OBD2 · ESP32 · Última atualização: agora
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Ao vivo
          </span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {metrics.map((m, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-2 ${statusColor[m.status]}`}
            >
              <div className="flex items-center justify-between">
                <span className="opacity-70">{m.icon}</span>
                <span
                  className={`w-2 h-2 rounded-full ${statusDot[m.status]}`}
                  title={m.status}
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {m.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{m.unit}</span>
                </p>
                <p className="text-xs font-semibold mt-0.5">{m.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aviso de página em construção */}
        <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 text-center">
          <p className="text-brand font-semibold text-sm mb-1">
            🚧 Página em construção
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Esta é uma versão de teste do dashboard. Em breve teremos gráficos de histórico,
            alertas detalhados de DTCs e muito mais. Os dados acima são simulados.
          </p>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="bg-navy py-3 text-center">
        <p className="text-white/50 text-xs">
          © 2026 Wealth Car. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
