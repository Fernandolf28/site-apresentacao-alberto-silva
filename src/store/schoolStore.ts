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

export type MembersBySection = Record<SectionId, PersonMember[]>;

export interface SchoolAppState {
  membersBySection: MembersBySection;
  slides: CarouselSlide[];
  infoSections: HomeInfoSection[];
  teachers: TeacherMember[];
}

const DATA_STORAGE_KEY = 'portal_escolar_dados_v2';
const LEGACY_STORAGE_KEY = 'portal_escolar_dados_v1';
const AUTH_STORAGE_KEY = 'portal_escolar_admin_auth_v1';

export function buildDefaultMembers(): MembersBySection {
  const result = {} as MembersBySection;
  for (const section of SCHOOL_SECTIONS) {
    result[section.id] = section.defaultMembers.map((m) => ({ ...m }));
  }
  return result;
}

export function buildDefaultState(): SchoolAppState {
  return {
    membersBySection: buildDefaultMembers(),
    slides: DEFAULT_CAROUSEL_SLIDES.map((s) => ({ ...s })),
    infoSections: DEFAULT_HOME_INFO_SECTIONS.map((i) => ({ ...i })),
    teachers: DEFAULT_TEACHERS.map((t) => ({ ...t })),
  };
}

export function loadSchoolState(): SchoolAppState {
  const defaults = buildDefaultState();
  try {
    const rawV2 = localStorage.getItem(DATA_STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<SchoolAppState>;
      const membersBySection = { ...defaults.membersBySection };
      if (parsed.membersBySection) {
        for (const section of SCHOOL_SECTIONS) {
          const list = parsed.membersBySection[section.id];
          if (Array.isArray(list)) {
            membersBySection[section.id] = list;
          }
        }
      }
      return {
        membersBySection,
        slides:
          Array.isArray(parsed.slides) && parsed.slides.length > 0
            ? parsed.slides
            : defaults.slides,
        infoSections: Array.isArray(parsed.infoSections)
          ? parsed.infoSections
          : defaults.infoSections,
        teachers: Array.isArray(parsed.teachers)
          ? parsed.teachers
          : defaults.teachers,
      };
    }

    // Migração suave de v1 preservando equipes e slides salvos, aplicando o novo layout de 2 caixas + professores
    const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1) as Partial<SchoolAppState>;
      const membersBySection = { ...defaults.membersBySection };
      if (parsedV1.membersBySection) {
        for (const section of SCHOOL_SECTIONS) {
          const list = parsedV1.membersBySection[section.id];
          if (Array.isArray(list)) {
            membersBySection[section.id] = list;
          }
        }
      }
      return {
        membersBySection,
        slides:
          Array.isArray(parsedV1.slides) && parsedV1.slides.length > 0
            ? parsedV1.slides
            : defaults.slides,
        infoSections: defaults.infoSections,
        teachers: defaults.teachers,
      };
    }

    return defaults;
  } catch {
    return defaults;
  }
}

export function saveSchoolState(state: SchoolAppState): void {
  try {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadAdminAuth(): boolean {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveAdminAuth(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}
