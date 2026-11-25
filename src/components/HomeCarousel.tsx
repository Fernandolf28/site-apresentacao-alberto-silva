import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { CarouselSlide } from '../data/sections';

interface HomeCarouselProps {
  slides: CarouselSlide[];
}

function SlideScene({ theme }: { theme: CarouselSlide['theme'] }) {
  switch (theme) {
    case 'campus':
      return (
        <svg
          viewBox="0 0 1200 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Ilustração do prédio escolar"
        >
          <rect width="1200" height="540" fill="#FFFCC1" />
          <circle cx="980" cy="115" r="58" fill="#FFDE00" stroke="#000" strokeWidth="4" />
          <rect x="0" y="405" width="1200" height="135" fill="#17A700" stroke="#000" strokeWidth="4" />
          <rect x="210" y="175" width="780" height="230" rx="8" fill="#FFFDF0" stroke="#000" strokeWidth="4" />
          <rect x="465" y="115" width="270" height="60" rx="6" fill="#FF3131" stroke="#000" strokeWidth="4" />
          <rect x="555" y="275" width="90" height="130" fill="#0038FF" stroke="#000" strokeWidth="4" />
          <rect x="265" y="220" width="95" height="80" rx="4" fill="#FFDE00" stroke="#000" strokeWidth="3.5" />
          <rect x="390" y="220" width="95" height="80" rx="4" fill="#FFDE00" stroke="#000" strokeWidth="3.5" />
          <rect x="715" y="220" width="95" height="80" rx="4" fill="#FFDE00" stroke="#000" strokeWidth="3.5" />
          <rect x="840" y="220" width="95" height="80" rx="4" fill="#FFDE00" stroke="#000" strokeWidth="3.5" />
          <circle cx="120" cy="315" r="52" fill="#17A700" stroke="#000" strokeWidth="4" />
          <rect x="111" y="365" width="18" height="40" fill="#000" />
          <circle cx="1080" cy="315" r="52" fill="#17A700" stroke="#000" strokeWidth="4" />
          <rect x="1071" y="365" width="18" height="40" fill="#000" />
        </svg>
      );
    case 'library':
      return (
        <svg
          viewBox="0 0 1200 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Ilustração de projetos pedagógicos e leitura"
        >
          <rect width="1200" height="540" fill="#FFFDF0" />
          <rect x="120" y="95" width="210" height="320" rx="8" fill="#FFDE00" stroke="#000" strokeWidth="4" />
          <rect x="360" y="70" width="220" height="345" rx="8" fill="#17A700" stroke="#000" strokeWidth="4" />
          <rect x="610" y="110" width="210" height="305" rx="8" fill="#0038FF" stroke="#000" strokeWidth="4" />
          <rect x="850" y="85" width="230" height="330" rx="8" fill="#FF3131" stroke="#000" strokeWidth="4" />
          <rect x="85" y="415" width="1030" height="36" rx="6" fill="#000" />
          <line x1="160" y1="160" x2="290" y2="160" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <line x1="160" y1="205" x2="265" y2="205" stroke="#000" strokeWidth="5" strokeLinecap="round" />
          <circle cx="470" cy="215" r="55" fill="#FFFCC1" stroke="#000" strokeWidth="4" />
          <rect x="655" y="170" width="120" height="80" rx="6" fill="#FFFCC1" stroke="#000" strokeWidth="4" />
          <circle cx="965" cy="230" r="50" fill="#FFDE00" stroke="#000" strokeWidth="4" />
        </svg>
      );
    case 'sports':
      return (
        <svg
          viewBox="0 0 1200 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Ilustração de esportes, cultura e grêmio estudantil"
        >
          <rect width="1200" height="540" fill="#FFFCC1" />
          <rect x="140" y="95" width="920" height="340" rx="12" fill="#0038FF" stroke="#000" strokeWidth="4" />
          <line x1="600" y1="95" x2="600" y2="435" stroke="#FFFCC1" strokeWidth="4" />
          <circle cx="600" cy="265" r="78" fill="none" stroke="#FFFCC1" strokeWidth="4" />
          <rect x="140" y="185" width="110" height="160" fill="none" stroke="#FFFCC1" strokeWidth="4" />
          <rect x="950" y="185" width="110" height="160" fill="none" stroke="#FFFCC1" strokeWidth="4" />
          <circle cx="420" cy="210" r="38" fill="#FFDE00" stroke="#000" strokeWidth="4" />
          <circle cx="780" cy="310" r="38" fill="#FF3131" stroke="#000" strokeWidth="4" />
          <circle cx="600" cy="265" r="22" fill="#17A700" stroke="#000" strokeWidth="4" />
        </svg>
      );
    case 'community':
      return (
        <svg
          viewBox="0 0 1200 540"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="Ilustração de ambiente seguro e acolhedor"
        >
          <rect width="1200" height="540" fill="#FFFDF0" />
          <path
            d="M600 65 L790 138 V265 C790 365 710 432 600 468 C490 432 410 365 410 265 V138 Z"
            fill="#17A700"
            stroke="#000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M600 108 L748 165 V262 C748 338 684 392 600 420 C516 392 452 338 452 262 V165 Z"
            fill="#FFDE00"
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M540 262 L582 304 L665 214"
            fill="none"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="240" cy="260" r="65" fill="#FF3131" stroke="#000" strokeWidth="4" />
          <circle cx="960" cy="260" r="65" fill="#0038FF" stroke="#000" strokeWidth="4" />
        </svg>
      );
  }
}

