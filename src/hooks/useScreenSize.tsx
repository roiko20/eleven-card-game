import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

interface ScreenSize {
  isSmScreen: boolean;
  isMdScreen: boolean;
  isLgScreen: boolean;
  isPortrait: boolean;
}

const useScreenSize = (): ScreenSize => {
  const isSmScreen = useMediaQuery({ maxWidth: 790 });
  const isMdScreen = useMediaQuery({ minWidth: 791, maxWidth: 1250 });
  const isLgScreen = useMediaQuery({ minWidth: 1251 });

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth - 200);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth - 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isSmScreen, isMdScreen, isLgScreen, isPortrait };
};

export default useScreenSize;