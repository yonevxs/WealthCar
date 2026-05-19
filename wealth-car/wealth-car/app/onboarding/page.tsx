"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Car, Loader2, ChevronRight, Fuel, Hash, Calendar, Gauge } from "lucide-react";

/* ─── Opções de combustível ───────────────────────────────────────── */
const combustiveis = ["Gasolina", "Etanol", "Flex", "Diesel", "Elétrico", "Híbrido"];

/* ─── Tipo do formulário ──────────────────────────────────────────── */
interface FormVeiculo {
  nome_apelido:        string;
  marca:               string;
  modelo:              string;
  ano:                 string;
  placa:               string;
  vin:                 string;
  combustivel:         string;
  quilometragem_atual: string;
}

const initialForm: FormVeiculo = {
  nome_apelido:        "",
  marca:               "",
  modelo:              "",
  ano:                 "",
  placa:               "",
  vin:                 "",
  combustivel:         "Flex",
  quilometragem_atual: "0",
};

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm]       = useState<FormVeiculo>(initialForm);
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validações obrigatórias
    if (!form.marca || !form.modelo || !form.ano || !form.placa) {
      setErro("Preencha ao menos marca, modelo, ano e placa.");
      return;
    }
    if (isNaN(Number(form.ano)) || form.ano.length !== 4) {
      setErro("Ano inválido.");
      return;
    }

    setLoading(true);
    try {
      // Pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Insere o veículo no banco
      const { error } = await supabase.from("veiculo").insert({
        id_usuario:          user.id,
        nome_apelido:        form.nome_apelido || `${form.marca} ${form.modelo}`,
        marca:               form.marca,
        modelo:              form.modelo,
        ano:                 Number(form.ano),
        placa:               form.placa.toUpperCase(),
        vin:                 form.vin || null,
        combustivel:         form.combustivel,
        quilometragem_atual: Number(form.quilometragem_atual) || 0,
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

      {/* ── Header simples ── */}
      <header className="bg-primary py-4 px-6 flex items-center gap-3">
        <Image
          src="/img/logo_wealthcar.png"
          alt="Logo"
          width={36}
          height={36}
          className="h-8 w-auto"
        />
        <span className="text-white font-bold text-lg">Wealth Car</span>
      </header>

      {/* ── Conteúdo ── */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-lg px-8 py-10">

          {/* Ícone + título */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cadastre seu veículo
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Para começar a monitorar seu carro, precisamos de algumas informações básicas.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Apelido */}
            <div>
              <label className="label" htmlFor="nome_apelido">
                Apelido do veículo <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="nome_apelido"
                name="nome_apelido"
                type="text"
                placeholder='Ex: "Meu Lancer", "Carro da Família"'
                value={form.nome_apelido}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Marca + Modelo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="marca">Marca *</label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  placeholder="Ex: Mitsubishi"
                  value={form.marca}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="label" htmlFor="modelo">Modelo *</label>
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  placeholder="Ex: Lancer Evolution"
                  value={form.modelo}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ano + Placa */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="ano">
                  <Calendar className="inline w-3.5 h-3.5 mr-1 opacity-60" />
                  Ano *
                </label>
                <input
                  id="ano"
                  name="ano"
                  type="number"
                  placeholder="Ex: 2014"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={form.ano}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="label" htmlFor="placa">
                  <Hash className="inline w-3.5 h-3.5 mr-1 opacity-60" />
                  Placa *
                </label>
                <input
                  id="placa"
                  name="placa"
                  type="text"
                  placeholder="Ex: ABC1D23"
                  maxLength={8}
                  value={form.placa}
                  onChange={handleChange}
                  className="input-field uppercase"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Combustível */}
            <div>
              <label className="label" htmlFor="combustivel">
                <Fuel className="inline w-3.5 h-3.5 mr-1 opacity-60" />
                Combustível
              </label>
              <select
                id="combustivel"
                name="combustivel"
                value={form.combustivel}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              >
                {combustiveis.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quilometragem */}
            <div>
              <label className="label" htmlFor="quilometragem_atual">
                <Gauge className="inline w-3.5 h-3.5 mr-1 opacity-60" />
                Quilometragem atual (km)
              </label>
              <input
                id="quilometragem_atual"
                name="quilometragem_atual"
                type="number"
                placeholder="Ex: 85000"
                min="0"
                value={form.quilometragem_atual}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* VIN (opcional) */}
            <div>
              <label className="label" htmlFor="vin">
                Chassi / VIN{" "}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="vin"
                name="vin"
                type="text"
                placeholder="17 caracteres (ex: 9BWZZZ377VT004251)"
                maxLength={17}
                value={form.vin}
                onChange={handleChange}
                className="input-field uppercase"
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

      {/* Footer */}
      <footer className="bg-primary py-3 text-center">
        <p className="text-white/50 text-xs">
          © 2026 Wealth Car. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
}