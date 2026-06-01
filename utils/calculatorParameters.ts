export interface ParameterOption {
  value: string;
  label: string;
  description: string;
}

export interface Parameter {
  id: string;
  label: string;
  description: string;
  type: 'cardGrid' | 'slider' | 'radio';
  options?: ParameterOption[];
  sliderValues?: string[];
}

export interface ParameterGroup {
  id: string;
  title: string;
  description: string;
  icon: string;
  parameters: Parameter[];
}

const allParameters: Parameter[] = [
  {
    id: 'industry',
    label: 'Industry',
    description: 'Pick Your Industry',
    type: 'cardGrid',
    options: [
      {
        value: 'communication',
        label: 'Communication',
        description: 'Telecom, Utilities, Media & Network service providers',
      },
      {
        value: 'automotive',
        label: 'Automotive / Manufacturing',
        description: 'Vehicle OEMs, Parts & Industrial manufacturing',
      },
      {
        value: 'insurance',
        label: 'General / Life Insurance',
        description: 'Life & general Insurance Carriers',
      },
      {
        value: 'banking',
        label: 'Banking',
        description: 'Retail, Corporate & Investment banking',
      },
      {
        value: 'loyalty',
        label: 'Loyalty',
        description: 'Customer Loyalty & Rewards programs',
      },
      {
        value: 'callcentre',
        label: 'Call Centre',
        description: 'Contact centers & Customer service operations',
      },
    ],
  },
  {
    id: 'siebelVersion',
    label: 'Current Siebel Version',
    description: 'What is your existing Siebel Repository Version',
    type: 'slider',
    sliderValues: ['7.x', '8.x', 'IP15', 'IP16', 'IP17', 'IP18', 'IP19', 'IP20', 'IP21', 'IP22', 'IP23', 'IP24', 'IP25'],
  },
  {
    id: 'rollbackStrategy',
    label: 'Rollback Strategy',
    description: 'Fallback approach if Cutover Fails',
    type: 'radio',
    options: [
      {
        value: 'standard',
        label: 'Standard',
        description: 'Point-in-time restore; Minor delta data may be lost',
      },
      {
        value: 'active-passive',
        label: 'Active Passive',
        description: 'Failover to standby; Minimal downtime with no data loss',
      },
      {
        value: 'active-active',
        label: 'Active-Active (2 world scenarios)',
        description: 'Old & New version run together; Controlled switch; Near-Zero downtime',
      },
    ],
  },
  {
    id: 'customOpenUI',
    label: 'Open UI',
    description: 'UI Customization Depth and Complexity',
    type: 'radio',
    options: [
      {
        value: 'low',
        label: 'No / Low',
        description: 'Vanilla UI or Very Minor styling/field tweaks',
      },
      {
        value: 'medium',
        label: 'Medium',
        description: 'Moderate UI changes: Custom applets/views, JS/CSS',
      },
      {
        value: 'high',
        label: 'High',
        description: 'Heavily customized UI with complex JS frameworks/flows',
      },
    ],
  },
];

export const parameterGroups: ParameterGroup[] = [
  {
    id: 'calculator-inputs',
    title: 'Siebel Upgrade Calculator',
    description: 'Configure your Siebel upgrade parameters',
    icon: 'Calculator',
    parameters: allParameters,
  },
];

export const parameterConfigs: Parameter[] = allParameters;
