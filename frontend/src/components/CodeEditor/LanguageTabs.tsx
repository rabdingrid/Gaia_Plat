import { useCoding } from '../../context/CodingContext';

const LanguageTabs = () => {
  const { selectedLanguage, setLanguage } = useCoding();

  const languages = [
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'java', label: 'Java' }
  ] as const;

  return (
    <div className="flex border-b border-gray-200">
      {languages.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLanguage(lang.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            selectedLanguage === lang.id
              ? 'bg-gray-900 text-white border-b-2 border-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageTabs;

