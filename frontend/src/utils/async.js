const asyncHandler =
  (fn, onError) =>
  (...args) => {
    return Promise.resolve(fn(...args)).catch((err) => {
      if (onError && typeof onError === "function") {
        onError(err);
      } else {
        console.error(err); // Default error handling
      }
    });
  };

export default asyncHandler;
