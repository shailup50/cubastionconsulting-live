const getVersionMultiplier = (version) => {
    if (version === '7.x') return 1.25;
    if (version === '8.x' || version === 'IP15') return 1;
    if (version === 'IP16') return 0.75;
    return 1;
  };
  
  const getIndustryMultiplier = (industry) => {
    const industryMap = {
      communication: 1,
      automotive: 0.625,
      insurance: 0.75,
      banking: 1.125,
      loyalty: 0.5,
      callcentre: 0.5,
    };
    return industryMap[industry] ?? 1;
  };
  
  const getRollbackValue = (strategy) => {
    const rollbackMap = {
      standard: 1,
      'active-passive': 2,
      'active-active': 3,
    };
    return rollbackMap[strategy] ?? 1;
  };
  
  const getOpenUIValue = (openUI) => {
    const openUIMap = {
      low: 0,
      medium: 1,
      high: 2,
    };
    return openUIMap[openUI] ?? 0;
  };
  
  const isPreIP17 = (version) => {
    return ['7.x', '8.x', 'IP15', 'IP16'].includes(version);
  };
  
  export const calculateCost = (inputs) => {
    const { industry, siebelVersion, rollbackStrategy, customOpenUI } = inputs;
  
    if (!siebelVersion || !industry || !rollbackStrategy || !customOpenUI) {
      return 0;
    }
  
    const isPre17 = isPreIP17(siebelVersion);
    const B = getVersionMultiplier(siebelVersion);
    const C = getIndustryMultiplier(industry);
    const d = getRollbackValue(rollbackStrategy);
    const e = getOpenUIValue(customOpenUI);
  
    if (isPre17) {
      const A1 = 61425000;
      const D1 = 24 * d;
      const E1 = 6 * e;
      return Math.round(A1 * B * C + D1 + E1);
    }
  
    const A2 = 10335000;
    const D2 = 24 * d;
    const E2 = 6 * e;
    return Math.round(A2 * B * C + D2 + E2);
  };
  
  export const calculateEstimatedTime = (inputs) => {
    const { industry, siebelVersion } = inputs;
  
    if (!siebelVersion || !industry) {
      return 0;
    }
  
    const isPreIP17Version = isPreIP17(siebelVersion);
    const timeMap = {
      communication: { preIP17: 8, ip17Plus: 3 },
      automotive: { preIP17: 5, ip17Plus: 3 },
      insurance: { preIP17: 6, ip17Plus: 3 },
      banking: { preIP17: 9, ip17Plus: 3 },
      loyalty: { preIP17: 4, ip17Plus: 2 },
      callcentre: { preIP17: 4, ip17Plus: 2 },
    };
  
    const timeConfig = timeMap[industry];
    if (!timeConfig) return 0;
  
    return isPreIP17Version ? timeConfig.preIP17 : timeConfig.ip17Plus;
  };
  