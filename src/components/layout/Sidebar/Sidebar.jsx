import { memo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import instaLogo from '../../../assets/images/icons/insta-logo.svg';
import logoImg from '../../../assets/images/logos/imagegraphy-logo.jpg';

const Sidebar = memo(({
  onLogoClick,
  onPrevOverview,
  onNextOverview,
  showThumbnails,
  onToggleThumbnails,
  projectViewerState,
  onPrevProject,
  onNextProject,
  onShowProjectThumbnails,
  onProjectNavClick,
}) => {
  const location = useLocation();
  const isOverview = location.pathname === '/' || location.pathname === '/overview';
  const isProjects = location.pathname.startsWith('/projects');

  const isProjectActive = isProjects && projectViewerState && projectViewerState.activeProjIndex !== null;
  const isProjectSingleView = isProjectActive && !projectViewerState.showGalleryGrid;

  const handlePrevClick = () => {
    if (isOverview) onPrevOverview();
    else if (isProjectSingleView && onPrevProject) onPrevProject();
  };

  const handleNextClick = () => {
    if (isOverview) onNextOverview();
    else if (isProjectSingleView && onNextProject) onNextProject();
  };

  const handleThumbnailsClick = () => {
    if (isOverview) onToggleThumbnails();
    else if (isProjectSingleView && onShowProjectThumbnails) onShowProjectThumbnails();
  };

  const showBottomNav = isOverview || isProjectSingleView;
  const isThumbnailsActive = isOverview ? showThumbnails : false;

  const closeMobileMenu = () => {
    const toggle = document.getElementById('site-menu-toggle');
    if (toggle) toggle.checked = false;
  };

  const handleLogoNav = () => {
    closeMobileMenu();
    if (onLogoClick) onLogoClick();
  };

  const handleProjectNav = (e) => {
    closeMobileMenu();
    if (onProjectNavClick) onProjectNavClick(e);
  };


  return (
    <aside className="sidebar">
      <input
        className="menu-toggle"
        id="site-menu-toggle"
        type="checkbox"
        aria-label="Toggle navigation menu"
      />

      <div className="sidebar-header">
        <div className="logo">
          <Link to="/overview" onClick={handleLogoNav}>
            <img src={logoImg} alt="Imagegraphy Logo" loading="eager" decoding="async" />
          </Link>
        </div>

        <div className="mobile-header-controls">
          <a
            href="https://www.instagram.com/imagegraphy_/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-insta-link"
            aria-label="Instagram"
          >
            <img src={instaLogo} alt="Instagram" loading="lazy" decoding="async" />
          </a>

          <label className="mobile-menu-title" htmlFor="site-menu-toggle" aria-label="Toggle navigation menu">
            Menu
          </label>

          <label className="hamburger" htmlFor="site-menu-toggle" aria-label="Toggle navigation menu">
            <span />
            <span />
            <span />
          </label>
        </div>
      </div>

      <div className="sidebar-drawer">
        <div className="sidebar-middle">
          <nav className="menu">
            <NavLink
              to="/overview"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobileMenu}
            >
              Overview
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={handleProjectNav}
            >
              Projects
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
          </nav>

          <div className="social">
            <a
              href="https://www.instagram.com/imagegraphy_/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
            >
              <img src={instaLogo} alt="Instagram" loading="lazy" decoding="async" />
            </a>
          </div>
        </div>

        {showBottomNav && (
          <div className="sidebar-bottom">
            <div className="bottom-nav">
              <h3 onClick={handlePrevClick} style={{ cursor: 'pointer' }}>PREV</h3>
              <h3>/</h3>
              <h3 onClick={handleNextClick} style={{ cursor: 'pointer' }}>NEXT</h3>
            </div>

            <div className="thumbnails">
              <button
                className="thumbnail-text"
                type="button"
                onClick={handleThumbnailsClick}
                aria-pressed={isThumbnailsActive}
              >
                SHOW THUMBNAILS
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
});

export default Sidebar;
