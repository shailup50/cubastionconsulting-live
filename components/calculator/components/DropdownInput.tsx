import { ChevronDown } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface DropdownInputProps {
  label: string;
  description: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  index?: number;
}

export const DropdownInput = ({ label, description, options, value, onChange }: DropdownInputProps) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="group !bg-slate-50 !rounded-xl !p-3 md:!p-4 !border !border-slate-200 hover:!border-blue-300 hover:!bg-white !transition-all !h-full">
      <div className="!flex !items-center !justify-between !mb-2 md:!mb-2.5">
        <div className="!flex !items-center !gap-2">
          <h3 className="!text-xs md:!text-[18px] !font-semibold !text-slate-800">{label}</h3>
        </div>
        <Tooltip content={description} />
      </div>

      <div className="!relative">
        <select
          value={value || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className={`!w-full !px-3 !py-2.5 !pr-10 !bg-white !border !border-slate-300 !rounded-lg !appearance-none !cursor-pointer !text-[14px] !font-medium hover:!border-blue-400 focus:!border-blue-500 focus:!outline-none focus:!ring-2 focus:!ring-blue-200 !transition-all !min-h-[50px] ${!value ? '!text-slate-400' : '!text-slate-700'}`}
        >
          <option value="" disabled>Select an option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !w-4 !h-4 !text-slate-400 !pointer-events-none" />
      </div>

      {selectedOption && (
        <p className="!text-[14px] !text-slate-500 !mt-2 !leading-tight">
          {selectedOption.description}
        </p>
      )}
    </div>
  );
};
