import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AboutPage = lazy(() => import('../pages/AboutPage'));
const OverviewPage = lazy(() => import('../pages/OverviewPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));

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
    <Suspense fallback={null}>
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
    </Suspense>
  );
};

export default AppRoutes;
