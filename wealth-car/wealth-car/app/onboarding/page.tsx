"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Car, Loader2, ChevronRight, Fuel, Hash, Calendar, Gauge, ChevronDown } from "lucide-react";

/* ─── Base de marcas e modelos ───────────────────────────────────── */
const MARCAS_MODELOS: Record<string, string[]> = {
  "Chevrolet": [
    "Onix", "Onix Plus", "Tracker", "S10", "Cruze", "Spin",
    "Montana", "Equinox", "Trailblazer", "Camaro",
  ],
  "Fiat": [
    "Argo", "Cronos", "Mobi", "Pulse", "Fastback", "Strada",
    "Toro", "Uno", "Palio", "Bravo",
  ],
  "Ford": [
    "Ka", "EcoSport", "Territory", "Ranger", "Bronco Sport",
    "Maverick", "Mustang",
  ],
  "Honda": [
    "Civic", "City", "City Hatchback", "HR-V", "CR-V",
    "WR-V", "Fit", "Accord",
  ],
  "Hyundai": [
    "HB20", "HB20S", "Creta", "Tucson", "Santa Fe", "Azera",
  ],
  "Jeep": [
    "Renegade", "Compass", "Commander", "Wrangler", "Gladiator",
  ],
  "Kia": [
    "Stonic", "Sportage", "Sorento", "Carnival", "EV6",
  ],
  "Mercedes-Benz": [
    "Classe A", "Classe C", "Classe E", "GLA", "GLC", "GLE", "Sprinter",
  ],
  "Mitsubishi": [
    "Lancer", "Lancer Evolution", "Outlander", "Eclipse Cross",
    "ASX", "Pajero", "L200",
  ],
  "Nissan": [
    "Kicks", "Versa", "Sentra", "Frontier", "X-Trail",
  ],
  "Renault": [
    "Kwid", "Sandero", "Logan", "Duster", "Captur", "Oroch",
  ],
  "Toyota": [
    "Corolla", "Corolla Cross", "Yaris", "Hilux", "SW4",
    "RAV4", "Prius", "Camry",
  ],
  "Volkswagen": [
    "Gol", "Polo", "Virtus", "Nivus", "T-Cross", "Taos",
    "Tiguan", "Amarok", "Saveiro",
  ],
  "BYD": [
    "Dolphin", "Seal", "Tan", "Han", "Atto 3", "King",
  ],
  "Caoa Chery": [
    "Tiggo 2", "Tiggo 5x", "Tiggo 7", "Tiggo 8",
  ],
  "Peugeot": [
    "208", "2008", "3008", "5008",
  ],
  "BMW": [
    "Série 1", "Série 3", "Série 5", "X1", "X3", "X5",
  ],
  "Audi": [
    "A3", "A4", "A5", "Q3", "Q5", "Q7",
  ],
  "Volvo": [
    "XC40", "XC60", "XC90", "C40",
  ],
  "Outro": ["Outro"],
};

const MARCAS = Object.keys(MARCAS_MODELOS).sort();
const COMBUSTIVEIS = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido"];

/* ─── Helpers ─────────────────────────────────────────────────────── */

