import { useState, useCallback, useEffect } from 'react';
import { useTheme as useNextThemesHook } from 'next-themes';

function useScroll(threshold = 0): [boolean, boolean, number] {
  const [scrolled, setScrolled] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setScrolled(scrollY > threshold);

    // Calculate progress: 0 when scrollY is 0, 1 when scrollY >= threshold
    const scrollProgress = Math.min(scrollY / threshold, 1);
    setProgress(scrollProgress);

    // Set inProgress based on scroll position
    setInProgress(scrollY > 0 && scrollY < threshold);
  }, [threshold]);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Check scroll position on initial mount
    handleScroll();

    // Cleanup function to remove event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return [scrolled, inProgress, progress];
}

function useTheme(): [string, string, () => void] {
  const { theme, setTheme } = useNextThemesHook();
  const [currentTheme, setCurrentTheme] = useState<string>('system');
  const [nextInRotation, setNextInRotation] = useState<string>('system');
  const [displayLabel, setDisplayLabel] = useState<string>('System');

  const themeRotation = ['system', 'light', 'dark'];

  useEffect(() => {
    const currentTheme = theme || 'system';

    setCurrentTheme(currentTheme);
    setNextInRotation(
      themeRotation[
        (themeRotation.indexOf(currentTheme) + 1) % themeRotation.length
      ] as string,
    );
    setDisplayLabel(
      currentTheme === 'system'
        ? 'System'
        : `${currentTheme.charAt(0).toUpperCase()}${currentTheme.slice(1)}`,
    );
  }, [theme]);

  const nextTheme = useCallback(
    () => setTheme(nextInRotation),
    [nextInRotation, setTheme],
  );

  return [currentTheme, displayLabel, nextTheme];
}

export { useScroll, useTheme };
