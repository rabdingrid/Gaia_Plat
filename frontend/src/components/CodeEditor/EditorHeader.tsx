import RunResetButtons from './RunResetButtons';

const EditorHeader = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
      <RunResetButtons />
    </div>
  );
};

export default EditorHeader;

