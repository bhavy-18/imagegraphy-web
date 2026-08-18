import { useEffect, useLayoutEffect, useRef, useState, memo } from 'react';

import { projectsData } from '../../data/projectsData';
import { SITE_TITLE } from '../../hooks/useDocumentTitle';

const resetScrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  const scrollables = document.querySelectorAll(
    '.project-details-container, .projects, .lightbox-overlay, .main-content'
  );
  scrollables.forEach((el) => {
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
};

const ProjectItem = memo(({ project, idx, onClick }) => {
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
      <img
        src={project.cover}
        alt={project.title || `Project ${idx + 1}`}
        loading={idx < 2 ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={idx < 2 ? 'high' : 'auto'}
      />
    </div>
  );
});

const ProjectDetailThumb = memo(({ imgSrc, alt, imgIdx, onClick }) => (
  <div className="project-detail-thumb" onClick={onClick}>
    <img
      src={imgSrc}
      alt={alt}
      loading={imgIdx < 8 ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={imgIdx < 4 ? 'high' : 'auto'}
    />
  </div>
));

const AlbumsSection = memo(({
  albumViewerIndex,
  setAlbumViewerIndex,
  onUpdateProjectViewerState,
  registerProjectHandlers
}) => {
  const [activeProjIndex, setActiveProjIndex] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showGalleryGrid, setShowGalleryGrid] = useState(false);
  const [hoverZone, setHoverZone] = useState(null);

  useLayoutEffect(() => {
    resetScrollToTop();
    const rafId = requestAnimationFrame(() => {
      resetScrollToTop();
    });
    return () => cancelAnimationFrame(rafId);
  }, [activeProjIndex, showGalleryGrid, activeImgIndex]);

  const openProjectGallery = (pIdx) => {
    setActiveProjIndex(pIdx);
    setActiveImgIndex(0);
    setShowGalleryGrid(true);
    resetScrollToTop();
    if (typeof setAlbumViewerIndex === 'function') setAlbumViewerIndex(pIdx);
  };

  const closeViewer = () => {
    setActiveProjIndex(null);
    setActiveImgIndex(0);
    setShowGalleryGrid(false);
    resetScrollToTop();
    if (typeof setAlbumViewerIndex === 'function') setAlbumViewerIndex(null);
  };

  const openSingleView = (imgIdx) => {
    setActiveImgIndex(imgIdx);
    setShowGalleryGrid(false);
    resetScrollToTop();
  };

  useEffect(() => {
    if (typeof albumViewerIndex === 'number' && albumViewerIndex >= 0 && albumViewerIndex < projectsData.length) {
      setActiveProjIndex(albumViewerIndex);
      setActiveImgIndex(0);
      setShowGalleryGrid(true);
      resetScrollToTop();
    } else if (albumViewerIndex === null) {
      setActiveProjIndex(null);
      setShowGalleryGrid(false);
      resetScrollToTop();
    }
  }, [albumViewerIndex]);

  const activeProject = activeProjIndex !== null ? projectsData[activeProjIndex] : null;
  const projectImages = activeProject ? activeProject.images : [];

  // Update browser tab title dynamically replacing "Project" with the opened project's name
  useEffect(() => {
    if (activeProject && activeProject.title) {
      document.title = `${activeProject.title} | ${SITE_TITLE}`;
    } else {
      document.title = `Project | ${SITE_TITLE}`;
    }
    return () => {
      document.title = `Project | ${SITE_TITLE}`;
    };
  }, [activeProject]);

  // Preload adjacent images for smooth single image navigation
  useEffect(() => {
    if (!projectImages || projectImages.length <= 1) return;
    const nextIdx = (activeImgIndex + 1) % projectImages.length;
    const prevIdx = (activeImgIndex - 1 + projectImages.length) % projectImages.length;
    const img1 = new Image();
    img1.src = projectImages[nextIdx];
    const img2 = new Image();
    img2.src = projectImages[prevIdx];
  }, [activeImgIndex, projectImages]);

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
    const imgEl = e.currentTarget.querySelector('img');
    if (!imgEl || (e.target !== imgEl && !imgEl.contains(e.target))) {
      setHoverZone(null);
      return;
    }
    const rect = imgEl.getBoundingClientRect();
    setHoverZone(getZone(e.clientX, rect.width, rect.left));
  };

  const handlePointerLeave = () => {
    setHoverZone(null);
  };

  const handleImageClick = (e) => {
    if (e.target.tagName !== 'IMG') return;

    const rect = e.target.getBoundingClientRect();
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
        <div className="project-details-container">
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
          </div>

          <div className="project-details-grid">
            {projectImages.map((imgSrc, imgIdx) => (
              <ProjectDetailThumb
                key={imgSrc}
                imgSrc={imgSrc}
                alt={`${activeProject.title} ${imgIdx + 1}`}
                imgIdx={imgIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  openSingleView(imgIdx);
                }}
              />
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
      <main className="main-content project-single-main">
        <div
          className="image"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ cursor: cursorStyle }}
        >
          <img
            key={activeImgIndex}
            src={projectImages[activeImgIndex]}
            alt={`${activeProject.title} ${activeImgIndex + 1}`}
            loading="eager"
            onClick={handleImageClick}
            decoding="async"
            fetchpriority="high"
          />
        </div>
      </main>
    </section>
  );
});

export default AlbumsSection;
