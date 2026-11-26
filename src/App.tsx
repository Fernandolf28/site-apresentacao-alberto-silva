import { useCallback, useEffect, useState } from 'react';
import {
  CarouselSlide,
  HomeInfoSection,
  PersonMember,
  SectionId,
  TeacherMember,
} from './data/sections';
import {
  buildDefaultState,
  loadAdminAuth,
  saveAdminAuth,
  SchoolAppState,
} from './store/schoolStore';
import {
  deleteInfoSectionInSupabase,
  deleteMemberInSupabase,
  deleteSlideInSupabase,
  deleteTeacherInSupabase,
  fetchAllSchoolData,
  insertInfoSectionInSupabase,
  insertMemberInSupabase,
  insertSlideInSupabase,
  insertTeacherInSupabase,
  resetSectionMembersInSupabase,
  updateInfoSectionInSupabase,
  updateMemberInSupabase,
  updateSlideInSupabase,
  updateTeacherInSupabase,
} from './lib/supabaseService';
import { AppRoute } from './components/Navbar';
import { BookOpeningTransition } from './components/BookOpeningTransition';
import { SchoolIntroPage } from './pages/SchoolIntroPage';
import { HomePage } from './pages/HomePage';
import { PresentationPage } from './pages/PresentationPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

function parseHashRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'home') return 'home';
  if (hash === 'apresentacao') return 'apresentacao';
  if (hash === 'login') return 'login';
  if (hash === 'admin') return 'admin';
  return 'conheca';
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute());
  const [isOpeningBook, setIsOpeningBook] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    loadAdminAuth()
  );
  const [appState, setAppState] = useState<SchoolAppState>(() =>
    buildDefaultState()
  );
  const [cloudReady, setCloudReady] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAllSchoolData().then((result) => {
      if (!active) return;
      setAppState(result.state);
      setCloudReady(result.cloudReady);
      setCloudError(result.errorMessage ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setIsOpeningBook(false);
      setRoute(parseHashRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((nextRoute: AppRoute, anchorId?: string) => {
    const targetHash = nextRoute === 'conheca' ? '#/' : `#/${nextRoute}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    setRoute(nextRoute);

    if (anchorId) {
      window.setTimeout(() => {
        document
          .getElementById(anchorId)
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const handleStartStudy = useCallback(() => {
    if (isOpeningBook) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsOpeningBook(true);
  }, [isOpeningBook]);

  const handleBookTransitionComplete = useCallback(() => {
    setIsOpeningBook(false);
    navigate('home');
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    saveAdminAuth(true);
    navigate('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveAdminAuth(false);
    navigate('home');
  };

  // --- CRUD Equipes ("Nossa Apresentação") ---
  const handleAddMember = async (
    sectionId: SectionId,
    member: Omit<PersonMember, 'id'>
  ) => {
    const newMember: PersonMember = {
      ...member,
      id: `${sectionId}-${Date.now()}`,
    };
    const sortOrder = appState.membersBySection[sectionId].length;
    await insertMemberInSupabase(sectionId, newMember, sortOrder);
    setAppState((prev) => ({
      ...prev,
      membersBySection: {
        ...prev.membersBySection,
        [sectionId]: [...prev.membersBySection[sectionId], newMember],
      },
    }));
  };

  const handleUpdateMember = async (
    fromSectionId: SectionId,
    toSectionId: SectionId,
    updatedMember: PersonMember
  ) => {
    await updateMemberInSupabase(toSectionId, updatedMember);
    setAppState((prev) => {
      if (fromSectionId === toSectionId) {
        return {
          ...prev,
          membersBySection: {
            ...prev.membersBySection,
            [fromSectionId]: prev.membersBySection[fromSectionId].map((m) =>
              m.id === updatedMember.id ? updatedMember : m
            ),
          },
        };
      }

      return {
        ...prev,
        membersBySection: {
          ...prev.membersBySection,
          [fromSectionId]: prev.membersBySection[fromSectionId].filter(
            (m) => m.id !== updatedMember.id
          ),
          [toSectionId]: [...prev.membersBySection[toSectionId], updatedMember],
        },
      };
    });
  };

  const handleDeleteMember = async (
    sectionId: SectionId,
    memberId: string
  ) => {
    await deleteMemberInSupabase(memberId);
    setAppState((prev) => ({
      ...prev,
      membersBySection: {
        ...prev.membersBySection,
        [sectionId]: prev.membersBySection[sectionId].filter(
          (m) => m.id !== memberId
        ),
      },
    }));
  };

  const handleResetSectionMembers = async (sectionId: SectionId) => {
    const restored = await resetSectionMembersInSupabase(sectionId);
    setAppState((prev) => ({
      ...prev,
      membersBySection: {
        ...prev.membersBySection,
        [sectionId]: restored,
      },
    }));
  };

  // --- CRUD Slides do Carrossel ---
  const handleCreateSlide = async (slide: Omit<CarouselSlide, 'id'>) => {
    const newSlide: CarouselSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
    };
    await insertSlideInSupabase(newSlide, appState.slides.length);
    setAppState((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const handleUpdateSlide = async (updatedSlide: CarouselSlide) => {
    await updateSlideInSupabase(updatedSlide);
    setAppState((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === updatedSlide.id ? updatedSlide : s
      ),
    }));
  };

  const handleDeleteSlide = async (slideId: string) => {
    await deleteSlideInSupabase(slideId);
    setAppState((prev) => ({
      ...prev,
      slides: prev.slides.filter((s) => s.id !== slideId),
    }));
  };

  // --- CRUD Sessões de Informações ---
  const handleCreateInfoSection = async (
    info: Omit<HomeInfoSection, 'id'>
  ) => {
    const newInfo: HomeInfoSection = {
      ...info,
      id: `info-${Date.now()}`,
    };
    await insertInfoSectionInSupabase(newInfo, appState.infoSections.length);
    setAppState((prev) => ({
      ...prev,
      infoSections: [...prev.infoSections, newInfo],
    }));
  };

  const handleUpdateInfoSection = async (updatedInfo: HomeInfoSection) => {
    await updateInfoSectionInSupabase(updatedInfo);
    setAppState((prev) => ({
      ...prev,
      infoSections: prev.infoSections.map((item) =>
        item.id === updatedInfo.id ? updatedInfo : item
      ),
    }));
  };

  const handleDeleteInfoSection = async (infoId: string) => {
    await deleteInfoSectionInSupabase(infoId);
    setAppState((prev) => ({
      ...prev,
      infoSections: prev.infoSections.filter((item) => item.id !== infoId),
    }));
  };

  // --- CRUD Professores ---
  const handleCreateTeacher = async (teacher: Omit<TeacherMember, 'id'>) => {
    const newTeacher: TeacherMember = {
      ...teacher,
      id: `prof-${Date.now()}`,
    };
    await insertTeacherInSupabase(newTeacher, appState.teachers.length);
    setAppState((prev) => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher],
    }));
  };

  const handleUpdateTeacher = async (updatedTeacher: TeacherMember) => {
    await updateTeacherInSupabase(updatedTeacher);
    setAppState((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) =>
        t.id === updatedTeacher.id ? updatedTeacher : t
      ),
    }));
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    await deleteTeacherInSupabase(teacherId);
    setAppState((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== teacherId),
    }));
  };

  // Proteção da rota administrativa
  const effectiveRoute: AppRoute =
    route === 'admin' && !isAuthenticated ? 'login' : route;

  if (effectiveRoute === 'home') {
    return (
      <HomePage
        slides={appState.slides}
        infoSections={appState.infoSections}
        teachers={appState.teachers}
        onNavigate={navigate}
      />
    );
  }

  if (effectiveRoute === 'apresentacao') {
    return (
      <PresentationPage
        membersBySection={appState.membersBySection}
        onNavigate={navigate}
      />
    );
  }

  if (effectiveRoute === 'login') {
    return (
      <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
    );
  }

  if (effectiveRoute === 'admin') {
    return (
      <AdminPage
        state={appState}
        cloudReady={cloudReady}
        cloudError={cloudError}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
        onResetSectionMembers={handleResetSectionMembers}
        onCreateSlide={handleCreateSlide}
        onUpdateSlide={handleUpdateSlide}
        onDeleteSlide={handleDeleteSlide}
        onCreateInfoSection={handleCreateInfoSection}
        onUpdateInfoSection={handleUpdateInfoSection}
        onDeleteInfoSection={handleDeleteInfoSection}
        onCreateTeacher={handleCreateTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        onDeleteTeacher={handleDeleteTeacher}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      <SchoolIntroPage
        onNavigate={navigate}
        onStartStudy={handleStartStudy}
        isFrozen={isOpeningBook}
      />

      {isOpeningBook && (
        <BookOpeningTransition
          frontCover={
            <SchoolIntroPage onNavigate={navigate} isFrozen={true} />
          }
          nextPage={
            <HomePage
              slides={appState.slides}
              infoSections={appState.infoSections}
              teachers={appState.teachers}
              onNavigate={navigate}
            />
          }
          onComplete={handleBookTransitionComplete}
        />
      )}
    </>
  );
}
