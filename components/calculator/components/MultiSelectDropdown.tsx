import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from './Tooltip';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  description: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelectDropdown = ({ label, description, options, values, onChange }: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== optionValue));
  };

  const selectedLabels = values.map((v) => {
    const option = options.find((o) => o.value === v);
    return option?.label || v;
  });

  return (
    <div
      className="group !bg-slate-50 !rounded-xl !p-3 md:!p-4 !border !border-slate-200 hover:!border-blue-300 hover:!bg-white !transition-all !h-full"
      style={{ overflow: 'visible', zIndex: isOpen ? 9999 : 'auto', position: 'relative' }}
    >
      <div className="!flex !items-center !justify-between !mb-2 md:!mb-2.5">
        <div className="!flex !items-center !gap-2">
          <h3 className="!text-xs !font-semibold !text-slate-800">{label}</h3>
        </div>
        <Tooltip content={description} />
      </div>

      <div className="!relative" style={{ overflow: 'visible' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="!w-full !px-3 !py-2.5 !pr-8 !bg-white !border !border-slate-300 !rounded-lg !text-left !text-xs md:!text-sm !font-medium !text-slate-700 hover:!border-blue-400 focus:!border-blue-500 focus:!outline-none focus:!ring-2 focus:!ring-blue-200 !transition-all !min-h-[44px]"
        >
          {values.length === 0 ? (
            <span className="!text-slate-400">Select options...</span>
          ) : (
            <div className="!flex !flex-wrap !gap-1">
              {selectedLabels.map((selectedLabel, idx) => (
                <span key={idx} className="!inline-flex !items-center !gap-1 !px-2 !py-0.5 !bg-blue-100 !text-blue-700 !rounded !text-xs !font-medium">
                  {selectedLabel}
                  <X className="!w-3 !h-3 hover:!text-blue-900 !cursor-pointer" onClick={(e) => handleRemove(values[idx], e)} />
                </span>
              ))}
            </div>
          )}
        </button>
        <ChevronDown className={`!absolute !right-3 !top-3 !w-4 !h-4 !text-slate-400 !pointer-events-none !transition-transform ${isOpen ? '!rotate-180' : ''}`} />

        {isOpen && (
          <div
            ref={dropdownRef}
            className="!absolute !w-full !mt-2 !bg-white !border-2 !border-blue-500 !rounded-lg !shadow-2xl !max-h-64 md:!max-h-96 !overflow-y-auto"
            style={{
              zIndex: 10001,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.3)',
            }}
          >
            {options.map((option) => (
              <label
                key={option.value}
                className="!flex !items-start !p-3 md:!p-2.5 hover:!bg-blue-50 !cursor-pointer !border-b !border-slate-100 last:!border-b-0 !transition-colors !min-h-[44px] active:!bg-blue-100"
              >
                <input
                  type="checkbox"
                  checked={values.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="!mt-0.5 !w-4 !h-4 md:!w-3.5 md:!h-3.5 !text-blue-600 !border-slate-300 !rounded focus:!ring-blue-500 !cursor-pointer !flex-shrink-0"
                  style={{ accentColor: '#2563eb' }}
                />
                <div className="!ml-3 md:!ml-2.5 !flex-1">
                  <div className="!text-xs !font-medium !text-slate-700">
                    {option.label}
                  </div>
                  <div className="!text-[10px] !text-slate-500 !mt-0.5 !leading-tight">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {values.length > 0 && (
        <div className="!mt-2">
          <p className="!text-xs !text-slate-600">
            <span className="!font-semibold !text-blue-600">{values.length}</span> selected
          </p>
        </div>
      )}
    </div>
  );
};
