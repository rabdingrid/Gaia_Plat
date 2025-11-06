import { useSystemDesign } from '../../context/SystemDesignContext';

const Timer = () => {
  const { formatTime, timeRemaining } = useSystemDesign();

  return <span>{formatTime(timeRemaining)}</span>;
};

export default Timer;

