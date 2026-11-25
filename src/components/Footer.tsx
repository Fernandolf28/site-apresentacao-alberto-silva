import { AppRoute } from './Navbar';

interface FooterProps {
  onNavigate: (route: AppRoute, anchorId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      id="rodape"
      className="w-full bg-[#FFFDF0] border-t-2 border-black mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-black">
            CETI Gov. Alberto Tavares Silva
          </h2>
          <p className="text-sm text-neutral-800 leading-relaxed max-w-[36ch]">
            Educação e tecnologia transformando o futuro. Espaço institucional
            dedicado à divulgação das equipes escolares, atividades e projetos.
          </p>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-black">Navegação</h3>
          <ul className="space-y-2 text-sm text-neutral-800">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('conheca')}
                className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
              >
                Conheça Nossa Escola
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('apresentacao')}
                className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
              >
                Nossa Apresentação
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home', 'informacoes')}
                className="hover:text-black hover:underline underline-offset-4 cursor-pointer"
              >
                Sessões de Informações
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-black">Administração</h3>
          <p className="text-sm text-neutral-800 leading-relaxed">
            Gestão de integrantes, fotos e conteúdos do portal escolar.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center px-4 py-2 text-sm font-bold text-black bg-[#FFDE00] border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer"
            >
              Acessar Login Administrativo
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-700">
          <span>CETI Gov. Alberto Tavares Silva · Portal Escolar</span>
          <span>Educação e tecnologia transformando o futuro</span>
        </div>
      </div>
    </footer>
  );
}
