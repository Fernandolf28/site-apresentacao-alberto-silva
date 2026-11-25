import { ArrowRight } from 'lucide-react';
import {
  CarouselSlide,
  HomeInfoSection,
  TeacherMember,
} from '../data/sections';
import { AppRoute, Navbar } from '../components/Navbar';
import { HomeCarousel } from '../components/HomeCarousel';
import { TeachersWheelCarousel } from '../components/TeachersWheelCarousel';
import { Footer } from '../components/Footer';

interface HomePageProps {
  slides: CarouselSlide[];
  infoSections: HomeInfoSection[];
  teachers: TeacherMember[];
  onNavigate: (route: AppRoute, anchorId?: string) => void;
}

export function HomePage({
  slides,
  infoSections,
  teachers,
  onNavigate,
}: HomePageProps) {
  const firstBox = infoSections[0] ?? {
    id: 'info-1',
    title: 'Estrutura da Escola',
    content:
      'O CETI Gov. Alberto Tavares Silva conta com salas de aula climatizadas, laboratório de informática e tecnologia, biblioteca, refeitório, quadra poliesportiva e acessibilidade em todo o prédio escolar.',
    accentColor: '#17A700',
  };

  const secondBox = infoSections[1] ?? {
    id: 'info-2',
    title: 'Professores e suas Informações',
    content:
      'Conheça os docentes que acompanham o desenvolvimento acadêmico e os projetos tecnológicos e culturais dos nossos estudantes.',
    accentColor: '#0038FF',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCC1] text-black">
      <Navbar activeRoute="home" onNavigate={onNavigate} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 space-y-14">
        {/* Intro + Carrossel de Imagens */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-[32px] sm:text-[42px] md:text-[48px] font-bold leading-[1.1] tracking-tight text-balance">
                CETI Gov. Alberto Tavares Silva
              </h1>
              <p className="text-base sm:text-lg text-neutral-800 leading-relaxed">
                Educação e tecnologia transformando o futuro. Acompanhe os
                destaques, informações importantes e conheça todas as nossas
                equipes escolares.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('apresentacao')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-bold bg-[#17A700] text-black border-2 border-black rounded-[8px] hover:brightness-95 transition whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Ver Nossa Apresentação</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <HomeCarousel slides={slides} />
        </section>

        {/* Sessões de Informações (apenas as duas primeiras caixas) */}
        <section id="informacoes" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b-2 border-black pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Informações e Comunicados
            </h2>
            <p className="text-sm font-medium text-neutral-700">
              Conteúdo atualizado pela administração escolar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 items-stretch">
            {/* Caixa 1: Estrutura da Escola */}
            <article className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-6 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold border-2 border-black rounded-[6px] tabular-nums shrink-0"
                    style={{
                      backgroundColor: firstBox.accentColor,
                      color:
                        firstBox.accentColor.toUpperCase() === '#0038FF'
                          ? '#FFFFFF'
                          : '#000000',
                    }}
                  >
                    01
                  </span>
                  <h3 className="text-xl font-bold text-black leading-snug">
                    {firstBox.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                  {firstBox.content}
                </p>
              </div>
            </article>

            {/* Caixa 2: Professores e suas Informações (Roda 3D) */}
            <article className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-6 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold border-2 border-black rounded-[6px] tabular-nums shrink-0"
                    style={{
                      backgroundColor: secondBox.accentColor,
                      color:
                        secondBox.accentColor.toUpperCase() === '#0038FF'
                          ? '#FFFFFF'
                          : '#000000',
                    }}
                  >
                    02
                  </span>
                  <h3 className="text-xl font-bold text-black leading-snug">
                    {secondBox.title}
                  </h3>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed">
                  {secondBox.content}
                </p>
              </div>

              <TeachersWheelCarousel teachers={teachers} />
            </article>
          </div>
        </section>

        {/* Chamada para Nossa Apresentação */}
        <section className="bg-[#17A700] border-2 border-black rounded-[10px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-black">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
              Conheça Nossa Apresentação Completa
            </h2>
            <p className="text-base text-black/90 leading-relaxed">
              Veja os integrantes da Direção, Coordenação e Secretaria, Grêmio
              Estudantil e Organização e Segurança da Escola.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('apresentacao')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-bold bg-[#FFFDF0] text-black border-2 border-black rounded-[8px] hover:bg-white transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Abrir Apresentação</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
