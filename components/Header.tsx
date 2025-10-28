import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Page, Currency } from '../types';

const NuroLogo: React.FC<{ size?: number; clipId: string }> = ({ size = 32, clipId }) => {
    const height = size;
    const width = (size / 25) * 95; // Aspect ratio of 95:25 from the logo design
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 95 25"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Nuro Logo"
        >
            <g>
                <defs>
                    <clipPath id={clipId}>
                        <path d="M0 0 H 19 V 25 H 0 Z" />
                    </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                    {/* The C-shape of the icon */}
                    <circle cx="12.5" cy="12.5" r="11" stroke="white" strokeWidth="3.5" fill="none" />
                </g>
                {/* The dot inside the icon */}
                <circle cx="12.5" cy="12.5" r="3.5" fill="white" />
            </g>
            <text x="32" y="19.5" fontFamily="Poppins, sans-serif" fontSize="18" fontWeight="500">
                nuro
            </text>
        </svg>
    );
};

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
    if (user.avatarUrl) {
        return <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />;
    }
    return (
        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
        </div>
    );
};


interface HeaderProps {
    currentUser: User | null;
    currentPage: Page;
    searchQuery: string;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onContact: () => void;
    onSearchChange: (query: string) => void;
    currency: Currency;
}

const Header: React.FC<HeaderProps> = ({ currentUser, currentPage, searchQuery, onNavigate, onLogout, onContact, onSearchChange, currency }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalName = currentUser?.role ? `${currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase()} Portal` : '';
  
  const handleLogoClick = () => {
      if (currentUser) {
          onNavigate(Page.DASHBOARD);
      } else {
          onNavigate(Page.HOME);
      }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const navLinkClasses = "text-sm font-medium text-gray-400 hover:text-white transition-colors";
  const navLinks = (
      <>
        <button onClick={() => onNavigate(Page.HOME)} className={navLinkClasses}>Home</button>
        <button onClick={() => onNavigate(Page.LIVE_CLASS)} className={navLinkClasses}>AI Teacher</button>
        <button onClick={() => onNavigate(Page.NURO_CHAT)} className={navLinkClasses}>Nuro Chat</button>
        <button onClick={() => onNavigate(Page.STUDIO)} className={navLinkClasses}>Studio</button>
        <button onClick={() => onNavigate(Page.AI_WEBSITE_BUILDER)} className={navLinkClasses}>Design</button>
        <button onClick={() => onNavigate(Page.PRICING)} className={navLinkClasses}>Pricing</button>
        <button onClick={() => onNavigate(Page.CONTACT_SALES)} className={navLinkClasses}>Contact</button>
      </>
  );

  return (
    <header className="py-3 px-6 flex items-center justify-between border-b border-gray-800 fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-30 h-16">
      <div className="flex items-center gap-4">
        <button onClick={handleLogoClick} className="flex items-center gap-3">
            <NuroLogo size={32} clipId="header-logo-clip" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
             AI Labs <span className="text-indigo-400 font-light hidden sm:inline">{currentUser ? portalName : ''}</span>
            </h1>
        </button>
      </div>

      <div className="flex-1 flex justify-center px-8">
        {currentUser && currentPage === Page.DASHBOARD && (
             <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search teachers or topics..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
            </div>
        )}
      </div>

      <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4">
             {navLinks}
          </nav>

          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center gap-2 rounded-full border-2 border-transparent hover:border-indigo-500 transition-colors">
                    <UserAvatar user={currentUser} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50">
                        <button 
                            onClick={() => { onNavigate(Page.DASHBOARD); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => { onNavigate(Page.PROFILE); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            My Profile
                        </button>
                        <button 
                            onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
          ) : (
            <button onClick={() => onNavigate(Page.LOGIN)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                Sign In
            </button>
          )}
      </div>
    </header>
  );
};

export default Header;