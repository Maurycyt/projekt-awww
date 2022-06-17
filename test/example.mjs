export const fun = () => "test";

export const asyncfun = () =>
  new Promise((resolve) => setTimeout(() => resolve("atest"), 1000));
