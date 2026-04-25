"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";

/* ── Regras de senha ─────────────────────────────────────────────── */
interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const passwordRules: Rule[] = [
  { label: "Mínimo de 8 caracteres", test: (v) => v.length >= 8 },
  { label: "Pelo menos um número", test: (v) => /\d/.test(v) },
  { label: "Pelo menos uma letra maiúscula", test: (v) => /[A-Z]/.test(v) },
  {
    label: "Caractere especial (@, #, !, etc.)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
  {
    label: "Não conter informações pessoais (aniversário, nomes de parentes, etc.)",
    test: (_v) => true, // validação humana
  },
];

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmar: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    if (e.target.name === "senha") setTouched(true);
  };

  const allRulesPassed = passwordRules.every((r) => r.test(form.senha));
  const passwordsMatch = form.senha === form.confirmar && form.confirmar !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.usuario || !form.email || !form.senha || !form.confirmar) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!allRulesPassed) {
      setError("A senha não atende aos requisitos de segurança.");
      return;
    }
    if (!passwordsMatch) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // TODO: Substituir pelo endpoint real da API
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     username: form.usuario,
      //     email: form.email,
      //     password: form.senha,
      //   }),
      // });
      // if (!res.ok) {
      //   const data = await res.json();
      //   throw new Error(data.message || "Erro ao criar conta.");
      // }

      await new Promise((r) => setTimeout(r, 1400));
      
      // Salva o usuário no localStorage para simular uma sessão
      localStorage.setItem("usuario", form.usuario);
      
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-96px)] bg-surface flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-md w-full max-w-sm px-8 py-9">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-7">Cadastro</h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Usuário */}
            <div>
              <label className="label" htmlFor="usuario">Usuário</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ex: Nicolas"
                autoComplete="username"
                value={form.usuario}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Ex: Exemplo@gmail.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="label" htmlFor="senha">Senha:</label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Regras de senha */}
              {(touched || form.senha) && (
                <ul className="mt-2 space-y-1 text-xs">
                  {passwordRules.map((rule, i) => {
                    const ok = rule.test(form.senha);
                    return (
                      <li
                        key={i}
                        className={`flex items-start gap-1.5 ${ok ? "text-green-600" : "text-gray-400"}`}
                      >
                        {ok ? (
                          <Check size={12} className="mt-0.5 flex-shrink-0" />
                        ) : (
                          <X size={12} className="mt-0.5 flex-shrink-0" />
                        )}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Requisitos estáticos (como no PDF) caso senha ainda não foi tocada */}
              {!touched && !form.senha && (
                <div className="mt-2 text-[11px] text-gray-400 leading-relaxed">
                  <p>Para a segurança da sua conta, a senha criada deverá ter:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Números</li>
                    <li>Caracteres especiais (@, #, etc.)</li>
                    <li>Não conter informações pessoais</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="label" htmlFor="confirmar">Confirmar Senha:</label>
              <div className="relative">
                <input
                  id="confirmar"
                  name="confirmar"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={form.confirmar}
                  onChange={handleChange}
                  className={`input-field pr-10 ${
                    form.confirmar
                      ? passwordsMatch
                        ? "border-green-400 focus:ring-green-400"
                        : "border-red-400 focus:ring-red-400"
                      : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmar && !passwordsMatch && (
                <p className="text-red-500 text-xs mt-1">As senhas não coincidem.</p>
              )}
              {form.confirmar && passwordsMatch && (
                <p className="text-green-600 text-xs mt-1">Senhas coincidem ✓</p>
              )}
            </div>

            {/* Erro geral */}
            {error && (
              <p className="text-red-600 text-xs font-medium text-center">{error}</p>
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
                  Criando conta...
                </>
              ) : (
                "Cadastrar"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-brand font-medium hover:underline">
              Entre já!
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
