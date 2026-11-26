import {
  CarouselSlide,
  DEFAULT_CAROUSEL_SLIDES,
  DEFAULT_HOME_INFO_SECTIONS,
  DEFAULT_TEACHERS,
  HomeInfoSection,
  PersonMember,
  SCHOOL_SECTIONS,
  SectionId,
  TeacherMember,
} from '../data/sections';
import {
  buildDefaultMembers,
  buildDefaultState,
  MembersBySection,
  SchoolAppState,
} from '../store/schoolStore';
import { SUPABASE_BUCKET, supabase } from './supabase';

interface MemberRow {
  id: string;
  section_id: SectionId;
  name: string;
  role: string;
  info: string;
  photo_url: string | null;
  sort_order: number;
}

interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  info: string;
  photo_url: string | null;
  sort_order: number;
}

interface SlideRow {
  id: string;
  title: string;
  subtitle: string;
  accent_bg: string;
  theme: CarouselSlide['theme'];
  image_url: string | null;
  sort_order: number;
}

interface InfoSectionRow {
  id: string;
  title: string;
  content: string;
  accent_color: string;
  sort_order: number;
}

function generateUniqueFileName(file: File, folder: string): string {
  const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const baseName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 32);
  const uniqueSuffix =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${folder}/${Date.now()}-${uniqueSuffix}-${baseName || 'img'}.${ext}`;
}

export async function uploadImageToBucket(
  file: File,
  folder: 'members' | 'teachers' | 'slides'
): Promise<string> {
  if (!supabase) {
    throw new Error(
      'Cliente Supabase não configurado. Verifique as variáveis de ambiente.'
    );
  }

  const filePath = generateUniqueFileName(file, folder);

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao enviar imagem para o Supabase: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

async function seedInitialCloudData(): Promise<void> {
  if (!supabase) return;

  const memberRows: MemberRow[] = [];
  for (const section of SCHOOL_SECTIONS) {
    section.defaultMembers.forEach((m, idx) => {
      memberRows.push({
        id: m.id,
        section_id: section.id,
        name: m.name,
        role: m.role,
        info: m.info,
        photo_url: m.photoDataUrl ?? null,
        sort_order: idx,
      });
    });
  }

  const teacherRows: TeacherRow[] = DEFAULT_TEACHERS.map((t, idx) => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    info: t.info,
    photo_url: t.photoDataUrl ?? null,
    sort_order: idx,
  }));

  const slideRows: SlideRow[] = DEFAULT_CAROUSEL_SLIDES.map((s, idx) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    accent_bg: s.accentBg,
    theme: s.theme,
    image_url: s.imageDataUrl ?? null,
    sort_order: idx,
  }));

  const infoRows: InfoSectionRow[] = DEFAULT_HOME_INFO_SECTIONS.map(
    (item, idx) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      accent_color: item.accentColor,
      sort_order: idx,
    })
  );

  await Promise.all([
    supabase.from('school_members').upsert(memberRows, { onConflict: 'id' }),
    supabase.from('school_teachers').upsert(teacherRows, { onConflict: 'id' }),
    supabase.from('home_slides').upsert(slideRows, { onConflict: 'id' }),
    supabase
      .from('home_info_sections')
      .upsert(infoRows, { onConflict: 'id' }),
  ]);
}

export async function fetchAllSchoolData(): Promise<{
  state: SchoolAppState;
  cloudReady: boolean;
  errorMessage?: string;
}> {
  if (!supabase) {
    return {
      state: buildDefaultState(),
      cloudReady: false,
      errorMessage:
        'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não definidas.',
    };
  }

  const [membersRes, teachersRes, slidesRes, infoRes] = await Promise.all([
    supabase
      .from('school_members')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('school_teachers')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('home_slides')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('home_info_sections')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  const firstError =
    membersRes.error || teachersRes.error || slidesRes.error || infoRes.error;

  if (firstError) {
    return {
      state: buildDefaultState(),
      cloudReady: false,
      errorMessage: `Banco Supabase aguardando criação das tabelas (${firstError.message}).`,
    };
  }

  const memberRows = (membersRes.data ?? []) as MemberRow[];
  const teacherRows = (teachersRes.data ?? []) as TeacherRow[];
  const slideRows = (slidesRes.data ?? []) as SlideRow[];
  const infoRows = (infoRes.data ?? []) as InfoSectionRow[];

  // Se todas as tabelas acabaram de ser criadas e estão vazias, popula automaticamente com os dados iniciais
  if (
    memberRows.length === 0 &&
    teacherRows.length === 0 &&
    slideRows.length === 0 &&
    infoRows.length === 0
  ) {
    await seedInitialCloudData();
    return {
      state: buildDefaultState(),
      cloudReady: true,
    };
  }

  const membersBySection: MembersBySection = buildDefaultMembers();
  for (const section of SCHOOL_SECTIONS) {
    membersBySection[section.id] = [];
  }
  for (const row of memberRows) {
    if (membersBySection[row.section_id]) {
      membersBySection[row.section_id].push({
        id: row.id,
        name: row.name,
        role: row.role,
        info: row.info,
        photoDataUrl: row.photo_url ?? undefined,
      });
    }
  }

  const teachers: TeacherMember[] = teacherRows.map((row) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    info: row.info,
    photoDataUrl: row.photo_url ?? undefined,
  }));

  const slides: CarouselSlide[] = slideRows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    accentBg: row.accent_bg,
    theme: row.theme,
    imageDataUrl: row.image_url ?? undefined,
  }));

  const infoSections: HomeInfoSection[] = infoRows.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    accentColor: row.accent_color,
  }));

  return {
    state: {
      membersBySection,
      teachers,
      slides: slides.length > 0 ? slides : DEFAULT_CAROUSEL_SLIDES,
      infoSections,
    },
    cloudReady: true,
  };
}

// --- CRUD Funcionários / Equipes ---
export async function insertMemberInSupabase(
  sectionId: SectionId,
  member: PersonMember,
  sortOrder: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('school_members').insert({
    id: member.id,
    section_id: sectionId,
    name: member.name,
    role: member.role,
    info: member.info,
    photo_url: member.photoDataUrl ?? null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message);
}

export async function updateMemberInSupabase(
  sectionId: SectionId,
  member: PersonMember
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('school_members')
    .update({
      section_id: sectionId,
      name: member.name,
      role: member.role,
      info: member.info,
      photo_url: member.photoDataUrl ?? null,
    })
    .eq('id', member.id);
  if (error) throw new Error(error.message);
}

export async function deleteMemberInSupabase(memberId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('school_members')
    .delete()
    .eq('id', memberId);
  if (error) throw new Error(error.message);
}

export async function resetSectionMembersInSupabase(
  sectionId: SectionId
): Promise<PersonMember[]> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const section = SCHOOL_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return [];

  const { error: delError } = await supabase
    .from('school_members')
    .delete()
    .eq('section_id', sectionId);
  if (delError) throw new Error(delError.message);

  const rows: MemberRow[] = section.defaultMembers.map((m, idx) => ({
    id: m.id,
    section_id: sectionId,
    name: m.name,
    role: m.role,
    info: m.info,
    photo_url: m.photoDataUrl ?? null,
    sort_order: idx,
  }));

  if (rows.length > 0) {
    const { error: insError } = await supabase
      .from('school_members')
      .insert(rows);
    if (insError) throw new Error(insError.message);
  }

  return section.defaultMembers.map((m) => ({ ...m }));
}

// --- CRUD Professores ---
export async function insertTeacherInSupabase(
  teacher: TeacherMember,
  sortOrder: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('school_teachers').insert({
    id: teacher.id,
    name: teacher.name,
    subject: teacher.subject,
    info: teacher.info,
    photo_url: teacher.photoDataUrl ?? null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message);
}

export async function updateTeacherInSupabase(
  teacher: TeacherMember
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('school_teachers')
    .update({
      name: teacher.name,
      subject: teacher.subject,
      info: teacher.info,
      photo_url: teacher.photoDataUrl ?? null,
    })
    .eq('id', teacher.id);
  if (error) throw new Error(error.message);
}

export async function deleteTeacherInSupabase(teacherId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('school_teachers')
    .delete()
    .eq('id', teacherId);
  if (error) throw new Error(error.message);
}

// --- CRUD Slides do Carrossel ---
export async function insertSlideInSupabase(
  slide: CarouselSlide,
  sortOrder: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('home_slides').insert({
    id: slide.id,
    title: slide.title,
    subtitle: slide.subtitle,
    accent_bg: slide.accentBg,
    theme: slide.theme,
    image_url: slide.imageDataUrl ?? null,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message);
}

export async function updateSlideInSupabase(slide: CarouselSlide): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('home_slides')
    .update({
      title: slide.title,
      subtitle: slide.subtitle,
      accent_bg: slide.accentBg,
      theme: slide.theme,
      image_url: slide.imageDataUrl ?? null,
    })
    .eq('id', slide.id);
  if (error) throw new Error(error.message);
}

export async function deleteSlideInSupabase(slideId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('home_slides')
    .delete()
    .eq('id', slideId);
  if (error) throw new Error(error.message);
}

// --- CRUD Sessões de Informações ---
export async function insertInfoSectionInSupabase(
  info: HomeInfoSection,
  sortOrder: number
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('home_info_sections').insert({
    id: info.id,
    title: info.title,
    content: info.content,
    accent_color: info.accentColor,
    sort_order: sortOrder,
  });
  if (error) throw new Error(error.message);
}

export async function updateInfoSectionInSupabase(
  info: HomeInfoSection
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('home_info_sections')
    .update({
      title: info.title,
      content: info.content,
      accent_color: info.accentColor,
    })
    .eq('id', info.id);
  if (error) throw new Error(error.message);
}

export async function deleteInfoSectionInSupabase(
  infoId: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('home_info_sections')
    .delete()
    .eq('id', infoId);
  if (error) throw new Error(error.message);
}
