import { useMCQ } from '../../context/MCQContext';
import { QUESTION_STATUS } from '../../utils/constants';

const QuestionStatusCounters = () => {
  const { getStatusCounts } = useMCQ();
  const counts = getStatusCounts();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 p-2">
        <div className="w-6 h-6 flex items-center justify-center rounded bg-green-100 text-green-600 text-sm">✓</div>
        <span className="flex-1 text-sm text-gray-600">Answered</span>
        <span className="font-semibold text-gray-800 min-w-6 text-right">{counts[QUESTION_STATUS.ANSWERED] || 0}</span>
      </div>
      <div className="flex items-center gap-3 p-2">
        <div className="w-6 h-6 flex items-center justify-center rounded bg-purple-100 text-purple-600 text-sm">🚩</div>
        <span className="flex-1 text-sm text-gray-600">Marked</span>
        <span className="font-semibold text-gray-800 min-w-6 text-right">{counts[QUESTION_STATUS.MARKED] || 0}</span>
      </div>
      <div className="flex items-center gap-3 p-2">
        <div className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-gray-600 text-sm">⚪</div>
        <span className="flex-1 text-sm text-gray-600">Not Answered</span>
        <span className="font-semibold text-gray-800 min-w-6 text-right">{counts[QUESTION_STATUS.NOT_ANSWERED] || 0}</span>
      </div>
    </div>
  );
};

export default QuestionStatusCounters;
