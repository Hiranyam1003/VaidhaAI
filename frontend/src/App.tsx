import { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { Home } from './pages/Home';
import { NewsUpdates } from './pages/NewsUpdates';
import { ExploreSchemes } from './pages/ExploreSchemes';
import { EligibilityChecker, type EligibilitySession } from './pages/EligibilityChecker';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { SavedSchemes } from './pages/SavedSchemes';
import { MyProfile } from './pages/MyProfile';
import { Settings } from './pages/Settings';
import { TEXT_SIZE_SCALE } from './utils/textSize';
import { SCHEMES_DATA, USER_PROFILE_DEFAULT } from './data/mockData';
import { askVaidha } from './utils/chatApi';
import { authApi, type Account } from './utils/authApi';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { HTML_LANG, LanguageContext } from './i18n';
import type { Language, Message, NavTab, TextSize, UserProfile } from './types';

const MOBILE_QUERY = '(max-width: 768px)';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const local = localStorage.getItem('vaidha_language');
    return local === 'Hindi' || local === 'Marathi' ? local : 'English';
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    const local = localStorage.getItem('vaidha_text_size');
    return local === 'large' || local === 'larger' ? local : 'normal';
  });

  // Messages in the active conversation
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Saved / bookmarked schemes IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem('vaidha_saved_schemes');
    return local ? JSON.parse(local) : ['sch-1', 'sch-2'];
  });

  // Bookmarked news IDs
  const [bookmarkedNewsIds, setBookmarkedNewsIds] = useState<string[]>(() => {
    const local = localStorage.getItem('vaidha_bookmarked_news');
    return local ? JSON.parse(local) : ['news-1'];
  });

  // Kept here so eligibility results survive a trip to the Document Library and back.
  const [eligibilitySession, setEligibilitySession] = useState<EligibilitySession | null>(null);
  // Set when another page links straight to one document guide.
  const [openDocId, setOpenDocId] = useState<string | undefined>();

  // Logged-in account: undefined while checking the session, null when logged out.
  const [account, setAccount] = useState<Account | null | undefined>(undefined);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const local = localStorage.getItem('vaidha_user_profile');
    return local ? JSON.parse(local) : USER_PROFILE_DEFAULT;
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // The account is the source of truth for language and basic details once someone logs in.
  const applyAccount = useCallback((next: Account | null) => {
    setAccount(next);
    if (!next) return;
    const { name, state, district, language } = next.details;
    if (language) setSelectedLanguage(language);
    setUserProfile((prev) => ({
      ...prev,
      phone: next.phone,
      ...(name && { name }),
      ...(state && { state }),
      ...(district !== undefined && { district }),
    }));
  }, []);

  useEffect(() => {
    authApi.me('English').then((result) => applyAccount(result.ok ? result.data : null));
  }, [applyAccount]);

  const handleChangeLanguage = (language: Language) => {
    setSelectedLanguage(language);
    if (account) authApi.updateDetails({ language }, language).then((r) => r.ok && applyAccount(r.data));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    if (account && profile.name.trim()) {
      authApi
        .updateDetails({ name: profile.name.trim(), state: profile.state, district: profile.district }, selectedLanguage)
        .then((r) => r.ok && applyAccount(r.data));
    }
  };

  const handleLogout = async () => {
    await authApi.logout(selectedLanguage);
    setAccount(null);
    setMessages([]);
    setEligibilitySession(null);
    setUserProfile(USER_PROFILE_DEFAULT);
    setActiveTab('home');
  };

  useEffect(() => {
    localStorage.setItem('vaidha_saved_schemes', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('vaidha_bookmarked_news', JSON.stringify(bookmarkedNewsIds));
  }, [bookmarkedNewsIds]);

  useEffect(() => {
    localStorage.setItem('vaidha_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('vaidha_text_size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('vaidha_language', selectedLanguage);
    // Lets screen readers and the browser use the right voice and fonts for Hindi/Marathi.
    document.documentElement.lang = HTML_LANG[selectedLanguage];
  }, [selectedLanguage]);

  // Pixel sizes are used throughout, so text size scales the whole app with CSS zoom.
  // Width and height are divided by the same factor so the app still fills the window.
  const zoom = TEXT_SIZE_SCALE[textSize];

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileNavOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Track the ID of the last user query sent so it can be anchored at the top
  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);

  // When a new user message is submitted, position the conversation viewport so the user's question
  // appears at the top (with appropriate padding) and stays anchored while the assistant response streams/renders.
  useEffect(() => {
    if (!activeQueryId || !scrollRef.current) return;
    const userElement = document.getElementById(activeQueryId);
    if (userElement && scrollRef.current) {
      // Calculate top position of the user question relative to the scroll container
      const containerRect = scrollRef.current.getBoundingClientRect();
      const elRect = userElement.getBoundingClientRect();
      const targetScrollTop = scrollRef.current.scrollTop + (elRect.top - containerRect.top) - 16;
      scrollRef.current.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }
  }, [activeQueryId]);

  // New Chat action: resets current conversation and returns to the clean welcome screen on Home
  const handleNewChat = () => {
    setMessages([]);
    setActiveTab('home');
    setMobileNavOpen(false);
  };

  const handleToggleSaveScheme = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleBookmarkNews = (id: string) => {
    setBookmarkedNewsIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSendMessage = (text: string) => {
    // If not currently on Home, switch to Home
    if (activeTab !== 'home') {
      setActiveTab('home');
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: timeString,
      content: text,
    };

    const history = messages.map((m) => ({ role: m.sender, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setActiveQueryId(userMsg.id);
    setIsLoading(true);

    askVaidha(text, history, selectedLanguage).then((reply) => {
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    });
  };

  // Login comes first; a new account fills in its details once before entering the app.
  if (!account || account.needsDetails) {
    return (
      <LanguageContext value={selectedLanguage}>
        <div style={{ height: `${100 / zoom}vh`, width: `${100 / zoom}vw`, zoom, overflowY: 'auto', backgroundColor: 'var(--workspace-bg)' }}>
          {account === null && <Login onLanguageChange={setSelectedLanguage} onLoggedIn={applyAccount} />}
          {account?.needsDetails && <Onboarding account={account} onLanguageChange={setSelectedLanguage} onDone={applyAccount} />}
        </div>
      </LanguageContext>
    );
  }

  return (
    <LanguageContext value={selectedLanguage}>
    <div
      style={{
        display: 'flex',
        height: `${100 / zoom}vh`,
        width: `${100 / zoom}vw`,
        zoom,
        overflow: 'hidden',
        backgroundColor: 'var(--workspace-bg)',
      }}
    >
      {/* Fixed compact dark sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setOpenDocId(undefined);
          setMobileNavOpen(false);
        }}
        onNewChat={handleNewChat}
        isCollapsed={!isMobile && sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
        isMobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Workspace Area */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--workspace-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header with clean branding and language selector */}
        <ChatHeader
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onOpenMenu={isMobile ? () => setMobileNavOpen(true) : undefined}
        />

        {/* View Router based on active tab */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeTab === 'home' && (
            <Home
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              scrollRef={scrollRef}
              onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            />
          )}

          {activeTab === 'news' && (
            <NewsUpdates
              bookmarkedNewsIds={bookmarkedNewsIds}
              onToggleBookmarkNews={handleToggleBookmarkNews}
              onAskAboutNews={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'schemes' && (
            <ExploreSchemes
              schemes={SCHEMES_DATA}
              savedIds={savedIds}
              onToggleSave={handleToggleSaveScheme}
              onAskScheme={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'eligibility' && (
            <EligibilityChecker
              schemes={SCHEMES_DATA}
              userProfile={userProfile}
              savedIds={savedIds}
              onToggleSave={handleToggleSaveScheme}
              onAsk={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
              onOpenDocument={(id) => {
                setOpenDocId(id);
                setActiveTab('documents');
              }}
              session={eligibilitySession}
              onSession={setEligibilitySession}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentLibrary
              initialOpenId={openDocId}
              onAskDoc={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
            />
          )}

          {activeTab === 'saved' && (
            <SavedSchemes
              schemes={SCHEMES_DATA}
              savedIds={savedIds}
              onRemoveSaved={handleToggleSaveScheme}
              onAskScheme={(q) => {
                setActiveTab('home');
                handleSendMessage(q);
              }}
              onGoToExplore={() => setActiveTab('schemes')}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfile
              profile={userProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              textSize={textSize}
              onChangeTextSize={setTextSize}
              language={selectedLanguage}
              onChangeLanguage={handleChangeLanguage}
              phone={account.phone}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
    </LanguageContext>
  );
}

export default App;
