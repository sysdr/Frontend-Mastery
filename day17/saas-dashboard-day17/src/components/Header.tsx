import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="header">
      <div className="header-brand">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"></path></svg>
        SaaS Dashboard
      </div>
      <button className="header-toggle-button" onClick={onToggleSidebar}>
        {isSidebarOpen ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 11H5v2h14v-2z"></path></svg>
            <span>Collapse</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 6h16v2H4zm4 5h12v2H8zm-4 5h16v2H4z"></path></svg>
            <span>Expand</span>
          </>
        )}
      </button>
    </header>
  );
};

export default Header;
