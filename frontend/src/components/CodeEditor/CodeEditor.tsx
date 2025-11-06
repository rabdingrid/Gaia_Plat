import { useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { useCoding } from '../../context/CodingContext';

const CodeEditor = () => {
  const { currentProblem, selectedLanguage, code, updateCode } = useCoding();
  const editorRef = useRef<HTMLDivElement>(null);

  if (!currentProblem) return null;

  const codeKey = `${currentProblem.id}-${selectedLanguage}`;
  const currentCode = code[codeKey] || currentProblem.boilerplate[selectedLanguage];

  const getLanguageExtension = () => {
    switch (selectedLanguage) {
      case 'python':
        return python();
      case 'javascript':
        return javascript();
      case 'java':
        return java();
      default:
        return python();
    }
  };

  return (
    <div ref={editorRef} className="h-full">
      <CodeMirror
        value={currentCode}
        height="100%"
        extensions={[getLanguageExtension()]}
        onChange={(value) => updateCode(value)}
        theme="light"
        placeholder="Write your code here..."
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false
        }}
      />
    </div>
  );
};

export default CodeEditor;

