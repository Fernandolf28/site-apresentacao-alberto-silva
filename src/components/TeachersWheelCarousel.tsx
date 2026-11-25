import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { TeacherMember } from '../data/sections';

interface TeachersWheelCarouselProps {
  teachers: TeacherMember[];
}

const AVATAR_BG_COLORS = [
  '#17A700',
  '#FFDE00',
  '#0038FF',
  '#FF3131',
  '#FFFCC1',
];

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Prof\.?|Profa\.?)\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let diff = index - activeIndex;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

export function TeachersWheelCarousel({
  teachers,
}: TeachersWheelCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (teachers.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-neutral-700 border-2 border-dashed border-black/30 rounded-[8px] bg-white">
        Nenhum professor cadastrado no momento.
      </div>
    );
  }

  const total = teachers.length;
  const safeIndex = ((activeIndex % total) + total) % total;
  const activeTeacher = teachers[safeIndex];

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Palco 3D em formato de roda */}
      <div
        className="relative w-full h-[270px] sm:h-[290px] overflow-hidden flex items-end justify-center pb-3 select-none"
        style={{ perspective: '1000px' }}
        aria-label="Roda de professores"
      >
        {teachers.map((teacher, idx) => {
          const offset = getCircularOffset(idx, safeIndex, total);
          const absOffset = Math.abs(offset);
          const isFront = offset === 0;

          // Posicionamento em arco circular 3D (frente embaixo, atrás subindo e recuando)
          let translateX = 0;
          let translateY = 0;
          let scale = 1;
          let rotateY = 0;
          let opacity = 1;
          let zIndex = 30;

          if (absOffset === 1) {
            translateX = offset * 135;
            translateY = -28;
            scale = 0.8;
            rotateY = offset * -18;
            opacity = 0.82;
            zIndex = 20;
          } else if (absOffset === 2) {
            translateX = offset * 95;
            translateY = -56;
            scale = 0.64;
            rotateY = offset * -28;
            opacity = 0.48;
            zIndex = 10;
          } else if (absOffset >= 3) {
            translateX = offset * 28;
            translateY = -74;
            scale = 0.54;
            rotateY = 0;
            opacity = 0.22;
            zIndex = 5;
          }

          const avatarBg = AVATAR_BG_COLORS[idx % AVATAR_BG_COLORS.length];
          const isBlueAvatar = avatarBg === '#0038FF';

          return (
            <motion.button
              key={teacher.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Selecionar ${teacher.name}`}
              aria-current={isFront ? 'true' : undefined}
              initial={false}
              animate={{
                x: translateX,
                y: translateY,
                scale,
                rotateY,
                opacity,
              }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ zIndex }}
              className={`absolute w-[230px] sm:w-[265px] rounded-[10px] border-2 border-black text-left p-4 cursor-pointer transition-shadow ${
                isFront
                  ? 'bg-[#FFFCC1] shadow-[0_12px_24px_rgba(0,0,0,0.22)]'
                  : 'bg-white shadow-[0_6px_14px_rgba(0,0,0,0.12)] hover:brightness-95'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-[8px] border-2 border-black overflow-hidden flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: teacher.photoDataUrl
                      ? '#FFFFFF'
                      : avatarBg,
                    color: isBlueAvatar ? '#FFFFFF' : '#000000',
                  }}
                >
                  {teacher.photoDataUrl ? (
                    <img
                      src={teacher.photoDataUrl}
                      alt={`Foto de ${teacher.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-bold flex items-center justify-center">
                      {getInitials(teacher.name) || (
                        <User className="w-6 h-6" />
                      )}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-black leading-snug line-clamp-2">
                    {teacher.name}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-0.5 truncate">
                    {teacher.subject}
                  </p>
                </div>
              </div>

              <p
                className={`mt-3 text-xs sm:text-sm leading-relaxed text-neutral-900 ${
                  isFront ? 'line-clamp-3' : 'line-clamp-2 opacity-75'
                }`}
              >
                {teacher.info}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Controles da roda */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-black/15">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-neutral-700 truncate">
            Em destaque: <span className="text-black">{activeTeacher.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-neutral-700 tabular-nums mr-1">
            {String(safeIndex + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Professor anterior"
            className="w-9 h-9 inline-flex items-center justify-center bg-white text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo professor"
            className="w-9 h-9 inline-flex items-center justify-center bg-white text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
