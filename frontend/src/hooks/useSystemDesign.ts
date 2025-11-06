import { useSystemDesign } from '../context/SystemDesignContext';

export const useSystemDesignHook = () => {
  const context = useSystemDesign();
  return context;
};

