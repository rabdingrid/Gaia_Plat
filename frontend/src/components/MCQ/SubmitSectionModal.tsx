import { useState } from 'react';
import { useMCQ } from '../../context/MCQContext';
import { submitAssessment } from '../../api/questions.api';
import { QUESTION_STATUS } from '../../utils/constants';
import type { SubmitSectionModalProps } from '../../types';

const SubmitSectionModal = ({ isOpen, onClose, onSubmit }: SubmitSectionModalProps) => {
  const { answers, questions, getStatusCounts } = useMCQ();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const counts = getStatusCounts();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAssessment(answers);
      onSubmit(answers);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = counts[QUESTION_STATUS.ANSWERED] || 0;
  const totalQuestions = questions.length;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-8 max-w-[500px] w-[90%] shadow-[0_10px_25px_rgba(0,0,0,0.2)]" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Submit Assessment</h2>
        <div className="mb-6">
          <p className="mb-2 text-gray-600">Are you sure you want to submit your assessment?</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="mb-2 text-gray-800"><strong>Total Questions:</strong> {totalQuestions}</p>
            <p className="mb-2 text-gray-800"><strong>Answered:</strong> {answeredCount}</p>
            <p className="mb-2 text-gray-800"><strong>Unanswered:</strong> {totalQuestions - answeredCount}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button 
            className="px-6 py-3 bg-transparent border-2 border-gray-200 rounded-lg text-base font-medium cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg text-base font-medium cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSectionModal;
