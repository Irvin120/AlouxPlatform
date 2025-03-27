const LogSchedule = require("../models/LogSchedule");
const self = module.exports;

self.create = async (origin, comment, app, data) => {
  try {
    let log = new LogSchedule();
    log.origin = origin;
    log.comment = comment;
    log.app = app;
    log.data = data;
    log.available = log.createdAt = new Date().getTime();

    await log.save();
  } catch (error) {
    console.log({ error: error.message });
  }
};
