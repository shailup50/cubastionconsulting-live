import { Package } from 'lucide-react';

export const SliderInput = ({ label, description, values, value, onChange, icon }) => {
  const currentIndex = values.indexOf(value);
  const defaultIcon = <Package className="!w-4 !h-4 !text-white" />;
  const percentage = values.length > 1 ? (currentIndex / (values.length - 1)) * 100 : 0;

  const handleChange = (e) => {
    const index = parseInt(e.target.value, 10);
    onChange(values[index]);
  };

  return (
    <div className="!bg-white !rounded-xl md:!rounded-2xl !border !border-slate-200 !overflow-hidden">
      <div className="!flex !flex-col md:!flex-row">
        <div className="md:!w-80 !flex-shrink-0 !bg-slate-50 !p-4 md:!p-4 !flex !flex-col !min-h-[120px] md:!min-h-[150px]">
          <div className="!flex !items-start !gap-2 md:!gap-3">
            <div className="!flex-shrink-0 !w-10 !h-10 md:!w-15 md:!h-15 !bg-gradient-to-br !from-blue-500 !to-blue-600 !rounded-xl md:!rounded-2xl !flex !items-center !justify-center !shadow-lg">
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
                {value}
              </div>
            </div>
          )}
        </div>

        <div className="!flex-1 !p-4 md:!p-4 !flex !flex-col !justify-center">
          <div className="!relative !w-full !px-1 md:!px-2">
            <input
              type="range"
              min="0"
              max={values.length - 1}
              value={currentIndex}
              onChange={handleChange}
              style={{
                background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${percentage}%, rgb(226 232 240) ${percentage}%, rgb(226 232 240) 100%)`,
              }}
              className="!w-full !h-2 !rounded-lg !appearance-none !cursor-pointer slider-thumb !touch-none"
            />
            <div className="!flex !justify-between !mt-2 md:!mt-3">
              {values.map((val, idx) => (
                <span
                  key={idx}
                  className={`!text-[12px] md:!text-[14px] !font-medium ${
                    idx === currentIndex ? '!text-blue-600' : '!text-slate-500'
                  }`}
                >
                  {val}
                </span>
              ))}
            </div>
            {value && (
              <div className="!mt-3 md:!mt-4 !text-center md:!hidden">
                <div className="!text-xl !font-bold !text-blue-600">
                  {value}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
