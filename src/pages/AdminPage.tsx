import React, { useRef, useState } from 'react';
import {
  Camera,
  Check,
  ExternalLink,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  CarouselSlide,
  HomeInfoSection,
  PersonMember,
  SCHOOL_SECTIONS,
  SectionId,
  TeacherMember,
} from '../data/sections';
import { SchoolAppState } from '../store/schoolStore';
import { uploadImageToBucket } from '../lib/supabaseService';
import { AppRoute } from '../components/Navbar';

interface AdminPageProps {
  state: SchoolAppState;
  cloudReady: boolean;
  cloudError: string | null;
  onAddMember: (
    sectionId: SectionId,
    member: Omit<PersonMember, 'id'>
  ) => Promise<void>;
  onUpdateMember: (
    fromSectionId: SectionId,
    toSectionId: SectionId,
    member: PersonMember
  ) => Promise<void>;
  onDeleteMember: (sectionId: SectionId, memberId: string) => Promise<void>;
  onResetSectionMembers: (sectionId: SectionId) => Promise<void>;
  onCreateSlide: (slide: Omit<CarouselSlide, 'id'>) => Promise<void>;
  onUpdateSlide: (slide: CarouselSlide) => Promise<void>;
  onDeleteSlide: (slideId: string) => Promise<void>;
  onCreateInfoSection: (info: Omit<HomeInfoSection, 'id'>) => Promise<void>;
  onUpdateInfoSection: (info: HomeInfoSection) => Promise<void>;
  onDeleteInfoSection: (infoId: string) => Promise<void>;
  onCreateTeacher: (teacher: Omit<TeacherMember, 'id'>) => Promise<void>;
  onUpdateTeacher: (teacher: TeacherMember) => Promise<void>;
  onDeleteTeacher: (teacherId: string) => Promise<void>;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

type AdminTab = 'equipes' | 'inicio';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminPage({
  state,
  cloudReady,
  cloudError,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onResetSectionMembers,
  onCreateSlide,
  onUpdateSlide,
  onDeleteSlide,
  onCreateInfoSection,
  onUpdateInfoSection,
  onDeleteInfoSection,
  onCreateTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onNavigate,
  onLogout,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('equipes');
  const [selectedSection, setSelectedSection] = useState<SectionId>('direcao');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Formulário de Cadastro / Edição de Funcionário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{
    id: string;
    originalSectionId: SectionId;
  } | null>(null);
  const [formSectionId, setFormSectionId] = useState<SectionId>('direcao');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formInfo, setFormInfo] = useState('');
  const [formPhoto, setFormPhoto] = useState<string | undefined>(undefined);
  const [isUploadingMemberPhoto, setIsUploadingMemberPhoto] = useState(false);
  const memberPhotoRef = useRef<HTMLInputElement>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetSection, setConfirmResetSection] = useState(false);

