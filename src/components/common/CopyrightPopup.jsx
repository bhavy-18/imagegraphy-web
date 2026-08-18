import { useState, useEffect } from 'react';

const CopyrightPopup = () => {
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Check if target is an image, or inside an image container
      const isImg =
        e.target instanceof HTMLImageElement ||
        e.target.tagName === 'IMG' ||
        Boolean(e.target.closest('img')) ||
        Boolean(
          e.target.closest(
            '.image, .project, .overview-thumb-item, .project-detail-thumb, .about-image, .logo, .social, .mobile-insta-link'
          )
        );

      if (isImg) {
        e.preventDefault();

        // Calculate safe position inside viewport
        const popupWidth = 260;
        const popupHeight = 65;
        const padding = 12;

        let x = e.clientX + 8;
        let y = e.clientY + 8;

        if (x + popupWidth + padding > window.innerWidth) {
          x = e.clientX - popupWidth - 8;
        }
        if (x < padding) {
          x = padding;
        }

        if (y + popupHeight + padding > window.innerHeight) {
          y = e.clientY - popupHeight - 8;
        }
        if (y < padding) {
          y = padding;
        }

        setPopup({ visible: true, x, y });
      } else {
        setPopup((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleDismiss = () => {
      setPopup((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('click', handleDismiss, true);
    window.addEventListener('pointerdown', handleDismiss, true);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('click', handleDismiss, true);
      window.removeEventListener('pointerdown', handleDismiss, true);
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  if (!popup.visible) return null;

  return (
    <div
      className="custom-copyright-popup"
      style={{
        position: 'fixed',
        left: `${popup.x}px`,
        top: `${popup.y}px`,
        zIndex: 999999,
        background: '#ffffff',
        color: '#111111',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.45,
        letterSpacing: 'normal',
        padding: '10px 14px',
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.18), 0 1px 4px rgba(0, 0, 0, 0.08)',
        maxWidth: '250px',
        pointerEvents: 'none',
        userSelect: 'none',
        animation: 'fadeIn 120ms ease both',
        boxSizing: 'border-box'
      }}
    >
      Copyright &copy; 2026 Imagegraphy.ca. All rights reserved.
    </div>
  );
};

export default CopyrightPopup;
