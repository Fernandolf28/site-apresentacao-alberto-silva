import { AnimatePresence, motion } from 'motion/react';
import { User } from 'lucide-react';
import { PersonMember, SchoolSectionConfig } from '../data/sections';
import { SectionIllustration } from './SectionIllustration';

interface DropdownBandProps {
  section: SchoolSectionConfig;
  members: PersonMember[];
  isOpen: boolean;
  onToggle: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DropdownBand({
  section,
  members,
  isOpen,
  onToggle,
}: DropdownBandProps) {
  const panelId = `dropdown-panel-${section.id}`;
  const isSingleDirecao = section.id === 'direcao' && members.length === 1;
  const singleMember = isSingleDirecao ? members[0] : null;

  return (
    <section className="flex flex-col">
      <div
        className={`${section.bandWidthClasses} rounded-tr-[10px] rounded-br-[10px] ${
          section.hasBandBorder
            ? 'border-2 border-black'
            : 'border-2 border-transparent hover:border-black/25'
        } transition-colors duration-150`}
        style={{
          backgroundColor: section.bandBg,
          color: section.bandText,
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`w-full min-h-[150px] px-5 sm:px-7 md:px-9 py-4 flex items-center justify-between gap-4 text-left cursor-pointer rounded-tr-[8px] rounded-br-[8px] focus-visible:outline-3 focus-visible:outline-offset-[-4px] ${
            section.bandText === '#FFFFFF'
              ? 'focus-visible:outline-white'
              : 'focus-visible:outline-black'
          }`}
        >
          <span className="text-[22px] sm:text-[26px] md:text-[30px] font-normal leading-tight tracking-tight flex items-center gap-3">
            <span>{section.buttonLabel}</span>
            <span
              aria-hidden="true"
              className={`inline-block transition-transform duration-200 ease-out ${
                isOpen ? 'rotate-90' : 'rotate-0'
              }`}
            >
              &gt;
            </span>
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-[2px] mr-3 sm:mr-6 md:mr-[10%] bg-[#FFFDF0] border-2 border-black rounded-tr-[10px] rounded-br-[10px] p-5 sm:p-6 md:p-8"
          >
            {members.length === 0 ? (
              <p className="text-base text-neutral-700 py-4">
                Nenhum integrante cadastrado nesta seção até o momento.
              </p>
            ) : singleMember ? (
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 items-start">
                <div className="aspect-[4/3] w-full rounded-[8px] border-2 border-black overflow-hidden bg-white">
                  {singleMember.photoDataUrl ? (
                    <img
                      src={singleMember.photoDataUrl}
                      alt={`Foto de ${singleMember.name}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SectionIllustration sectionId={section.id} />
                  )}
                </div>

                <div className="space-y-2.5 min-w-0">
                  <h2 className="text-2xl font-bold text-black tracking-tight text-balance">
                    {singleMember.name}
                  </h2>
                  <p className="text-sm font-semibold text-neutral-700">
                    {singleMember.role}
                  </p>
                  <p className="text-base leading-[1.65] text-neutral-900 whitespace-pre-line max-w-[68ch] pt-1">
                    {singleMember.info}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-baseline gap-2.5 mb-4">
                  <h2 className="text-xl font-bold text-black tracking-tight">
                    {section.id === 'direcao'
                      ? 'Diretora e Equipe'
                      : section.buttonLabel}
                  </h2>
                  <span className="text-sm font-medium text-neutral-700 tabular-nums">
                    · {members.length}{' '}
                    {members.length === 1
                      ? 'pessoa cadastrada'
                      : 'pessoas cadastradas'}
                  </span>
                </div>

                <div className="w-full overflow-x-auto border-2 border-black rounded-[8px] bg-white">
                  <table className="w-full text-left border-collapse min-w-[620px]">
                    <thead>
                      <tr className="bg-[#FFFCC1] border-b-2 border-black text-sm font-bold text-black">
                        <th className="py-3 px-3 w-[56px] text-center border-r border-black/20">
                          Nº
                        </th>
                        <th className="py-3 px-3 w-[84px] text-center border-r border-black/20">
                          Foto
                        </th>
                        <th className="py-3 px-4 w-[220px] border-r border-black/20">
                          Nome
                        </th>
                        <th className="py-3 px-4 w-[210px] border-r border-black/20">
                          Função / Cargo
                        </th>
                        <th className="py-3 px-4">Informações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/20 text-sm sm:text-[15px]">
                      {members.map((member, index) => {
                        const rowNumber = String(index + 1).padStart(2, '0');
                        return (
                          <tr
                            key={member.id}
                            className="hover:bg-[#FFFDF0] transition-colors align-top"
                          >
                            <td className="py-3.5 px-3 text-center font-semibold text-neutral-700 tabular-nums border-r border-black/15">
                              {rowNumber}
                            </td>
                            <td className="py-3 px-3 border-r border-black/15">
                              <div className="w-12 h-12 mx-auto rounded-[6px] border-2 border-black overflow-hidden bg-[#FFFCC1] flex items-center justify-center shrink-0">
                                {member.photoDataUrl ? (
                                  <img
                                    src={member.photoDataUrl}
                                    alt={`Foto de ${member.name}`}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-black flex items-center justify-center">
                                    {getInitials(member.name) || (
                                      <User className="w-4 h-4" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-black border-r border-black/15">
                              {member.name}
                            </td>
                            <td className="py-3.5 px-4 text-neutral-900 border-r border-black/15">
                              {member.role}
                            </td>
                            <td className="py-3.5 px-4 text-neutral-800 leading-relaxed">
                              {member.info}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
