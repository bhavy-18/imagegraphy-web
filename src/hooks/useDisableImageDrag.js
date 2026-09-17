import { useEffect } from 'react';

/**
 * Global hook to prevent default image dragging behavior across the entire website.
 * Multi-layered defense:
 * 1. Global capture-phase 'dragstart' event listener prevents any drag initialization on images or image containers.
 * 2. Sets draggable="false" and draggable property to false on all existing and dynamically inserted <img> elements via MutationObserver.
 * 3. Preserves all clicks, hovers, pointer events, touch scrolling, and animations.
 */
export default function useDisableImageDrag() {
  useEffect(() => {
    // 1. Capture-phase dragstart event listener
    const handleDragStart = (e) => {
      const target = e.target;
      if (
        target &&
        (target.tagName === 'IMG' ||
          (target.closest && (target.closest('img') || target.closest('svg image'))) ||
          (target.querySelector && target.querySelector('img')))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Attach to window and document in capture phase
    window.addEventListener('dragstart', handleDragStart, { capture: true, passive: false });
    document.addEventListener('dragstart', handleDragStart, { capture: true, passive: false });

    // 2. Set draggable="false" on an image element
    const markImageNonDraggable = (el) => {
      if (el && el.tagName === 'IMG') {
        if (el.getAttribute('draggable') !== 'false') {
          el.setAttribute('draggable', 'false');
        }
        if (el.draggable !== false) {
          el.draggable = false;
        }
      }
    };

    // Apply to all current images in DOM
    document.querySelectorAll('img').forEach(markImageNonDraggable);

    // 3. Observe DOM for dynamically added images or attribute mutations
    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i];
        if (mutation.type === 'childList') {
          for (let j = 0; j < mutation.addedNodes.length; j++) {
            const node = mutation.addedNodes[j];
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'IMG') {
                markImageNonDraggable(node);
              } else if (node.querySelectorAll) {
                const imgs = node.querySelectorAll('img');
                for (let k = 0; k < imgs.length; k++) {
                  markImageNonDraggable(imgs[k]);
                }
              }
            }
          }
        } else if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'draggable' &&
          mutation.target &&
          mutation.target.tagName === 'IMG'
        ) {
          if (mutation.target.getAttribute('draggable') !== 'false') {
            markImageNonDraggable(mutation.target);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['draggable']
    });

    return () => {
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      observer.disconnect();
    };
  }, []);
}