function SlideVisual({ slide }: { slide: CarouselSlide }) {
  return (
    <div className="relative w-full h-full bg-[#FFFDF0]">
      {slide.imageDataUrl ? (
        <img
          src={slide.imageDataUrl}
          alt={slide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <SlideScene theme={slide.theme} />
      )}
      {/* Scrim de contraste para legibilidade do texto sobre a página */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
      {/* Vinco de lombada à esquerda para efeito de página de livro */}
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none" />
      {/* Texto da página */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 pr-5 sm:pr-44">
        <div className="max-w-2xl space-y-2 text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {slide.title}
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {slide.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeCarousel({ slides }: HomeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [turningState, setTurningState] = useState<{
    fromIndex: number;
    toIndex: number;
    direction: 'next' | 'prev';
    flipKey: number;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const flipTimerRef = useRef<number | null>(null);

  const safeIndex = slides.length > 0 ? currentIndex % slides.length : 0;
  const activeSlide = slides[safeIndex];

  const triggerTurn = useCallback(
    (targetIndex: number, direction: 'next' | 'prev') => {
      if (slides.length <= 1) return;
      const normalizedTarget =
        ((targetIndex % slides.length) + slides.length) % slides.length;
      if (normalizedTarget === safeIndex) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setTurningState(null);
        setCurrentIndex(normalizedTarget);
        return;
      }

      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
      }

      const prevIdx = safeIndex;
      setCurrentIndex(normalizedTarget);
      setTurningState({
        fromIndex: prevIdx,
        toIndex: normalizedTarget,
        direction,
        flipKey: Date.now(),
      });

      flipTimerRef.current = window.setTimeout(() => {
        setTurningState(null);
        flipTimerRef.current = null;
      }, 720);
    },
    [safeIndex, slides.length]
  );

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      triggerTurn(safeIndex + 1, 'next');
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused, safeIndex, slides.length, triggerTurn]);

  if (!activeSlide) {
    return null;
  }

  const goPrev = () => {
    triggerTurn(safeIndex - 1, 'prev');
  };

  const goNext = () => {
    triggerTurn(safeIndex + 1, 'next');
  };

  const goToIndex = (idx: number) => {
    if (idx === safeIndex) return;
    triggerTurn(idx, idx > safeIndex ? 'next' : 'prev');
  };

  // Quando avançando ('next'): a nova página fica por baixo e a anterior gira de 0° até -180° para a esquerda.
  // Quando voltando ('prev'): a página anterior fica por baixo e a nova página volta girando de -180° até 0° da esquerda para a direita.
  const baseSlide =
    turningState && turningState.direction === 'prev'
      ? slides[turningState.fromIndex % slides.length] ?? activeSlide
      : activeSlide;

  const flippingSlide = turningState
    ? turningState.direction === 'next'
      ? slides[turningState.fromIndex % slides.length]
      : slides[turningState.toIndex % slides.length]
    : null;

  return (
    <section aria-label="Galeria de destaques da escola" className="w-full">
      <div
        className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] border-2 border-black rounded-[10px] overflow-hidden bg-[#FFFDF0]"
        style={{ perspective: '1800px' }}
      >
        {/* Página base por baixo */}
        <div className="absolute inset-0 z-10">
          <SlideVisual slide={baseSlide} />
        </div>

        {/* Folha do livro virando em 3D */}
        {turningState && flippingSlide && (
          <motion.div
            key={turningState.flipKey}
            initial={{
              rotateY: turningState.direction === 'next' ? 0 : -165,
            }}
            animate={{
              rotateY: turningState.direction === 'next' ? -165 : 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.32, 0.08, 0.24, 1],
            }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Frente da folha virando */}
            <div
              className="absolute inset-0 border-r-2 border-black/40 overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                boxShadow: '-8px 0 28px rgba(0, 0, 0, 0.28)',
              }}
            >
              <SlideVisual slide={flippingSlide} />
            </div>

            {/* Verso da folha (papel creme ao passar dos 90 graus) */}
            <div
              className="absolute inset-0 bg-[#FFFDF0] border-l-2 border-black/30"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* Controles do carrossel sempre acessíveis acima das páginas */}
        <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? 'Retomar carrossel' : 'Pausar carrossel'}
            className="w-10 h-10 inline-flex items-center justify-center bg-[#FFFDF0] text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer"
          >
            {isPaused ? (
              <Play className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Pause className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Página anterior"
            className="w-10 h-10 inline-flex items-center justify-center bg-[#FFFDF0] text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima página"
            className="w-10 h-10 inline-flex items-center justify-center bg-[#FFFDF0] text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Indicadores de página */}
      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToIndex(idx)}
                aria-label={`Ir para página ${idx + 1}: ${slide.title}`}
                aria-current={idx === safeIndex ? 'true' : undefined}
                className={`h-3 rounded-[4px] border-2 border-black transition-all cursor-pointer ${
                  idx === safeIndex
                    ? 'w-9 bg-black'
                    : 'w-4 bg-[#FFFDF0] hover:bg-[#FFDE00]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-neutral-800 tabular-nums">
            {String(safeIndex + 1).padStart(2, '0')} /{' '}
            {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
}
