import { useMemo, useState } from 'react';
import { calculateCost, calculateEstimatedTime } from '../utils/costCalculator';

const initialState = {
  industry: undefined,
  siebelVersion: undefined,
  rollbackStrategy: undefined,
  customOpenUI: undefined,
};

export const useCalculator = () => {
  const [inputs, setInputs] = useState(initialState);

  const totalCost = useMemo(() => calculateCost(inputs), [inputs]);
  const estimatedTime = useMemo(() => calculateEstimatedTime(inputs), [inputs]);

  const updateInput = (key, value) => {
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
