import { RotateCcw } from 'lucide-react';

export const RadioInput = ({ label, description, options, value, onChange, icon }) => {
  const defaultIcon = <RotateCcw className="!w-4 !h-4 !text-white" />;
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="!bg-white !rounded-xl md:!rounded-2xl !border !border-slate-200 !overflow-hidden">
      <div className="!flex !flex-col md:!flex-row">
        <div className="md:!w-80 !flex-shrink-0 !bg-slate-50 !p-4 md:!p-4 !flex !flex-col !min-h-[120px] md:!min-h-[150px]">
          <div className="!flex !items-start !gap-2 md:!gap-3">
            <div className="!flex-shrink-0 !w-10 !h-10 md:!w-15 md:!h-15 btn btn-btn !rounded-xl md:!rounded-2xl !flex !items-center !justify-center !shadow-lg">
              {icon || defaultIcon}
            </div>
            <div>
              <h3 className="!text-xs md:!text-[18px] !font-bold !text-slate-900 !mb-0.5 md:!mb-1">{label}</h3>
              <p className="!text-[10px] md:!text-[14px] !text-slate-600 !leading-tight">{description}</p>
            </div>
          </div>

          {value && (
            <div className="!mt-auto !pt-4 md:!pt-6">
              <div className="!text-[12px] !font-semibold !text-slate-600 !uppercase !tracking-wider !mb-1 md:!mb-2">
                YOUR SELECTION:
              </div>
              <div className="!text-xs md:!text-[16px] !font-bold !text-amber-500">
                {selectedOption?.label || value}
              </div>
            </div>
          )}
        </div>

        <div className="!flex-1 !p-4 md:!p-4">
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-2 md:!gap-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`!text-left !p-3 md:!p-4 !rounded-lg md:!rounded-xl !border-2 !transition-all !min-h-[50px] ${
                  value === option.value
                    ? '!border-transparent !text-white !shadow-md'
                    : '!border-slate-200 !bg-white hover:!border-blue-300 hover:!shadow-sm active:!scale-95'
                }`}
                style={value === option.value ? { background: 'var(--gradient-primary)' } : undefined}
              >
                <div className={`!text-[14px] !font-semibold !mb-0.5 md:!mb-1 ${
                  value === option.value ? '!text-white' : '!text-slate-900'
                }`}>
                  {option.label}
                </div>
                <div className={`!text-[14px] !leading-tight ${
                  value === option.value ? '!text-white/90' : '!text-slate-600'
                }`}>
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
