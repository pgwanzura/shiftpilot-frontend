import { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput = ({ className = '', ...props }: SearchInputProps) => {
  const baseClasses =
    'block w-full rounded-xl border bg-gray-50/80 pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-200';

  const borderClasses = 'border-gray-300 focus:border-indigo-400';

  const classes = `${baseClasses} ${borderClasses} ${className}`;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input type="text" className={classes} {...props} />
    </div>
  );
};

export default SearchInput;
