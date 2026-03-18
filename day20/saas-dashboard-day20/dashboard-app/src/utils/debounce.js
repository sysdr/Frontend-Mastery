export const debounce = (func, delay) => {
  let timeout;
  return function executed(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};
