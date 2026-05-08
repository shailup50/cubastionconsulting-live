'use client';

import { Calculator as CalculatorIcon } from 'lucide-react';
import { useCalculator } from '@/hooks/useCalculator';
import { parameterConfigs } from '@/utils/calculatorParameters';
import { ParameterRenderer } from '@/components/calculator/ParameterRenderer';
import { ContactForm } from '@/components/calculator/components/ContactForm';

function Calculator({ embedded = false }) {
  const { inputs, updateInput, totalCost, estimatedTime } = useCalculator();

  const filledCount = Object.entries(inputs).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  }).length;

  return (
    <div className={embedded ? "!w-full" : "!min-h-[500px] md:mt-30!"} >
      <div className={embedded ? "!mx-auto !w-full !max-w-[1350px] !px-3 !py-3 md:!px-4 md:!py-4" : "container mx-auto max-w-[1360px] px-5 sm:px-6 lg:px-12 py-16 "}>
        <div className={embedded ? "!mb-2 md:!mb-3" : "!mb-4 md:!mb-6"}>
          <img
            src="https://cubastion.com/wp-content/uploads/2023/05/Cubastion-logo-Updated.png"
            alt="Cubastion Logo"
            className={embedded ? "!h-6 md:!h-6 !object-contain" : "!h-6 md:!h-6 !object-contain"}
          />
        </div>

        <div className={embedded ? "!mb-3 md:!mb-4" : "!mb-5 md:!mb-6"}>
          <div className={embedded ? "!flex !flex-row !items-center !justify-start !gap-2 !mb-2" : "!flex !flex-row !items-start !justify-start !gap-2.5 md:!gap-3 !mb-3"}>
            <div className={embedded ? "!flex-shrink-0 !p-1.5 !bg-gradient-to-br !from-blue-500 !to-blue-600 !rounded-lg !shadow-sm" : "!flex-shrink-0 !p-2 md:!p-2.5 !bg-gradient-to-br !from-blue-500 !to-blue-600 !rounded-2xl !shadow-lg"}>
              <CalculatorIcon className={embedded ? "w-3.5 h-3.5 text-white" : "w-5 h-5 md:w-6 md:h-6 text-white"} />
            </div>
            <div className="!text-left">
              <h1 className={embedded ? "!text-[14px] md:!text-[16px] font-bold tracking-tight mb-0.5" : "!text-[20px] md:!text-[24px] lg:!text-[36px] font-bold tracking-tight mb-0.5 md:mb-1"} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                <span className="!text-slate-900">Siebel Upgrade </span>
                <span className="!text-amber-500">Cost Calculator</span>
              </h1>
              <p className={embedded ? "text-slate-600 text-[9px] md:text-[10px] leading-snug" : "text-slate-600 text-[10px] md:text-[15px] leading-relaxed"}>
                Estimate your Siebel CRM upgrade costs based on your specific requirements
              </p>
            </div>
          </div>
        </div>

        <div className={embedded ? "!bg-white !rounded-lg !shadow-sm !border !border-slate-200 !p-3 md:!p-4" : "!bg-white !rounded-xl !shadow-sm !border !border-slate-200 !p-4 lg:!p-6"}>
          <div className={embedded ? "!space-y-4" : "!space-y-6"}>
            {parameterConfigs.map((config, index) => (
              <div key={config.id}>
                <ParameterRenderer
                  config={config}
                  value={inputs[config.id]}
                  onChange={(value) => updateInput(config.id, value)}
                  index={index}
                />
              </div>
            ))}
          </div>

          <div className={embedded ? "!mt-5" : "!mt-8"}>
            <ContactForm
              totalCost={totalCost}
              configurationProgress={filledCount}
              totalQuestions={parameterConfigs.length}
            />
          </div>
        </div>

        {totalCost > 0 && (
          <div className={embedded ? "!mt-4 !bg-white !rounded-lg !shadow-sm !border !border-slate-200 !p-4" : "!mt-6 !bg-white !rounded-xl !shadow-sm !border !border-slate-200 !p-6"}>
            <div className="!flex !flex-col !gap-6">
              <div className="!flex !flex-col !gap-3">
                <span className="!text-lg !font-semibold !text-slate-700">
                  Estimated Cost Range
                </span>
                <div className="!flex !items-baseline !gap-3">
                  <span className="!text-3xl !font-bold !text-blue-600">
                    ₹{Math.round(totalCost * 0.8).toLocaleString()}
                  </span>
                  <span className="!text-2xl !font-semibold !text-slate-400">-</span>
                  <span className="!text-3xl !font-bold !text-blue-600">
                    ₹{Math.round(totalCost * 1.1).toLocaleString()}
                  </span>
                </div>
              </div>

              {estimatedTime > 0 && (
                <div className="!flex !flex-col !gap-3 !pt-6 !border-t !border-slate-200">
                  <span className="!text-lg !font-semibold !text-slate-700">
                    Estimated Time
                  </span>
                  <div className="!flex !items-baseline !gap-2">
                    <span className="!text-3xl !font-bold !text-amber-500">
                      {estimatedTime}
                    </span>
                    <span className="!text-xl !font-semibold !text-slate-600">
                      {estimatedTime === 1 ? 'month' : 'months'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
