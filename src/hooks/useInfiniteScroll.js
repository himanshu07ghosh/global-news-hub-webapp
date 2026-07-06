import { useEffect, useRef } from 'react';

/**
 * Calls `onIntersect` when the returned ref's element scrolls into view.
 * Used to trigger "load more" for infinite scroll.
 */
export function useInfiniteScroll(onIntersect, { enabled = true, rootMargin = '300px' } = {}) {
  const targetRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const node = targetRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, enabled, rootMargin]);

  return targetRef;
}

export default useInfiniteScroll;
