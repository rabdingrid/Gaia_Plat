import { useCoding } from '../../context/CodingContext';

const OutputViewer = () => {
  const { output } = useCoding();

  return (
    <div className="p-4 h-full">
      <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap bg-white p-4 rounded border border-gray-200 h-full overflow-auto">
        {output || 'No output yet. Run your code to see output here.'}
      </pre>
    </div>
  );
};

export default OutputViewer;

