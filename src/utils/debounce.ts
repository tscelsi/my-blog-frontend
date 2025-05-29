type Debounce = (func: (...args: any[]) => void, wait: number) => (...args: any[]) => void;

export const debounce: Debounce = (func, wait) => {
  let timeout: NodeJS.Timeout | undefined;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
