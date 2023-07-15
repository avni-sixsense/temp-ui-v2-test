const workers = {};

const useWebWorker = (id, createWorker) => {
  if (!id || typeof id !== 'string') {
    throw new Error(
      `Expected key with typeof string, instead got ${id} with a typeof ${typeof id}.`
    );
  }

  if (workers[id] === undefined) {
    workers[id] = { current: createWorker() };

    workers[id].current.invoke = () => {
      delete workers[id];
    };
  }

  return workers[id].current;
};

export default useWebWorker;
