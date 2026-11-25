import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type AppRoute = 'conheca' | 'home' | 'apresentacao' | 'login' | 'admin';

interface NavbarProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute, anchorId?: string) => void;
}

export function Navbar({ activeRoute, onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (route: AppRoute, anchorId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(route, anchorId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF0] border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-8">
        {/* Zona 1: Brand Title */}
        <button
          type="button"
          onClick={() => handleLinkClick('conheca')}
          className="text-base sm:text-lg font-bold tracking-tight text-black whitespace-nowrap shrink-0 cursor-pointer hover:underline underline-offset-4"
        >
          CETI Gov. Alberto Tavares Silva
        </button>

        {/* Zona 2: Links de navegação */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-neutral-800"
        >
          <button
            type="button"
            onClick={() => handleLinkClick('conheca')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-black hover:underline underline-offset-4 ${
              activeRoute === 'conheca' ? 'text-black underline' : ''
            }`}
          >
            Conheça Nossa Escola
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-black hover:underline underline-offset-4 ${
              activeRoute === 'home' ? 'text-black underline' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'informacoes')}
            className="whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-black hover:underline underline-offset-4"
          >
            Informações
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'rodape')}
            className="whitespace-nowrap shrink-0 cursor-pointer transition-colors hover:text-black hover:underline underline-offset-4"
          >
            Contato
          </button>
        </nav>

        {/* Zona 3: Ação principal + botão mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('apresentacao')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-black bg-[#17A700] border-2 border-black rounded-[8px] hover:brightness-95 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            Nossa Apresentação
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-[6px] text-black cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-[#FFFCC1] px-4 py-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleLinkClick('conheca')}
            className="text-left px-3 py-2 text-base font-semibold text-black hover:bg-[#FFFDF0] rounded-[6px] cursor-pointer"
          >
            Conheça Nossa Escola
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="text-left px-3 py-2 text-base font-semibold text-black hover:bg-[#FFFDF0] rounded-[6px] cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('apresentacao')}
            className="text-left px-3 py-2 text-base font-semibold text-black hover:bg-[#FFFDF0] rounded-[6px] cursor-pointer"
          >
            Nossa Apresentação
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'informacoes')}
            className="text-left px-3 py-2 text-base font-semibold text-black hover:bg-[#FFFDF0] rounded-[6px] cursor-pointer"
          >
            Informações
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('home', 'rodape')}
            className="text-left px-3 py-2 text-base font-semibold text-black hover:bg-[#FFFDF0] rounded-[6px] cursor-pointer"
          >
            Contato
          </button>
        </div>
      )}
    </header>
  );
}
