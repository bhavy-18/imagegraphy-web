import { Navigate, Route, Routes } from 'react-router-dom';

import AboutPage from '../pages/AboutPage';
import OverviewPage from '../pages/OverviewPage';
import ProjectsPage from '../pages/ProjectsPage';

const AppRoutes = ({
  overviewIndex,
  handlePrevOverview,
  handleNextOverview,
  showThumbnails,
  handleToggleThumbnails,
  handleSelectOverviewIndex,
  handleOpenAlbum,
  albumViewerIndex,
  setAlbumViewerIndex,
  onUpdateProjectViewerState,
  registerProjectHandlers,
}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route
        path="/overview"
        element={
          <OverviewPage
            overviewIndex={overviewIndex}
            onPrevOverview={handlePrevOverview}
            onNextOverview={handleNextOverview}
            showThumbnails={showThumbnails}
            onToggleThumbnails={handleToggleThumbnails}
            onSelectOverviewIndex={handleSelectOverviewIndex}
            onOpenAlbum={handleOpenAlbum}
          />
        }
      />
      <Route
        path="/projects"
        element={
          <ProjectsPage
            albumViewerIndex={albumViewerIndex}
            setAlbumViewerIndex={setAlbumViewerIndex}
            onUpdateProjectViewerState={onUpdateProjectViewerState}
            registerProjectHandlers={registerProjectHandlers}
          />
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
};

export default AppRoutes;
