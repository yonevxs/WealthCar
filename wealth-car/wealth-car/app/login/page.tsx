"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.senha) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.senha,
      })
      if (error) throw new Error(error.message)

      // Verifica se já tem veículo cadastrado
      const { data: { user } } = await supabase.auth.getUser()
      const { data: veiculo }  = await supabase
        .from("veiculo")
        .select("id_veiculo")
        .eq("id_usuario", user!.id)
        .maybeSingle()

      // Primeira vez → onboarding | Já tem → dashboard
      router.push(veiculo ? "/dashboard" : "/onboarding")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-96px)] bg-surface flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-md w-full max-w-sm px-8 py-9">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-7">Login</h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="label" htmlFor="email">
                Usuário / Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Ex: Exemplo@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="label" htmlFor="senha">
                Senha:
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  className="input-field pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <p className="text-red-600 text-xs font-medium text-center">{error}</p>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                "Logar"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não possui uma conta?{" "}
            <Link
              href="/cadastro"
              className="text-brand font-medium hover:underline"
            >
              Cadastra-se!
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
