import { useState, useRef, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Sidebar from './components/layout/Sidebar';
import { overviewImages } from './data/overviewImages';
import { albumImages } from './data/albumImages';
import AppRoutes from './routes/AppRoutes';
import './styles/animations.css';
import './styles/style.css';

const App = () => {
  const [overviewIndex, setOverviewIndex] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [albumViewerIndex, setAlbumViewerIndex] = useState(null);
  const [projectViewerState, setProjectViewerState] = useState({
    activeProjIndex: null,
    showGalleryGrid: false,
    activeImgIndex: 0
  });

  const projectHandlersRef = useRef({});

  const registerProjectHandlers = useCallback((handlers) => {
    projectHandlersRef.current = handlers;
  }, []);

  const handleLogoClick = () => {
    setOverviewIndex(0);
    setShowThumbnails(false);
    setAlbumViewerIndex(null);
  };

  const handleProjectNavClick = () => {
    setAlbumViewerIndex(null);
    setProjectViewerState({
      activeProjIndex: null,
      showGalleryGrid: false,
      activeImgIndex: 0
    });
  };

  const handlePrevOverview = () => {
    setOverviewIndex((prev) => (prev === 0 ? overviewImages.length - 1 : prev - 1));
  };

  const handleNextOverview = () => {
    setOverviewIndex((prev) => (prev === overviewImages.length - 1 ? 0 : prev + 1));
  };

  const handleToggleThumbnails = () => {
    setShowThumbnails((prev) => !prev);
  };

  const handlePrevProject = () => {
    if (projectHandlersRef.current.goPrev) {
      projectHandlersRef.current.goPrev();
    }
  };

  const handleNextProject = () => {
    if (projectHandlersRef.current.goNext) {
      projectHandlersRef.current.goNext();
    }
  };

  const handleShowProjectThumbnails = () => {
    if (projectHandlersRef.current.showThumbnails) {
      projectHandlersRef.current.showThumbnails();
    }
  };

  const getSafeAlbumIndex = (index) => {
    if (typeof index !== 'number' || Number.isNaN(index)) return null;
    if (index < 0) return 0;
    return Math.min(index, albumImages.length - 1);
  };

  const handleOpenAlbum = (index = null) => {
    const safeIndex = getSafeAlbumIndex(index);
    setShowThumbnails(true);
    if (index !== null) setOverviewIndex(index);
    setAlbumViewerIndex(safeIndex);
  };

  const handleSelectOverviewIndex = (idx) => {
    setOverviewIndex(idx);
    setShowThumbnails(false);
    setAlbumViewerIndex(getSafeAlbumIndex(idx));
  };

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="app-container">
        <Sidebar
          onLogoClick={handleLogoClick}
          onPrevOverview={handlePrevOverview}
          onNextOverview={handleNextOverview}
          showThumbnails={showThumbnails}
          onToggleThumbnails={handleToggleThumbnails}
          projectViewerState={projectViewerState}
          onPrevProject={handlePrevProject}
          onNextProject={handleNextProject}
          onShowProjectThumbnails={handleShowProjectThumbnails}
          onProjectNavClick={handleProjectNavClick}
        />
        <AppRoutes
          overviewIndex={overviewIndex}
          handlePrevOverview={handlePrevOverview}
          handleNextOverview={handleNextOverview}
          showThumbnails={showThumbnails}
          handleToggleThumbnails={handleToggleThumbnails}
          handleSelectOverviewIndex={handleSelectOverviewIndex}
          handleOpenAlbum={handleOpenAlbum}
          albumViewerIndex={albumViewerIndex}
          setAlbumViewerIndex={setAlbumViewerIndex}
          onUpdateProjectViewerState={setProjectViewerState}
          registerProjectHandlers={registerProjectHandlers}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
