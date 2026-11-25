import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { AppRoute } from '../components/Navbar';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'adm2' && password === '2611') {
      setErrorMsg(null);
      onLoginSuccess();
    } else {
      setErrorMsg(
        'Usuário ou senha incorretos. Confira as credenciais e tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCC1] flex flex-col justify-between px-4 py-8">
      <div className="max-w-md w-full mx-auto">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-black bg-[#FFFDF0] border-2 border-black rounded-[6px] hover:bg-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar para a Página Inicial</span>
        </button>
      </div>

      <main className="max-w-md w-full mx-auto my-8 bg-[#FFFDF0] border-2 border-black rounded-[10px] overflow-hidden">
        <div className="bg-[#17A700] border-b-2 border-black px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] border-2 border-black bg-[#FFFDF0] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-black" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">
              Acesso Administrativo
            </h1>
            <p className="text-sm text-black/85">
              Entre para gerenciar equipes e conteúdos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 text-sm font-medium text-black bg-[#FF3131]/15 border-2 border-black rounded-[6px]"
            >
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-bold text-black mb-1.5"
            >
              Usuário
            </label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o usuário"
              className="w-full px-3.5 py-2.5 text-base text-black bg-white border-2 border-black rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-bold text-black mb-1.5"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-3.5 py-2.5 pr-11 text-base text-black bg-white border-2 border-black rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-700 hover:text-black cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-base font-bold text-black bg-[#FFDE00] border-2 border-black rounded-[8px] hover:brightness-95 transition cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </main>

      <div className="text-center text-xs text-neutral-700">
        Portal Escolar · Área Administrativa
      </div>
    </div>
  );
}
