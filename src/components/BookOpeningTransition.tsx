import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export type BookStage = 'distancing' | 'opening' | 'expanding';

interface BookOpeningTransitionProps {
  frontCover: React.ReactNode;
  nextPage: React.ReactNode;
  onComplete: () => void;
}

export function BookOpeningTransition({
  frontCover,
  nextPage,
  onComplete,
}: BookOpeningTransitionProps) {
  const [stage, setStage] = useState<BookStage>('distancing');

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const openTimer = window.setTimeout(() => {
      setStage('opening');
    }, 550);

    const expandTimer = window.setTimeout(() => {
      setStage('expanding');
    }, 1500);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 1950);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(expandTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const isBookSized = stage === 'distancing' || stage === 'opening';

  return (
    <div
      className="fixed inset-0 z-50 bg-[#181D27] overflow-hidden flex items-center justify-center pointer-events-none select-none"
      style={{ perspective: '2000px' }}
      aria-hidden="true"
    >
      {/* Container do livro que se distancia e depois expande na nova página */}
      <motion.div
        initial={{ scale: 1, borderRadius: '0px' }}
        animate={{
          scale: isBookSized ? 0.72 : 1,
          borderRadius: isBookSized ? '12px' : '0px',
        }}
        transition={{
          duration: stage === 'distancing' ? 0.52 : 0.42,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-screen h-screen"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Sombra e lombada externa do livro (visível quando distanciado) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isBookSized ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="absolute -inset-[6px] rounded-[14px] pointer-events-none"
          style={{
            boxShadow: '0 32px 70px rgba(0, 0, 0, 0.65)',
          }}
        />

        {/* Espessura lateral direita das páginas do livro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isBookSized ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-[6px] bottom-[6px] -right-[14px] w-[14px] rounded-r-[6px] border-2 border-l-0 border-black pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(90deg, #FFFDF0 0px, #FFFDF0 2px, #E5DEC0 2px, #E5DEC0 4px)',
          }}
        />

        {/* Próxima página (Home) dentro do livro */}
        <div
          className={`relative w-full h-full overflow-hidden bg-[#FFFCC1] ${
            isBookSized
              ? 'border-2 border-black rounded-r-[12px] rounded-l-[4px]'
              : ''
          }`}
        >
          {nextPage}

          {/* Vinco interno da lombada do livro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isBookSized ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none"
          />
        </div>

        {/* Capa do livro (página "Conheça Nossa Escola" congelada que gira para a esquerda) */}
        <motion.div
          initial={{ rotateY: 0, opacity: 1 }}
          animate={{
            rotateY: stage === 'opening' || stage === 'expanding' ? -155 : 0,
            opacity: stage === 'expanding' ? 0 : 1,
          }}
          transition={{
            rotateY: { duration: 0.92, ease: [0.32, 0.08, 0.24, 1] },
            opacity: { duration: 0.25 },
          }}
          className="absolute inset-0"
          style={{
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Frente da capa */}
          <div
            className={`absolute inset-0 overflow-hidden bg-[#E6F2FF] ${
              isBookSized
                ? 'border-2 border-black rounded-r-[12px] rounded-l-[4px]'
                : ''
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {frontCover}

            {/* Detalhe de lombada na esquerda da capa */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isBookSized ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/30 via-black/10 to-transparent border-r border-black/25 pointer-events-none"
            />
          </div>

          {/* Verso da capa quando o livro abre para a esquerda */}
          <div
            className="absolute inset-0 rounded-l-[12px] rounded-r-[4px] border-2 border-black bg-[#FFFDF0]"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