  // Formulário de Sessões de Informação (Página Inicial)
  const [infoFormOpen, setInfoFormOpen] = useState(false);
  const [editingInfoId, setEditingInfoId] = useState<string | null>(null);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoContent, setInfoContent] = useState('');
  const [infoColor, setInfoColor] = useState('#17A700');

  // Formulário de Slides do Carrossel (Página Inicial)
  const [slideFormOpen, setSlideFormOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideTheme, setSlideTheme] =
    useState<CarouselSlide['theme']>('campus');
  const [slideImage, setSlideImage] = useState<string | undefined>(undefined);
  const [isUploadingSlidePhoto, setIsUploadingSlidePhoto] = useState(false);
  const slidePhotoRef = useRef<HTMLInputElement>(null);

  // Formulário de Professores (Roda na Página Inicial)
  const [teacherFormOpen, setTeacherFormOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherInfo, setTeacherInfo] = useState('');
  const [teacherPhoto, setTeacherPhoto] = useState<string | undefined>(
    undefined
  );
  const [isUploadingTeacherPhoto, setIsUploadingTeacherPhoto] = useState(false);
  const teacherPhotoRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string) => {
    setErrorMessage(null);
    setStatusMessage(msg);
    window.setTimeout(() => {
      setStatusMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const notifyError = (err: unknown) => {
    const msg =
      err instanceof Error
        ? err.message
        : 'Não foi possível concluir a operação no Supabase.';
    setErrorMessage(msg);
  };

  const currentMembers = state.membersBySection[selectedSection] ?? [];
  const filteredMembers = currentMembers.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.info.toLowerCase().includes(q)
    );
  });

  const openCreateForm = () => {
    setEditingMember(null);
    setFormSectionId(selectedSection);
    setFormName('');
    setFormRole('');
    setFormInfo('');
    setFormPhoto(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (member: PersonMember) => {
    setEditingMember({ id: member.id, originalSectionId: selectedSection });
    setFormSectionId(selectedSection);
    setFormName(member.name);
    setFormRole(member.role);
    setFormInfo(member.info);
    setFormPhoto(member.photoDataUrl);
    setIsFormOpen(true);
  };

  const handleMemberPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingMemberPhoto(true);
    setErrorMessage(null);
    try {
      const publicUrl = await uploadImageToBucket(file, 'members');
      setFormPhoto(publicUrl);
      notify('Imagem enviada para o Supabase Storage com sucesso.');
    } catch (err) {
      notifyError(err);
    } finally {
      setIsUploadingMemberPhoto(false);
    }
  };

  const handleMemberFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    const cleanRole = formRole.trim();
    const cleanInfo = formInfo.trim();
    if (!cleanName || !cleanRole || !cleanInfo || isUploadingMemberPhoto) {
      return;
    }

    setIsSaving(true);
    try {
      if (editingMember) {
        await onUpdateMember(editingMember.originalSectionId, formSectionId, {
          id: editingMember.id,
          name: cleanName,
          role: cleanRole,
          info: cleanInfo,
          photoDataUrl: formPhoto,
        });
        setSelectedSection(formSectionId);
        notify(
          `Dados de "${cleanName}" atualizados no banco de dados Supabase.`
        );
      } else {
        await onAddMember(formSectionId, {
          name: cleanName,
          role: cleanRole,
          info: cleanInfo,
          photoDataUrl: formPhoto,
        });
        setSelectedSection(formSectionId);
        notify(`"${cleanName}" cadastrado(a) no Supabase com sucesso.`);
      }

      setIsFormOpen(false);
      setEditingMember(null);
    } catch (err) {
      notifyError(err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers Página Inicial: Informações ---
  const openNewInfoForm = () => {
    setEditingInfoId(null);
    setInfoTitle('');
    setInfoContent('');
    setInfoColor('#17A700');
    setInfoFormOpen(true);
  };

  const openEditInfoForm = (item: HomeInfoSection) => {
    setEditingInfoId(item.id);
    setInfoTitle(item.title);
    setInfoContent(item.content);
    setInfoColor(item.accentColor);
    setInfoFormOpen(true);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoTitle.trim() || !infoContent.trim()) return;
    setIsSaving(true);
    try {
      if (editingInfoId) {
        await onUpdateInfoSection({
          id: editingInfoId,
          title: infoTitle.trim(),
          content: infoContent.trim(),
          accentColor: infoColor,
        });
        notify('Sessão de informação atualizada no Supabase.');
      } else {
        await onCreateInfoSection({
          title: infoTitle.trim(),
          content: infoContent.trim(),
          accentColor: infoColor,
        });
        notify('Nova sessão de informação salva no Supabase.');
      }
      setInfoFormOpen(false);
      setEditingInfoId(null);
    } catch (err) {
      notifyError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInfo = async (id: string) => {
    try {
      await onDeleteInfoSection(id);
      notify('Sessão de informação removida do Supabase.');
    } catch (err) {
      notifyError(err);
    }
  };

  // --- Handlers Página Inicial: Carrossel ---
  const openNewSlideForm = () => {
    setEditingSlideId(null);
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideTheme('campus');
    setSlideImage(undefined);
    setSlideFormOpen(true);
  };

  const openEditSlideForm = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideTheme(slide.theme);
    setSlideImage(slide.imageDataUrl);
    setSlideFormOpen(true);
  };

  const handleSlideImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingSlidePhoto(true);
    setErrorMessage(null);
    try {
      const publicUrl = await uploadImageToBucket(file, 'slides');
      setSlideImage(publicUrl);
      notify('Imagem do slide enviada para o Supabase Storage.');
    } catch (err) {
      notifyError(err);
    } finally {
      setIsUploadingSlidePhoto(false);
    }
  };

  const handleSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim() || !slideSubtitle.trim() || isUploadingSlidePhoto) {
      return;
    }
    setIsSaving(true);
    try {
      if (editingSlideId) {
        const existing = state.slides.find((s) => s.id === editingSlideId);
        await onUpdateSlide({
          id: editingSlideId,
          title: slideTitle.trim(),
          subtitle: slideSubtitle.trim(),
          accentBg: existing?.accentBg ?? '#17A700',
          theme: slideTheme,
          imageDataUrl: slideImage,
        });
        notify('Slide do carrossel atualizado no Supabase.');
      } else {
        await onCreateSlide({
          title: slideTitle.trim(),
          subtitle: slideSubtitle.trim(),
          accentBg: '#17A700',
          theme: slideTheme,
          imageDataUrl: slideImage,
        });
        notify('Novo slide salvo no Supabase.');
      }
      setSlideFormOpen(false);
      setEditingSlideId(null);
    } catch (err) {
      notifyError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (state.slides.length <= 1) {
      notify('Mantenha pelo menos 1 slide no carrossel.');
      return;
    }
    try {
      await onDeleteSlide(id);
      notify('Slide removido do Supabase.');
    } catch (err) {
      notifyError(err);
    }
  };

  // --- Handlers Página Inicial: Professores ---
  const openNewTeacherForm = () => {
    setEditingTeacherId(null);
    setTeacherName('');
    setTeacherSubject('');
    setTeacherInfo('');
    setTeacherPhoto(undefined);
    setTeacherFormOpen(true);
  };

  const openEditTeacherForm = (teacher: TeacherMember) => {
    setEditingTeacherId(teacher.id);
    setTeacherName(teacher.name);
    setTeacherSubject(teacher.subject);
    setTeacherInfo(teacher.info);
    setTeacherPhoto(teacher.photoDataUrl);
    setTeacherFormOpen(true);
  };

  const handleTeacherPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploadingTeacherPhoto(true);
    setErrorMessage(null);
    try {
      const publicUrl = await uploadImageToBucket(file, 'teachers');
      setTeacherPhoto(publicUrl);
      notify('Foto do professor enviada para o Supabase Storage.');
    } catch (err) {
      notifyError(err);
    } finally {
      setIsUploadingTeacherPhoto(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !teacherName.trim() ||
      !teacherSubject.trim() ||
      !teacherInfo.trim() ||
      isUploadingTeacherPhoto
    ) {
      return;
    }

    setIsSaving(true);
    try {
      if (editingTeacherId) {
        await onUpdateTeacher({
          id: editingTeacherId,
          name: teacherName.trim(),
          subject: teacherSubject.trim(),
          info: teacherInfo.trim(),
          photoDataUrl: teacherPhoto,
        });
        notify(
          `Dados de "${teacherName.trim()}" atualizados no banco de dados Supabase.`
        );
      } else {
        await onCreateTeacher({
          name: teacherName.trim(),
          subject: teacherSubject.trim(),
          info: teacherInfo.trim(),
          photoDataUrl: teacherPhoto,
        });
        notify(`"${teacherName.trim()}" salvo(a) no Supabase com sucesso.`);
      }

      setTeacherFormOpen(false);
      setEditingTeacherId(null);
    } catch (err) {
      notifyError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    try {
      await onDeleteTeacher(id);
      notify('Professor removido do Supabase.');
    } catch (err) {
      notifyError(err);
    }
  };

  const activeSectionMeta = SCHOOL_SECTIONS.find(
    (s) => s.id === selectedSection
  );

  return (
    <div className="min-h-screen bg-[#FFFCC1] text-black flex flex-col">
      {/* Cabeçalho do Painel Administrativo */}
      <header className="sticky top-0 z-30 bg-[#FFFDF0] border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black whitespace-nowrap">
              Painel Administrativo
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white text-black border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] transition cursor-pointer whitespace-nowrap"
            >
              <span>Página Inicial</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('apresentacao')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-[#17A700] text-black border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer whitespace-nowrap"
            >
              <span>Ver Nossa Apresentação</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-white text-black border-2 border-black rounded-[6px] hover:bg-red-50 transition cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {!cloudReady && cloudError && (
          <div
            role="alert"
            className="bg-[#FFDE00] text-black border-2 border-black rounded-[8px] px-4 py-3 text-sm font-semibold"
          >
            {cloudError} Execute o SQL no SQL Editor do Supabase para ativar o
            salvamento permanente em nuvem.
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="bg-[#FF3131]/20 text-black border-2 border-black rounded-[8px] px-4 py-3 text-sm font-bold flex items-center justify-between gap-3"
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Fechar erro"
              className="p-1 hover:bg-black/10 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Feedback de operação */}
        {statusMessage && (
          <div
            role="status"
            className="bg-[#17A700] text-black border-2 border-black rounded-[8px] px-4 py-3 text-sm font-bold flex items-center justify-between gap-3"
          >
            <span>{statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              aria-label="Fechar aviso"
              className="p-1 hover:bg-black/10 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Seletor de módulo administrativo */}
        <div className="inline-flex flex-wrap gap-2 p-1.5 bg-[#FFFDF0] border-2 border-black rounded-[8px]">
          <button
            type="button"
            onClick={() => setActiveTab('equipes')}
            className={`px-4 py-2 text-sm font-bold rounded-[6px] transition cursor-pointer whitespace-nowrap ${
              activeTab === 'equipes'
                ? 'bg-black text-white'
                : 'text-black hover:bg-[#FFFCC1]'
            }`}
          >
            Funcionários e Equipes (Nossa Apresentação)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className={`px-4 py-2 text-sm font-bold rounded-[6px] transition cursor-pointer whitespace-nowrap ${
              activeTab === 'inicio'
                ? 'bg-black text-white'
                : 'text-black hover:bg-[#FFFCC1]'
            }`}
          >
            Página Inicial (Carrossel, Informações e Professores)
          </button>
        </div>

        {activeTab === 'equipes' ? (
          <div className="space-y-6">
            {/* Seleção dos 4 setores da página Nossa Apresentação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SCHOOL_SECTIONS.map((sec) => {
                const count = (state.membersBySection[sec.id] ?? []).length;
                const isActive = selectedSection === sec.id;
                const isBlue = sec.bandBg === 'rgb(0, 56, 255)';

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec.id);
                      setConfirmDeleteId(null);
                      setConfirmResetSection(false);
                      setIsFormOpen(false);
                    }}
                    className={`p-4 text-left border-2 border-black rounded-[8px] transition cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'ring-2 ring-black ring-offset-2 ring-offset-[#FFFCC1]'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: sec.bandBg,
                      color: isBlue ? '#FFFFFF' : '#000000',
                    }}
                  >
                    <span className="font-bold text-base leading-snug">
                      {sec.adminLabel}
                    </span>
                    <span className="text-lg font-bold tabular-nums shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Barra de ações do setor selecionado */}
            <div className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">
                  {activeSectionMeta?.adminLabel}
                </h2>
                <p className="text-sm text-neutral-700">
                  Cadastre, edite, atualize ou exclua os integrantes exibidos em{' '}
                  <strong>{activeSectionMeta?.buttonLabel}</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou cargo..."
                    aria-label="Buscar integrante"
                    className="pl-9 pr-3 py-2 text-sm bg-white text-black border-2 border-black rounded-[6px] w-56 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Cadastrar Integrante</span>
                </button>

                {!confirmResetSection ? (
                  <button
                    type="button"
                    onClick={() => setConfirmResetSection(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-white text-black border-2 border-black rounded-[6px] hover:bg-neutral-100 transition cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Restaurar padrão</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-[#FFFCC1] border-2 border-black rounded-[6px] px-2.5 py-1.5">
                    <span className="text-xs font-bold">Restaurar setor?</span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await onResetSectionMembers(selectedSection);
                          setConfirmResetSection(false);
                          notify(
                            'Lista padrão do setor restaurada no Supabase.'
                          );
                        } catch (err) {
                          notifyError(err);
                        }
                      }}
                      className="px-2 py-1 text-xs font-bold bg-[#FF3131] text-black border border-black rounded cursor-pointer"
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetSection(false)}
                      className="px-2 py-1 text-xs font-medium bg-white text-black border border-black rounded cursor-pointer"
                    >
                      Não
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Formulário de Cadastro / Edição */}
            {isFormOpen && (
              <form
                onSubmit={handleMemberFormSubmit}
                className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5 sm:p-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-3">
                  <h3 className="text-lg font-bold text-black">
                    {editingMember
                      ? 'Editar / Atualizar Integrante'
                      : 'Novo Cadastro de Integrante'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingMember(null);
                    }}
                    aria-label="Fechar formulário"
                    className="p-1.5 hover:bg-black/10 rounded cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
                  {/* Upload da Foto para o Supabase Storage */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-40 h-40 rounded-[8px] border-2 border-black bg-white overflow-hidden flex items-center justify-center">
                      {isUploadingMemberPhoto ? (
                        <div className="flex flex-col items-center gap-2 text-neutral-700 p-3">
                          <Loader2
                            className="w-8 h-8 animate-spin"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-semibold">
                            Enviando...
                          </span>
                        </div>
                      ) : formPhoto ? (
                        <img
                          src={formPhoto}
                          alt="Prévia da foto"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-neutral-500 flex flex-col items-center gap-1">
                          <User className="w-10 h-10" aria-hidden="true" />
                          <span className="text-xs font-medium">Sem foto</span>
                        </div>
                      )}
                    </div>

                    <input
                      ref={memberPhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMemberPhotoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        disabled={isUploadingMemberPhoto}
                        onClick={() => memberPhotoRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] cursor-pointer disabled:opacity-60"
                      >
                        <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{formPhoto ? 'Trocar foto' : 'Enviar foto'}</span>
                      </button>
                      {formPhoto && !isUploadingMemberPhoto && (
                        <button
                          type="button"
                          onClick={() => setFormPhoto(undefined)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border-2 border-black rounded-[6px] hover:bg-red-50 cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Campos do Integrante */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="member-sector"
                        className="block text-sm font-bold text-black mb-1"
                      >
                        Setor na Apresentação
                      </label>
                      <select
                        id="member-sector"
                        value={formSectionId}
                        onChange={(e) =>
                          setFormSectionId(e.target.value as SectionId)
                        }
                        className="w-full px-3 py-2 text-sm font-semibold bg-white text-black border-2 border-black rounded-[6px] focus:outline-none"
                      >
                        {SCHOOL_SECTIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.adminLabel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="member-name"
                        className="block text-sm font-bold text-black mb-1"
                      >
                        Nome completo
                      </label>
                      <input
                        id="member-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Ana Paula Oliveira"
                        className="w-full px-3 py-2 text-sm bg-white text-black border-2 border-black rounded-[6px] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="member-role"
                        className="block text-sm font-bold text-black mb-1"
                      >
                        Função / Cargo
                      </label>
                      <input
                        id="member-role"
                        type="text"
                        required
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="Ex: Coordenadora Pedagógica"
                        className="w-full px-3 py-2 text-sm bg-white text-black border-2 border-black rounded-[6px] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="member-info"
                        className="block text-sm font-bold text-black mb-1"
                      >
                        Informações
                      </label>
                      <textarea
                        id="member-info"
                        rows={3}
                        required
                        value={formInfo}
                        onChange={(e) => setFormInfo(e.target.value)}
                        placeholder="Descreva as atribuições, turno ou detalhes do integrante..."
                        className="w-full px-3 py-2 text-sm bg-white text-black border-2 border-black rounded-[6px] focus:outline-none resize-y"
                      />
                    </div>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isSaving || isUploadingMemberPhoto}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer disabled:opacity-60"
                      >
                        {isSaving ? (
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        )}
                        <span>
                          {editingMember ? 'Salvar alterações' : 'Cadastrar'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsFormOpen(false);
                          setEditingMember(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium bg-white text-black border-2 border-black rounded-[6px] hover:bg-neutral-100 transition cursor-pointer"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Tabela de Integrantes Cadastrados */}
            <div className="bg-white border-2 border-black rounded-[10px] overflow-hidden">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-base font-medium text-neutral-700">
                    {currentMembers.length === 0
                      ? 'Nenhum integrante cadastrado neste setor.'
                      : 'Nenhum integrante encontrado para a busca informada.'}
                  </p>
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Cadastrar primeiro integrante</span>
                  </button>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-[#FFFCC1] border-b-2 border-black text-sm font-bold text-black">
                        <th className="py-3 px-3 w-[56px] text-center border-r border-black/20">
                          Nº
                        </th>
                        <th className="py-3 px-3 w-[80px] text-center border-r border-black/20">
                          Foto
                        </th>
                        <th className="py-3 px-4 w-[210px] border-r border-black/20">
                          Nome
                        </th>
                        <th className="py-3 px-4 w-[200px] border-r border-black/20">
                          Função / Cargo
                        </th>
                        <th className="py-3 px-4">Informações</th>
                        <th className="py-3 px-4 w-[180px] text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/20 text-sm">
                      {filteredMembers.map((member, index) => (
                        <tr
                          key={member.id}
                          className="hover:bg-[#FFFDF0] transition-colors align-top"
                        >
                          <td className="py-3.5 px-3 text-center font-semibold text-neutral-700 tabular-nums border-r border-black/15">
                            {String(index + 1).padStart(2, '0')}
                          </td>
                          <td className="py-3 px-3 border-r border-black/15">
                            <div className="w-11 h-11 mx-auto rounded-[6px] border-2 border-black overflow-hidden bg-[#FFFCC1] flex items-center justify-center shrink-0">
                              {member.photoDataUrl ? (
                                <img
                                  src={member.photoDataUrl}
                                  alt={`Foto de ${member.name}`}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-bold text-black">
                                  {getInitials(member.name)}
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
                          <td className="py-3 px-4 text-right">
                            {confirmDeleteId === member.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await onDeleteMember(
                                        selectedSection,
                                        member.id
                                      );
                                      setConfirmDeleteId(null);
                                      notify(
                                        `"${member.name}" excluído(a) do Supabase.`
                                      );
                                    } catch (err) {
                                      notifyError(err);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 text-xs font-bold bg-[#FF3131] text-black border-2 border-black rounded-[4px] cursor-pointer whitespace-nowrap"
                                >
                                  Confirmar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2.5 py-1.5 text-xs font-medium bg-white text-black border-2 border-black rounded-[4px] cursor-pointer whitespace-nowrap"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(member)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white text-black border-2 border-black rounded-[4px] hover:bg-[#FFFCC1] cursor-pointer whitespace-nowrap"
                                >
                                  <Pencil
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(member.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white text-black border-2 border-black rounded-[4px] hover:bg-red-100 cursor-pointer whitespace-nowrap"
                                >
                                  <Trash2
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  <span>Excluir</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ABA 2: Gerenciamento da Página Inicial */
          <div className="space-y-10">
            {/* Sessões de Informações */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Sessões de Informações (Página Inicial)
                  </h2>
                  <p className="text-sm text-neutral-700">
                    Edite os textos das caixas exibidas na seção Informações e
                    Comunicados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewInfoForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Nova Informação</span>
                </button>
              </div>

              {infoFormOpen && (
                <form
                  onSubmit={handleInfoSubmit}
                  className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5 space-y-4"
                >
                  <h3 className="text-base font-bold text-black">
                    {editingInfoId
                      ? 'Editar Sessão de Informação'
                      : 'Cadastrar Sessão de Informação'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
                    <div>
                      <label
                        htmlFor="info-title"
                        className="block text-sm font-bold mb-1"
                      >
                        Título
                      </label>
                      <input
                        id="info-title"
                        type="text"
                        required
                        value={infoTitle}
                        onChange={(e) => setInfoTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="info-color"
                        className="block text-sm font-bold mb-1"
                      >
                        Cor do marcador
                      </label>
                      <select
                        id="info-color"
                        value={infoColor}
                        onChange={(e) => setInfoColor(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      >
                        <option value="#17A700">Verde</option>
                        <option value="#FFDE00">Amarelo</option>
                        <option value="#0038FF">Azul</option>
                        <option value="#FF3131">Vermelho</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="info-content"
                      className="block text-sm font-bold mb-1"
                    >
                      Texto informativo
                    </label>
                    <textarea
                      id="info-content"
                      rows={3}
                      required
                      value={infoContent}
                      onChange={(e) => setInfoContent(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setInfoFormOpen(false)}
                      className="px-4 py-2 text-sm font-medium bg-white text-black border-2 border-black rounded-[6px] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.infoSections.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-black rounded-[8px] p-4 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <h3 className="font-bold text-base text-black">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-800 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-black/15">
                      <button
                        type="button"
                        onClick={() => openEditInfoForm(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-[#FFFCC1] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInfo(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Carrossel de Imagens */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Slides do Carrossel (Página Inicial)
                  </h2>
                  <p className="text-sm text-neutral-700">
                    Envie fotos para o bucket <strong>school-images</strong> e
                    edite os slides da página inicial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewSlideForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#FFDE00] text-black border-2 border-black rounded-[6px] hover:brightness-95 transition cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Novo Slide</span>
                </button>
              </div>

              {slideFormOpen && (
                <form
                  onSubmit={handleSlideSubmit}
                  className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5 space-y-4"
                >
                  <h3 className="text-base font-bold text-black">
                    {editingSlideId ? 'Editar Slide' : 'Adicionar Novo Slide'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="slide-title"
                        className="block text-sm font-bold mb-1"
                      >
                        Título do Slide
                      </label>
                      <input
                        id="slide-title"
                        type="text"
                        required
                        value={slideTitle}
                        onChange={(e) => setSlideTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="slide-theme"
                        className="block text-sm font-bold mb-1"
                      >
                        Ilustração padrão (se não enviar foto)
                      </label>
                      <select
                        id="slide-theme"
                        value={slideTheme}
                        onChange={(e) =>
                          setSlideTheme(
                            e.target.value as CarouselSlide['theme']
                          )
                        }
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      >
                        <option value="campus">Prédio Escolar</option>
                        <option value="library">Projetos e Leitura</option>
                        <option value="sports">Esportes e Grêmio</option>
                        <option value="community">Segurança e Comunidade</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="slide-subtitle"
                      className="block text-sm font-bold mb-1"
                    >
                      Descrição curta
                    </label>
                    <input
                      id="slide-subtitle"
                      type="text"
                      required
                      value={slideSubtitle}
                      onChange={(e) => setSlideSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={slidePhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSlideImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingSlidePhoto}
                      onClick={() => slidePhotoRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] cursor-pointer disabled:opacity-60"
                    >
                      {isUploadingSlidePhoto ? (
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Camera className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>
                        {isUploadingSlidePhoto
                          ? 'Enviando para nuvem...'
                          : slideImage
                            ? 'Trocar imagem'
                            : 'Enviar imagem para nuvem'}
                      </span>
                    </button>
                    {slideImage && !isUploadingSlidePhoto && (
                      <button
                        type="button"
                        onClick={() => setSlideImage(undefined)}
                        className="px-3 py-2 text-xs font-medium bg-white border-2 border-black rounded-[6px] cursor-pointer"
                      >
                        Usar ilustração padrão
                      </button>
                    )}
                  </div>

                  {slideImage && (
                    <div className="w-full max-w-xs aspect-[16/9] rounded-[6px] border-2 border-black overflow-hidden bg-white">
                      <img
                        src={slideImage}
                        alt="Prévia do slide"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSaving || isUploadingSlidePhoto}
                      className="px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                      Salvar Slide
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideFormOpen(false)}
                      className="px-4 py-2 text-sm font-medium bg-white text-black border-2 border-black rounded-[6px] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="bg-white border-2 border-black rounded-[8px] p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-neutral-600 tabular-nums">
                        Slide {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-bold text-base text-black">
                        {slide.title}
                      </h3>
                      <p className="text-sm text-neutral-800">
                        {slide.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-black/15">
                      <button
                        type="button"
                        onClick={() => openEditSlideForm(slide)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-[#FFFCC1] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Roda de Professores */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Professores (Roda na Página Inicial)
                  </h2>
                  <p className="text-sm text-neutral-700">
                    Cadastre, edite ou remova os professores exibidos na roda em
                    &ldquo;Professores e suas Informações&rdquo;.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewTeacherForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-[#0038FF] text-white border-2 border-black rounded-[6px] hover:brightness-110 transition cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Novo Professor</span>
                </button>
              </div>

              {teacherFormOpen && (
                <form
                  onSubmit={handleTeacherSubmit}
                  className="bg-[#FFFDF0] border-2 border-black rounded-[10px] p-5 space-y-4"
                >
                  <h3 className="text-base font-bold text-black">
                    {editingTeacherId
                      ? 'Editar Professor'
                      : 'Cadastrar Novo Professor'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="teacher-name"
                        className="block text-sm font-bold mb-1"
                      >
                        Nome
                      </label>
                      <input
                        id="teacher-name"
                        type="text"
                        required
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Ex: Prof. João Pedro"
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="teacher-subject"
                        className="block text-sm font-bold mb-1"
                      >
                        Disciplina / Área
                      </label>
                      <input
                        id="teacher-subject"
                        type="text"
                        required
                        value={teacherSubject}
                        onChange={(e) => setTeacherSubject(e.target.value)}
                        placeholder="Ex: Física e Robótica"
                        className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="teacher-info"
                      className="block text-sm font-bold mb-1"
                    >
                      Breves informações
                    </label>
                    <textarea
                      id="teacher-info"
                      rows={2}
                      required
                      value={teacherInfo}
                      onChange={(e) => setTeacherInfo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-[6px]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={teacherPhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={handleTeacherPhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingTeacherPhoto}
                      onClick={() => teacherPhotoRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white border-2 border-black rounded-[6px] hover:bg-[#FFFCC1] cursor-pointer disabled:opacity-60"
                    >
                      {isUploadingTeacherPhoto ? (
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Camera className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>
                        {isUploadingTeacherPhoto
                          ? 'Enviando foto...'
                          : teacherPhoto
                            ? 'Trocar foto'
                            : 'Enviar foto'}
                      </span>
                    </button>
                    {teacherPhoto && !isUploadingTeacherPhoto && (
                      <button
                        type="button"
                        onClick={() => setTeacherPhoto(undefined)}
                        className="px-3 py-2 text-xs font-medium bg-white border-2 border-black rounded-[6px] cursor-pointer"
                      >
                        Remover foto
                      </button>
                    )}
                  </div>

                  {teacherPhoto && (
                    <div className="w-20 h-20 rounded-[8px] border-2 border-black overflow-hidden bg-white">
                      <img
                        src={teacherPhoto}
                        alt="Prévia da foto do professor"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSaving || isUploadingTeacherPhoto}
                      className="px-4 py-2 text-sm font-bold bg-[#17A700] text-black border-2 border-black rounded-[6px] cursor-pointer disabled:opacity-60"
                    >
                      Salvar Professor
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherFormOpen(false)}
                      className="px-4 py-2 text-sm font-medium bg-white text-black border-2 border-black rounded-[6px] cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white border-2 border-black rounded-[8px] p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-[6px] border-2 border-black overflow-hidden bg-[#FFFCC1] flex items-center justify-center shrink-0">
                        {teacher.photoDataUrl ? (
                          <img
                            src={teacher.photoDataUrl}
                            alt={`Foto de ${teacher.name}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-black">
                            {getInitials(teacher.name)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-black">
                          {teacher.name}
                        </h3>
                        <p className="text-xs font-semibold text-neutral-700">
                          {teacher.subject}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                      {teacher.info}
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-black/15">
                      <button
                        type="button"
                        onClick={() => openEditTeacherForm(teacher)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-[#FFFCC1] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border-2 border-black rounded-[4px] hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
