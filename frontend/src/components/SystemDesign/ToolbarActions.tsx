import { useSystemDesign } from '../../context/SystemDesignContext';

interface ToolbarActionsProps {
  excalidrawAPI?: any;
}

const ToolbarActions = ({ excalidrawAPI }: ToolbarActionsProps) => {
  const { clearCanvas } = useSystemDesign();

  const handleClear = () => {
    clearCanvas(excalidrawAPI);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClear}
        className="px-6 py-3 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors flex-1"
      >
        Clear
      </button>
    </div>
  );
};

export default ToolbarActions;

