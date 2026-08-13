import { useState, useEffect, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { overviewImages } from '../../data/overviewImages';

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

    const handleMobileImageClick = (e) => {
      if (e.target.tagName !== 'IMG') return;

      const rect = e.target.getBoundingClientRect();
      const zone = getZone(e.clientX, rect.width, rect.left);

      if (zone === 'prev') {
        setMobileActiveIndex((prev) => (prev === 0 ? overviewImages.length - 1 : prev - 1));
        return;
      }

      if (zone === 'next') {
        setMobileActiveIndex((prev) => (prev === overviewImages.length - 1 ? 0 : prev + 1));
        return;
      }

      setMobileActiveIndex(null);
    };

    const cursorStyle =
      hoverZone === 'prev'
        ? 'w-resize'
        : hoverZone === 'next'
          ? 'e-resize'
          : hoverZone === 'center'
            ? 'pointer'
            : 'auto';

    return (
      <section id="overview" className="page active">
        <main className="main-content">
          <div
            className="image"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{ cursor: cursorStyle }}
          >
            <img src={currentMobileImg} alt={`Overview slide ${mobileActiveIndex + 1}`} onClick={handleMobileImageClick} loading="eager" decoding="async" fetchpriority="high" />
          </div>
        </main>
      </section>
    );
  }

  // --- DESKTOP / TABLET VIEW ---
  const currentImg = overviewImages[overviewIndex] || overviewImages[0];

  const handleImageClick = (e) => {
    if (e.target.tagName !== 'IMG') return;

    const rect = e.target.getBoundingClientRect();
    const zone = getZone(e.clientX, rect.width, rect.left);

    if (zone === 'prev') {
      onPrevOverview();
      return;
    }

    if (zone === 'next') {
      onNextOverview();
      return;
    }

    if (onToggleThumbnails) {
      onToggleThumbnails();
    }
  };

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
    <section id="overview" className="page active">
      <main className="main-content">
        <div
          className="image"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleImageClick}
          style={{ cursor: cursorStyle }}
        >
          <img src={currentImg} alt={`Overview slide ${overviewIndex + 1}`} loading="eager" decoding="async" fetchpriority="high" />
        </div>
      </main>
    </section>
  );
});

export default OverviewSection;
