import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400 py-10 px-6 text-center">
      <div className="mb-6 flex justify-center items-center gap-3 text-white text-xl font-bold opacity-80">
        <Image
          src="/img/logo_wealthcar.png"
          alt="Logo Wealth Car"
          width={24}
          height={24}
          className="h-6 w-auto"
        />
        <span>Wealth Car</span>
      </div>
      <p className="text-sm font-medium">© 2026 Wealth Car. Todos os direitos reservados.</p>
      <div className="mt-4 space-x-4 text-sm">
        <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
        <span className="opacity-50">|</span>
        <Link href="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
      </div>
    </footer>
  );
}
