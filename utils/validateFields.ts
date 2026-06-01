interface ValidationRule {
  required?: boolean;
  requiredMessage?: string;
  regex?: RegExp;
  regexMessage?: string;
}

export const validateFields = (
  values: Record<string, unknown>,
  rules: Record<string, ValidationRule>,
): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const field in rules) {
    const value = values[field];
    const rule = rules[field];
    if (rule.required && (!value || String(value).trim() === "")) {
      errors[field] = rule.requiredMessage || `${field} is required`;
    }
    if (rule.regex && value && !rule.regex.test(String(value))) {
      errors[field] = rule.regexMessage || `${field} is invalid`;
    }
  }
  return errors;
};
