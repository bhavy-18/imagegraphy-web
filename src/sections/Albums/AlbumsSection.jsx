import { useEffect, useRef, useState } from 'react';

import { projectsData } from '../../data/projectsData';

const ProjectItem = ({ project, idx, onClick }) => {
  const [visible, setVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isLeft = idx % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`project ${isLeft ? 'slide-from-left' : 'slide-from-right'} ${visible ? 'is-visible' : ''}`}
      onClick={onClick}
    >
      <img src={project.cover} alt={project.title || `Project ${idx + 1}`} loading="lazy" />
    </div>
  );
};

const AlbumsSection = ({
  albumViewerIndex,
  setAlbumViewerIndex,
  onUpdateProjectViewerState,
  registerProjectHandlers
}) => {
  const [activeProjIndex, setActiveProjIndex] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showGalleryGrid, setShowGalleryGrid] = useState(false);
  const [hoverZone, setHoverZone] = useState(null);

  const openProjectGallery = (pIdx) => {
    setActiveProjIndex(pIdx);
    setActiveImgIndex(0);
    setShowGalleryGrid(true);
    if (typeof setAlbumViewerIndex === 'function') setAlbumViewerIndex(pIdx);
  };

  const closeViewer = () => {
    setActiveProjIndex(null);
    setActiveImgIndex(0);
    setShowGalleryGrid(false);
    if (typeof setAlbumViewerIndex === 'function') setAlbumViewerIndex(null);
  };

  const openSingleView = (imgIdx) => {
    setActiveImgIndex(imgIdx);
    setShowGalleryGrid(false);
  };

  useEffect(() => {
    if (typeof albumViewerIndex === 'number' && albumViewerIndex >= 0 && albumViewerIndex < projectsData.length) {
      setActiveProjIndex(albumViewerIndex);
      setActiveImgIndex(0);
      setShowGalleryGrid(true);
    } else if (albumViewerIndex === null) {
      setActiveProjIndex(null);
      setShowGalleryGrid(false);
    }
  }, [albumViewerIndex]);

  const activeProject = activeProjIndex !== null ? projectsData[activeProjIndex] : null;
  const projectImages = activeProject ? activeProject.images : [];

  const goPrev = () => {
    if (!projectImages.length) return;
    setActiveImgIndex((current) => (current === 0 ? projectImages.length - 1 : current - 1));
  };

  const goNext = () => {
    if (!projectImages.length) return;
    setActiveImgIndex((current) => (current === projectImages.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    if (typeof onUpdateProjectViewerState === 'function') {
      onUpdateProjectViewerState({
        activeProjIndex,
        showGalleryGrid,
        activeImgIndex
      });
    }
  }, [activeProjIndex, showGalleryGrid, activeImgIndex, onUpdateProjectViewerState]);

  useEffect(() => {
    if (typeof registerProjectHandlers === 'function') {
      registerProjectHandlers({
        goPrev,
        goNext,
        showThumbnails: () => {
          setShowGalleryGrid(true);
        }
      });
    }
  }, [projectImages, registerProjectHandlers]);

  useEffect(() => {
    const handleKeydown = (event) => {
      if (activeProjIndex === null) return;
      if (!showGalleryGrid) {
        if (event.key === 'Escape') setShowGalleryGrid(true);
        if (event.key === 'ArrowLeft') goPrev();
        if (event.key === 'ArrowRight') goNext();
      } else {
        if (event.key === 'Escape') closeViewer();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [activeProjIndex, showGalleryGrid, projectImages]);

  const getZone = (clientX, width, left) => {
    const x = clientX - left;
    const third = width / 3;
    if (x < third) return 'prev';
    if (x > width - third) return 'next';
    return 'center';
  };

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverZone(getZone(e.clientX, rect.width, rect.left));
  };

  const handlePointerLeave = () => {
    setHoverZone(null);
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const zone = getZone(e.clientX, rect.width, rect.left);

    if (zone === 'prev') {
      goPrev();
      return;
    }

    if (zone === 'next') {
      goNext();
      return;
    }

    setShowGalleryGrid(true);
  };

  // Level 1: Main 2-Column Projects List
  if (!activeProject) {
    return (
      <section id="projects" className="page active projects">
        <div className="projects-header" />
        <div className="projects-grid">
          {projectsData.map((project, idx) => (
            <ProjectItem
              key={project.id || idx}
              project={project}
              idx={idx}
              onClick={() => openProjectGallery(idx)}
            />
          ))}
        </div>
      </section>
    );
  }

  // Level 2: Project Album Images Thumbnail Grid
  if (showGalleryGrid) {
    return (
      <section id="projects" className="page active projects">
        <div
          className="project-details-container"
          onClick={(e) => {
            if (
              e.target === e.currentTarget ||
              e.target.classList.contains('project-details-container')
            ) {
              closeViewer();
            }
          }}
        >
          <div className="project-details-header" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={closeViewer}
              className="back-to-projects-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                letterSpacing: '0.12em',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0',
                transition: 'color 0.2s ease'
              }}
            >
              &#8592; BACK TO PROJECTS
            </button>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.08em', color: '#111', textTransform: 'uppercase' }}>
              {activeProject.title}
            </span>
          </div>

          <div className="project-details-grid">
            {projectImages.map((imgSrc, imgIdx) => (
              <div
                key={imgIdx}
                className="project-detail-thumb"
                onClick={(e) => {
                  e.stopPropagation();
                  openSingleView(imgIdx);
                }}
              >
                <img src={imgSrc} alt={`${activeProject.title} ${imgIdx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Level 3: Single Image View (works identical to Overview section gallery)
  const cursorStyle =
    hoverZone === 'prev'
      ? 'w-resize'
      : hoverZone === 'next'
        ? 'e-resize'
        : hoverZone === 'center'
          ? 'pointer'
          : 'auto';

  return (
    <section id="projects" className="page active projects">
      <main className="main-content">
        <div
          className="image"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleImageClick}
          style={{ cursor: cursorStyle }}
        >
          <img
            key={activeImgIndex}
            src={projectImages[activeImgIndex]}
            alt={`${activeProject.title} ${activeImgIndex + 1}`}
            loading="eager"
          />
        </div>
      </main>
    </section>
  );
};

export default AlbumsSection;
