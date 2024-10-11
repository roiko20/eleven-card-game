import { useMediaQuery } from 'react-responsive';

interface ScreenSize {
  isSmScreen: boolean;
  isMdScreen: boolean;
  isLgScreen: boolean;
}

const useScreenSize = (): ScreenSize => {
  const isSmScreen = useMediaQuery({ maxWidth: 790 });
  const isMdScreen = useMediaQuery({ minWidth: 791, maxWidth: 1250 });
  const isLgScreen = useMediaQuery({ minWidth: 1251 });

  return { isSmScreen, isMdScreen, isLgScreen };
};

export default useScreenSize;