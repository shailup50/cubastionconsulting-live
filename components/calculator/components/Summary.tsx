import { parameterConfigs } from '../config/parameters';

interface SummaryProps {
  inputs: Record<string, any>;
}

export const Summary = ({ inputs }: SummaryProps) => {
  const getDisplayValue = (key: string, value: any) => {
    const config = parameterConfigs.find((p: any) => p.id === key);
    if (!config) return String(value);

    if (config.type === 'checkbox') {
      if (Array.isArray(value) && value.length === 0) return 'None selected';
      if (Array.isArray(value)) {
        return value
          .map((v: string) => {
            const option = config.options?.find((o: any) => o.value === v);
            return option?.label || v;
          })
          .join(', ');
      }
      return 'None';
    }

    if (config.type === 'radio') {
      const option = config.options?.find((o: any) => o.value === value);
      return option?.label || String(value);
    }

    return String(value);
  };

  return (
    <div className="!py-3 md:!py-4">
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-3 md:!gap-4">
        {parameterConfigs.map((config: any, idx: number) => {
          const value = inputs[config.id];
          const displayValue = getDisplayValue(config.id, value);
          const hasValue = config.type === 'checkbox'
            ? Array.isArray(value) && value.length > 0
            : value !== undefined && value !== '';

          return (
            <div
              key={config.id}
              className={`group !p-3 md:!p-4 !rounded-lg md:!rounded-xl !border-2 !transition-all ${
                hasValue
                  ? '!bg-gradient-to-br !from-blue-50 !to-white !border-blue-200 !shadow-sm hover:!shadow-md'
                  : '!bg-slate-50 !border-slate-200 hover:!border-slate-300'
              }`}
            >
              <div className="!flex !items-start !gap-2 md:!gap-3">
                <span className={`!flex-shrink-0 !flex !items-center !justify-center !w-6 !h-6 !rounded-full !text-xs !font-bold ${
                  hasValue
                    ? '!bg-blue-600 !text-white'
                    : '!bg-slate-300 !text-slate-600'
                }`}>
                  {idx + 1}
                </span>
                <div className="!flex-1 !min-w-0">
                  <p className="!text-[10px] md:!text-xs !font-semibold !text-slate-600 !mb-1 md:!mb-1.5 !uppercase !tracking-wide">
                    {config.label}
                  </p>
                  <p className={`!text-xs md:!text-sm !font-semibold !break-words ${
                    hasValue ? '!text-slate-900' : '!text-slate-400'
                  }`}>
                    {displayValue}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