// Formata KM: "85000" → "85.000"
function formatKm(value: string): string {
  const nums = value.replace(/\D/g, "");
  return nums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Remove formatação para salvar: "85.000" → 85000
function parseKm(value: string): number {
  return parseInt(value.replace(/\./g, ""), 10) || 0;
}

// Formata placa: aceita apenas letras maiúsculas e números
function formatPlaca(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
}

/* ─── Tipo do formulário ──────────────────────────────────────────── */
interface FormVeiculo {
  nome_apelido: string;
  marca:        string;
  modelo:       string;
  ano:          string;
  placa:        string;
  vin:          string;
  combustivel:  string;
  quilometragem: string; // formatado com pontos
}

const initialForm: FormVeiculo = {
  nome_apelido:  "",
  marca:         "",
  modelo:        "",
  ano:           "",
  placa:         "",
  vin:           "",
  combustivel:   "Flex",
  quilometragem: "",
};

/* ─── Componente Select estilizado ───────────────────────────────── */
function SelectField({
  id, label, value, onChange, options, placeholder, disabled, icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {icon && <span className="inline mr-1 opacity-60">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`input-field appearance-none pr-9 cursor-pointer ${
            !value ? "text-gray-400" : "text-gray-800"
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm]       = useState<FormVeiculo>(initialForm);
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");

  /* Modelos filtrados pela marca selecionada */
  const modelosDisponiveis = useMemo(
    () => (form.marca ? MARCAS_MODELOS[form.marca] ?? [] : []),
    [form.marca]
  );

  /* ── Handlers ── */
  const setField = (field: keyof FormVeiculo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErro("");
  };

  const handleMarcaChange = (marca: string) => {
    // Ao trocar a marca, limpa o modelo para forçar nova seleção
    setForm((prev) => ({ ...prev, marca, modelo: "" }));
    setErro("");
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("placa", formatPlaca(e.target.value));
  };

  const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setField("quilometragem", formatKm(e.target.value));
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!form.marca || !form.modelo || !form.ano || !form.placa) {
      setErro("Preencha ao menos marca, modelo, ano e placa.");
      return;
    }
    if (form.ano.length !== 4 || isNaN(Number(form.ano))) {
      setErro("Ano inválido.");
      return;
    }
    if (form.placa.length < 7) {
      setErro("Placa inválida — mínimo 7 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { error } = await supabase.from("veiculo").insert({
        id_usuario:          user.id,
        nome_apelido:        form.nome_apelido || `${form.marca} ${form.modelo}`,
        marca:               form.marca,
        modelo:              form.modelo,
        ano:                 Number(form.ano),
        placa:               form.placa,
        vin:                 form.vin || null,
        combustivel:         form.combustivel,
        quilometragem_atual: parseKm(form.quilometragem),
      });

      if (error) throw new Error(error.message);

      router.push("/dashboard");
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar veículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* Header */}
      <header className="bg-primary py-4 px-6 flex items-center gap-3">
        <Image src="/img/logo_wealthcar.png" alt="Logo" width={36} height={36} className="h-8 w-auto" />
        <span className="text-white font-bold text-lg">Wealth Car</span>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-lg px-8 py-10">

          {/* Título */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastre seu veículo</h1>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Para começar a monitorar seu carro, precisamos de algumas informações básicas.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Apelido */}
            <div>
              <label className="label" htmlFor="nome_apelido">
                Apelido <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="nome_apelido"
                type="text"
                placeholder='Ex: "Meu Lancer", "Carro da Família"'
                value={form.nome_apelido}
                onChange={(e) => setField("nome_apelido", e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Marca */}
            <SelectField
              id="marca"
              label="Marca *"
              value={form.marca}
              onChange={handleMarcaChange}
              options={MARCAS}
              placeholder="Selecione a marca"
              disabled={loading}
            />

            {/* Modelo — só habilita após escolher marca */}
            <div>
              <label className="label" htmlFor="modelo">Modelo *</label>
              <div className="relative">
                <select
                  id="modelo"
                  value={form.modelo}
                  onChange={(e) => setField("modelo", e.target.value)}
                  disabled={loading || !form.marca}
                  className={`input-field appearance-none pr-9 cursor-pointer ${
                    !form.modelo ? "text-gray-400" : "text-gray-800"
                  } ${!form.marca ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="" disabled>
                    {form.marca ? "Selecione o modelo" : "Selecione a marca primeiro"}
                  </option>
                  {modelosDisponiveis.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Ano + Placa */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="ano">
                  <Calendar size={13} className="inline mr-1 opacity-60" />
                  Ano *
                </label>
                <input
                  id="ano"
                  type="number"
                  placeholder="Ex: 2014"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={form.ano}
                  onChange={(e) => setField("ano", e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="label" htmlFor="placa">
                  <Hash size={13} className="inline mr-1 opacity-60" />
                  Placa *
                </label>
                <input
                  id="placa"
                  type="text"
                  placeholder="ABC1D23"
                  maxLength={8}
                  value={form.placa}
                  onChange={handlePlacaChange}
                  className="input-field uppercase tracking-widest font-mono"
                  disabled={loading}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Somente letras maiúsculas e números
                </p>
              </div>
            </div>

            {/* Combustível */}
            <SelectField
              id="combustivel"
              label="Combustível"
              value={form.combustivel}
              onChange={(v) => setField("combustivel", v)}
              options={COMBUSTIVEIS}
              placeholder="Selecione o combustível"
              disabled={loading}
              icon={<Fuel size={13} />}
            />

            {/* Quilometragem */}
            <div>
              <label className="label" htmlFor="quilometragem">
                <Gauge size={13} className="inline mr-1 opacity-60" />
                Quilometragem atual
              </label>
              <div className="relative">
                <input
                  id="quilometragem"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={form.quilometragem}
                  onChange={handleKmChange}
                  className="input-field pr-10"
                  disabled={loading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                  km
                </span>
              </div>
              {form.quilometragem && (
                <p className="text-[11px] text-gray-400 mt-1">
                  {parseKm(form.quilometragem).toLocaleString("pt-BR")} km registrados
                </p>
              )}
            </div>

            {/* VIN (opcional) */}
            <div>
              <label className="label" htmlFor="vin">
                Chassi / VIN{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="vin"
                type="text"
                placeholder="17 caracteres"
                maxLength={17}
                value={form.vin}
                onChange={(e) => setField("vin", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className="input-field uppercase font-mono tracking-wider"
                disabled={loading}
              />
            </div>

            {/* Erro */}
            {erro && (
              <p className="text-red-600 text-xs font-medium text-center">{erro}</p>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Ir para o Dashboard
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-primary py-3 text-center">
        <p className="text-white/50 text-xs">© 2026 Wealth Car. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
