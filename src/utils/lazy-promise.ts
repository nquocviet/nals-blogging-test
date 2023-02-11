const DELAY_TIME = 300;

export const delay = async (time = DELAY_TIME): Promise<void> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

export const lazyPromise = async (
  promise: Promise<any>,
  time = DELAY_TIME
): Promise<any> => {
  const loadingPromise = delay(time);
  const allPromises = [loadingPromise, promise];

  await Promise.allSettled(allPromises);

  return promise;
};
