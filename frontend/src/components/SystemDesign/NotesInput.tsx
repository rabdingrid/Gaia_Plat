import { useState } from 'react';
import { useSystemDesign } from '../../context/SystemDesignContext';

const NotesInput = () => {
  const { notes, updateNotes } = useSystemDesign();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Notes</span>
        <span className="text-gray-500">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <textarea
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="Add your notes here..."
          className="w-full h-32 p-4 border-none resize-none focus:outline-none text-sm text-gray-700 bg-white"
        />
      )}
    </div>
  );
};

export default NotesInput;

