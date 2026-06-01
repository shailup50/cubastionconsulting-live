import { Building2, Layout, Package, RotateCcw } from 'lucide-react';
import { CardGridInput } from './CardGridInput';
import { CheckboxGroup } from './CheckboxGroup';
import { DropdownInput } from './DropdownInput';
import { RadioInput } from './RadioInput';
import { SliderInput } from './SliderInput';

interface ParameterRendererProps {
  config: any;
  value: any;
  onChange: (value: any) => void;
  index: number;
}

export const ParameterRenderer = ({ config, value, onChange, index }: ParameterRendererProps) => {
  const getIcon = (id: string) => {
    if (id === 'industry') return <Building2 className="!w-7 !h-7 !text-white" />;
    if (id === 'siebelVersion') return <Package className="!w-7 !h-7 !text-white" />;
    if (id === 'rollbackStrategy') return <RotateCcw className="!w-7 !h-7 !text-white" />;
    if (id === 'customOpenUI') return <Layout className="!w-7 !h-7 !text-white" />;
    return undefined;
  };

  switch (config.type) {
    case 'cardGrid':
      return (
        <CardGridInput
          label={config.label}
          description={config.description}
          options={config.options || []}
          value={value}
          onChange={onChange}
          icon={getIcon(config.id)}
        />
      );
    case 'slider':
      return (
        <SliderInput
          label={config.label}
          description={config.description}
          values={config.sliderValues || []}
          value={value}
          onChange={onChange}
          index={index}
          icon={getIcon(config.id)}
        />
      );
    case 'dropdown':
      return (
        <DropdownInput
          label={config.label}
          description={config.description}
          options={config.options || []}
          value={value}
          onChange={onChange}
          index={index}
        />
      );
    case 'radio':
      return (
        <RadioInput
          label={config.label}
          description={config.description}
          options={config.options || []}
          value={value}
          onChange={onChange}
          index={index}
          icon={getIcon(config.id)}
        />
      );
    case 'checkbox':
      return (
        <CheckboxGroup
          label={config.label}
          description={config.description}
          options={config.options || []}
          values={value}
          onChange={onChange}
          index={index}
          twoColumns={false}
        />
      );
    default:
      return null;
  }
};
