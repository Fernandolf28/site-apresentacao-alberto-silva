import { SectionId } from '../data/sections';

interface SectionIllustrationProps {
  sectionId: SectionId;
}

export function SectionIllustration({ sectionId }: SectionIllustrationProps) {
  switch (sectionId) {
    case 'direcao':
      return (
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Ilustração da Direção Escolar"
        >
          <rect width="400" height="280" fill="#FFFDF0" />
          <rect x="30" y="190" width="340" height="60" rx="6" fill="#FF3131" stroke="#000" strokeWidth="3" />
          <rect x="65" y="130" width="270" height="60" rx="6" fill="#FFDE00" stroke="#000" strokeWidth="3" />
          <circle cx="200" cy="82" r="34" fill="#17A700" stroke="#000" strokeWidth="3" />
          <path d="M185 82 L197 94 L217 70" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="90" y="150" width="90" height="18" rx="4" fill="#FFFDF0" stroke="#000" strokeWidth="2.5" />
          <rect x="220" y="150" width="90" height="18" rx="4" fill="#FFFDF0" stroke="#000" strokeWidth="2.5" />
          <line x1="60" y1="220" x2="340" y2="220" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'coordenacao':
      return (
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Ilustração da Coordenação Pedagógica"
        >
          <rect width="400" height="280" fill="#FFFDF0" />
          <rect x="55" y="50" width="135" height="175" rx="8" fill="#FFDE00" stroke="#000" strokeWidth="3" />
          <rect x="210" y="50" width="135" height="175" rx="8" fill="#17A700" stroke="#000" strokeWidth="3" />
          <line x1="80" y1="90" x2="165" y2="90" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="80" y1="120" x2="155" y2="120" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="80" y1="150" x2="165" y2="150" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="80" y1="180" x2="140" y2="180" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="277" cy="115" r="32" fill="#FFFCC1" stroke="#000" strokeWidth="3" />
          <path d="M262 175 C262 155 292 155 292 175" fill="#FFFCC1" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          <line x1="235" y1="195" x2="320" y2="195" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'gremio':
      return (
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Ilustração do Grêmio Estudantil"
        >
          <rect width="400" height="280" fill="#FFFDF0" />
          <circle cx="120" cy="110" r="32" fill="#FFDE00" stroke="#000" strokeWidth="3" />
          <path d="M75 215 C75 168 165 168 165 215 Z" fill="#FF3131" stroke="#000" strokeWidth="3" />
          <circle cx="280" cy="110" r="32" fill="#17A700" stroke="#000" strokeWidth="3" />
          <path d="M235 215 C235 168 325 168 325 215 Z" fill="#FFDE00" stroke="#000" strokeWidth="3" />
          <circle cx="200" cy="92" r="36" fill="#0038FF" stroke="#000" strokeWidth="3" />
          <path d="M148 225 C148 168 252 168 252 225 Z" fill="#0038FF" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case 'organizacao-seguranca':
      return (
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Ilustração da Organização e Segurança da Escola"
        >
          <rect width="400" height="280" fill="#FFFDF0" />
          <path
            d="M200 38 L300 76 V145 C300 198 258 232 200 248 C142 232 100 198 100 145 V76 Z"
            fill="#17A700"
            stroke="#000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M200 62 L276 91 V142 C276 183 244 210 200 223 C156 210 124 183 124 142 V91 Z"
            fill="#FFDE00"
            stroke="#000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M170 142 L192 164 L234 116"
            fill="none"
            stroke="#000"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
