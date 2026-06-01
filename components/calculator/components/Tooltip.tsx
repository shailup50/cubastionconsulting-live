import { Info } from 'lucide-react';
import { useState } from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="!relative !inline-block !ml-2">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="!cursor-help"
      >
        {children || <Info className="!w-4 !h-4 !text-slate-400 hover:!text-slate-600 !transition-colors" />}
      </div>
      {isVisible && (
        <div className="!absolute !z-50 !left-1/2 !-translate-x-1/2 !bottom-full !mb-2 !w-72 !px-4 !py-3 !text-sm !text-white !bg-slate-800 !rounded-lg !shadow-xl">
          <div className="!relative">
            {content}
            <div className="!absolute !top-full !left-1/2 !-translate-x-1/2 !border-8 !border-transparent !border-t-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
};
