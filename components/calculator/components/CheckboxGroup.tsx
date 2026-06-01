import { Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  label: string;
  description: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  index?: number;
  twoColumns?: boolean;
}

export const CheckboxGroup = ({ label, description, options, values, onChange, twoColumns = false }: CheckboxGroupProps) => {
  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  return (
    <div className="group !bg-slate-50 !rounded-xl !p-3 md:!p-4 !border !border-slate-200 hover:!border-blue-300 hover:!bg-white !transition-all !h-full">
      <div className="!flex !items-center !justify-between !mb-2.5 md:!mb-3">
        <div className="!flex !items-center !gap-2">
          <h3 className="!text-xs md:!text-[18px] !font-semibold !text-slate-800">{label}</h3>
        </div>
        <Tooltip content={description} />
      </div>

      <div className={`!grid !gap-2 ${twoColumns ? '!grid-cols-1 md:!grid-cols-2' : '!grid-cols-1'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className="!flex !items-start !gap-2.5 !p-3 md:!p-4 !bg-white !rounded-lg !border !border-slate-200 hover:!border-blue-300 hover:!bg-blue-50 active:!bg-blue-100 !cursor-pointer !transition-all group/option !min-h-[50px]"
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="!mt-0.5 !w-4 !h-4 md:!w-3.5 md:!h-3.5 !text-blue-600 !border-slate-300 !rounded focus:!ring-blue-500 !cursor-pointer !flex-shrink-0"
              style={{
                accentColor: '#2563eb',
              }}
            />
            <div className="!flex-1 !min-w-0">
              <div className="!flex !items-center !gap-1.5">
                <span className="!text-[14px] !font-medium !text-slate-700">
                  {option.label}
                </span>
                <Tooltip content={option.description}>
                  <Info className="!w-3 !h-3 !text-slate-400 hover:!text-blue-500 !flex-shrink-0" />
                </Tooltip>
              </div>
            </div>
          </label>
        ))}
      </div>

      {values.length > 0 && (
        <div className="!mt-2.5 md:!mt-3 !pt-2.5 md:!pt-3 !border-t !border-slate-200">
          <p className="!text-[14px] !text-slate-600">
            <span className="!font-semibold !text-blue-600">{values.length}</span> of {options.length} selected
          </p>
        </div>
      )}
    </div>
  );
};
