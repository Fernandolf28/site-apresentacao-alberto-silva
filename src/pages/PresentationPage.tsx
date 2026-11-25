import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SCHOOL_SECTIONS, SectionId } from '../data/sections';
import { MembersBySection } from '../store/schoolStore';
import { DropdownBand } from '../components/DropdownBand';
import { AppRoute } from '../components/Navbar';

interface PresentationPageProps {
  membersBySection: MembersBySection;
  onNavigate: (route: AppRoute) => void;
}

export function PresentationPage({
  membersBySection,
  onNavigate,
}: PresentationPageProps) {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    direcao: false,
    coordenacao: false,
    gremio: false,
    'organizacao-seguranca': false,
  });

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFCC1] pb-12">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between bg-[#FFFCC1]">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-black bg-[#FFFDF0] border-2 border-black rounded-[6px] hover:bg-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar para a Home</span>
        </button>
      </div>

      <main className="flex flex-col gap-[1px]">
        {/* Faixa Verde (Cabeçalho idêntico à referência) */}
        <header className="w-full min-h-[150px] bg-[#17A700] text-black border-2 border-black rounded-tr-[10px] rounded-br-[10px] flex items-center justify-center px-6 py-4 text-center">
          <h1 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold leading-tight text-balance">
            Agora Nossa Apresentação
          </h1>
        </header>

        {/* Faixas em Dropdown recebendo os dados do Painel Administrativo */}
        {SCHOOL_SECTIONS.map((section) => (
          <DropdownBand
            key={section.id}
            section={section}
            members={membersBySection[section.id] ?? []}
            isOpen={openSections[section.id]}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </main>
    </div>
  );
}
