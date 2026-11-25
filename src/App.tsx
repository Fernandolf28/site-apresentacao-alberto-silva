import { useCallback, useEffect, useState } from 'react';
import {
  CarouselSlide,
  HomeInfoSection,
  PersonMember,
  SCHOOL_SECTIONS,
  SectionId,
  TeacherMember,
} from './data/sections';
import {
  loadAdminAuth,
  loadSchoolState,
  saveAdminAuth,
  saveSchoolState,
  SchoolAppState,
} from './store/schoolStore';
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
    loadSchoolState()
  );

  useEffect(() => {
    saveSchoolState(appState);
  }, [appState]);

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

  const handleAddMember = (
    sectionId: SectionId,
    member: Omit<PersonMember, 'id'>
  ) => {
    const newMember: PersonMember = {
      ...member,
      id: `${sectionId}-${Date.now()}`,
    };
    setAppState((prev) => ({
      ...prev,
      membersBySection: {
        ...prev.membersBySection,
        [sectionId]: [...prev.membersBySection[sectionId], newMember],
      },
    }));
  };

  const handleUpdateMember = (
    fromSectionId: SectionId,
    toSectionId: SectionId,
    updatedMember: PersonMember
  ) => {
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

  const handleDeleteMember = (sectionId: SectionId, memberId: string) => {
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

  const handleResetSectionMembers = (sectionId: SectionId) => {
    const section = SCHOOL_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;
    setAppState((prev) => ({
      ...prev,
      membersBySection: {
        ...prev.membersBySection,
        [sectionId]: section.defaultMembers.map((m) => ({ ...m })),
      },
    }));
  };

  const handleSaveSlides = (slides: CarouselSlide[]) => {
    setAppState((prev) => ({ ...prev, slides }));
  };

  const handleSaveInfoSections = (infoSections: HomeInfoSection[]) => {
    setAppState((prev) => ({ ...prev, infoSections }));
  };

  const handleSaveTeachers = (teachers: TeacherMember[]) => {
    setAppState((prev) => ({ ...prev, teachers }));
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
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onDeleteMember={handleDeleteMember}
        onResetSectionMembers={handleResetSectionMembers}
        onSaveSlides={handleSaveSlides}
        onSaveInfoSections={handleSaveInfoSections}
        onSaveTeachers={handleSaveTeachers}
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
