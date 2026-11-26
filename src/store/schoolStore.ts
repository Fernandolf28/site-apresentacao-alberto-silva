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
