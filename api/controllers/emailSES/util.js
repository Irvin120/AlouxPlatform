const self = module.exports;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

self.sleep = async (sleepTime) => {
  await timeout(sleepTime);
};
