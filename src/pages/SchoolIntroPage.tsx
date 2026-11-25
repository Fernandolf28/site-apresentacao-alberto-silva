import { useState } from 'react';
import { ArrowRight, School } from 'lucide-react';
import { AppRoute, Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface SchoolIntroPageProps {
  onNavigate: (route: AppRoute, anchorId?: string) => void;
  onStartStudy?: () => void;
  isFrozen?: boolean;
}

const SCHOOL_IMAGE_PATH =
  '/assets/aistudio/WhatsApp_Image_2026-11-23_at_10.41.27_192c16f4.jpeg';

export function SchoolIntroPage({
  onNavigate,
  onStartStudy,
  isFrozen = false,
}: SchoolIntroPageProps) {
  const [imgError, setImgError] = useState(false);

  const handleStudyClick = () => {
    if (onStartStudy) {
      onStartStudy();
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F2FF] text-black">
      <Navbar activeRoute="conheca" onNavigate={onNavigate} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
        {/* Título em forma de arco em cima da imagem */}
        <div className="w-full max-w-[540px] mb-1">
          <h1 className="sr-only">Conheça Nossa Escola</h1>
          <svg
            viewBox="0 0 600 125"
            className="w-full h-auto overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <path id="school-title-arch" d="M 35,112 Q 300,12 565,112" />
            </defs>
            <text
              fill="#000000"
              fontSize="40"
              fontWeight="700"
              letterSpacing="-0.5"
              fontFamily="Plus Jakarta Sans, Arial, Helvetica, sans-serif"
            >
              <textPath
                href="#school-title-arch"
                startOffset="50%"
                textAnchor="middle"
              >
                Conheça Nossa Escola
              </textPath>
            </text>
          </svg>
        </div>

        {/* Imagem da escola */}
        <div
          className="w-full max-w-[440px] aspect-[16/10] rounded-[12px] border-2 border-black overflow-hidden bg-[#FFFDF0] animate-school-tremble"
          style={isFrozen ? { animationPlayState: 'paused' } : undefined}
        >
          {!imgError ? (
            <img
              src={SCHOOL_IMAGE_PATH}
              alt="Fachada do CETI Gov. Alberto Tavares Silva"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-[#FFFDF0] text-neutral-800">
              <School className="w-14 h-14 text-black" aria-hidden="true" />
              <p className="text-base font-bold">
                CETI Gov. Alberto Tavares Silva
              </p>
            </div>
          )}
        </div>

        {/* Nome da escola em baixo da imagem */}
        <h2 className="mt-7 text-[26px] sm:text-[34px] md:text-[38px] font-bold tracking-tight text-black text-balance">
          CETI Gov. Alberto Tavares Silva
        </h2>

        {/* Slogan em baixo do nome */}
        <p className="mt-2.5 text-lg sm:text-xl md:text-2xl font-medium text-neutral-800 max-w-2xl text-balance">
          Educação e tecnologia transformando o futuro
        </p>

        {/* Botão azul em baixo do slogan */}
        <div className="mt-7">
          <button
            type="button"
            onClick={handleStudyClick}
            disabled={isFrozen}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-lg font-bold text-white bg-[#0038FF] border-2 border-black rounded-[8px] hover:brightness-110 active:translate-y-[1px] transition cursor-pointer whitespace-nowrap disabled:cursor-default"
          >
            <span>Vamos Estudar</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
