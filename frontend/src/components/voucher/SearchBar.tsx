import { FC, useState, useTransition } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({ onSearch, placeholder = 'Search vouchers...' }) => {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    setQuery(value);
    startTransition(() => {
      onSearch(value);
    });
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2 sm:py-3 border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 hover:border-slate-400 transition-all duration-200 ease-in-out text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        {isPending && (
          <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {query && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-slate-100 rounded-full transition-all duration-200 ease-in-out active:scale-90"
            title="Clear search"
          >
            <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};