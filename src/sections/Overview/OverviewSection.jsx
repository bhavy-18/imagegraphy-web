import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { overviewImages } from '../../data/overviewImages';
import { getImageNavZone, isInteractiveElement } from '../../utils/imageNav';

const OverviewThumbItem = memo(({ imgSrc, alt, idx, onClick }) => (
  <div className="overview-thumb-item" onClick={onClick}>
    <img
      src={imgSrc}
      alt={alt}
      loading={idx < 8 ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={idx < 4 ? 'high' : 'auto'}
    />
  </div>
));

const OverviewSection = memo(({
  overviewIndex,
  onPrevOverview,
  onNextOverview,
  showThumbnails,
  onToggleThumbnails,
  onSelectOverviewIndex,
  onOpenAlbum,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverZone, setHoverZone] = useState(null);

  const desktopImgRef = useRef(null);
  const mobileImgRef = useRef(null);

  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 820 : false
  );
  const [mobileActiveIndex, setMobileActiveIndex] = useState(null);

  // Passive resize listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 820;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileActiveIndex(null);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileActiveIndex(null);
  }, [location.pathname, overviewIndex]);

  // Preload adjacent images for instantaneous slideshow navigation
  useEffect(() => {
    if (!overviewImages || overviewImages.length <= 1) return;
    const activeIdx = isMobile && mobileActiveIndex !== null ? mobileActiveIndex : overviewIndex;
    const nextIdx = (activeIdx + 1) % overviewImages.length;
    const prevIdx = (activeIdx - 1 + overviewImages.length) % overviewImages.length;
    const img1 = new Image();
    img1.src = overviewImages[nextIdx];
    const img2 = new Image();
    img2.src = overviewImages[prevIdx];
  }, [overviewIndex, mobileActiveIndex, isMobile]);

  // --- DESKTOP: Full-screen background click & hover navigation ---
  useEffect(() => {
    if (isMobile || showThumbnails) {
      document.body.style.cursor = '';
      return;
    }

    const handlePointerMove = (e) => {
      if (isInteractiveElement(e.target)) {
        setHoverZone(null);
        document.body.style.cursor = '';
        return;
      }
      const zone = getImageNavZone(e.clientX, e.clientY, desktopImgRef.current);
      setHoverZone(zone);
      const cursor =
        zone === 'prev'
          ? 'w-resize'
          : zone === 'next'
            ? 'e-resize'
            : zone === 'center'
              ? 'pointer'
              : '';
      document.body.style.cursor = cursor;
    };

    const handlePointerLeave = () => {
      setHoverZone(null);
      document.body.style.cursor = '';
    };

    const handleWindowClick = (e) => {
      // Only process primary clicks
      if (e.button !== 0) return;

      // Do NOT trigger navigation if clicking sidebar or interactive controls
      if (isInteractiveElement(e.target)) {
        return;
      }

      const zone = getImageNavZone(e.clientX, e.clientY, desktopImgRef.current);
      if (zone === 'prev') {
        onPrevOverview();
      } else if (zone === 'next') {
        onNextOverview();
      } else if (zone === 'center') {
        if (onToggleThumbnails) {
          onToggleThumbnails();
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('click', handleWindowClick, true);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleWindowClick, true);
      document.body.style.cursor = '';
    };
  }, [isMobile, showThumbnails, onPrevOverview, onNextOverview, onToggleThumbnails]);

  // --- MOBILE: Full-screen background tap navigation for single view ---
  useEffect(() => {
    if (!isMobile || mobileActiveIndex === null) {
      document.body.style.cursor = '';
      return;
    }

    const handleMobilePointerMove = (e) => {
      if (isInteractiveElement(e.target)) {
        setHoverZone(null);
        document.body.style.cursor = '';
        return;
      }
      const zone = getImageNavZone(e.clientX, e.clientY, mobileImgRef.current);
      setHoverZone(zone);
    };

    const handleMobilePointerLeave = () => {
      setHoverZone(null);
      document.body.style.cursor = '';
    };

    const handleMobileWindowClick = (e) => {
      if (e.button !== 0) return;
      if (isInteractiveElement(e.target)) {
        return;
      }

      const zone = getImageNavZone(e.clientX, e.clientY, mobileImgRef.current);
      if (zone === 'prev') {
        setMobileActiveIndex((prev) => (prev === 0 ? overviewImages.length - 1 : prev - 1));
      } else if (zone === 'next') {
        setMobileActiveIndex((prev) => (prev === overviewImages.length - 1 ? 0 : prev + 1));
      } else if (zone === 'center') {
        setMobileActiveIndex(null);
      }
    };

    window.addEventListener('pointermove', handleMobilePointerMove);
    document.addEventListener('pointerleave', handleMobilePointerLeave);
    window.addEventListener('click', handleMobileWindowClick, true);

    return () => {
      window.removeEventListener('pointermove', handleMobilePointerMove);
      document.removeEventListener('pointerleave', handleMobilePointerLeave);
      window.removeEventListener('click', handleMobileWindowClick, true);
      document.body.style.cursor = '';
    };
  }, [isMobile, mobileActiveIndex]);

  // --- MOBILE VIEW: Open full image gallery catalog by default ---
  if (isMobile) {
    if (mobileActiveIndex === null) {
      return (
        <section id="overview" className="page active">
          <div className="overview-thumbnails-container">
            <div className="overview-thumbnails-grid">
              {overviewImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="overview-thumb-item"
                  onClick={() => setMobileActiveIndex(idx)}
                >
                  <img src={imgSrc} alt={`Overview thumbnail ${idx + 1}`} loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    const currentMobileImg = overviewImages[mobileActiveIndex] || overviewImages[0];

    const cursorStyle =
      hoverZone === 'prev'
        ? 'w-resize'
        : hoverZone === 'next'
          ? 'e-resize'
          : hoverZone === 'center'
            ? 'pointer'
            : 'auto';

    return (
      <section id="overview" className="page active" style={{ cursor: cursorStyle }}>
        <main className="main-content" style={{ cursor: cursorStyle }}>
          <div
            className="image"
            style={{ cursor: cursorStyle }}
          >
            <img
              ref={mobileImgRef}
              src={currentMobileImg}
              alt={`Overview slide ${mobileActiveIndex + 1}`}
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </div>
        </main>
      </section>
    );
  }

  // --- DESKTOP / TABLET VIEW ---
  const currentImg = overviewImages[overviewIndex] || overviewImages[0];

  if (showThumbnails) {
    return (
      <section id="overview" className="page active">
        <div className="overview-thumbnails-container">
          <div className="overview-thumbnails-grid">
            {overviewImages.map((imgSrc, idx) => (
              <OverviewThumbItem
                key={imgSrc}
                imgSrc={imgSrc}
                alt={`Overview thumbnail ${idx + 1}`}
                idx={idx}
                onClick={() => onSelectOverviewIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const cursorStyle =
    hoverZone === 'prev'
      ? 'w-resize'
      : hoverZone === 'next'
        ? 'e-resize'
        : hoverZone === 'center'
          ? 'pointer'
          : 'auto';

  return (
    <section id="overview" className="page active" style={{ cursor: cursorStyle }}>
      <main className="main-content" style={{ cursor: cursorStyle }}>
        <div
          className="image"
          style={{ cursor: cursorStyle }}
        >
          <img
            ref={desktopImgRef}
            src={currentImg}
            alt={`Overview slide ${overviewIndex + 1}`}
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </div>
      </main>
    </section>
  );
});

export default OverviewSection;
