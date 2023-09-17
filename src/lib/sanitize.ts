export const sanitizeArray = (array: any|any[], defaultValue?: any[]): any[] => {
  if (!array) array = defaultValue || [];
  if (!Array.isArray(array)) array = [array];
  return array;
};
