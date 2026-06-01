import { useMemo, useState } from 'react';
import { calculateCost, calculateEstimatedTime } from '../utils/costCalculator';
import type { CalculatorInputs } from '../utils/costCalculator';

const initialState: CalculatorInputs = {
  industry: undefined,
  siebelVersion: undefined,
  rollbackStrategy: undefined,
  customOpenUI: undefined,
};

export const useCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialState);

  const totalCost = useMemo(() => calculateCost(inputs), [inputs]);
  const estimatedTime = useMemo(() => calculateEstimatedTime(inputs), [inputs]);

  const updateInput = (key: keyof CalculatorInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetInputs = () => {
    setInputs(initialState);
  };

  return {
    inputs,
    updateInput,
    resetInputs,
    totalCost,
    estimatedTime,
  };
};
