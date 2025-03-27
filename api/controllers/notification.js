const Notification = require("../models/Notification");
const self = module.exports;

self.create = async (title, text, _payment, _client) => {
  try {
    const instance = new Notification();
    instance.title = title;
    instance.text = text;
    instance._payment = _payment;
    instance._client = _client;
    instance.createdAt = new Date().getTime();
    instance.lastUpdate = instance.createdAt;
    const create = await instance.save();

    return true;
  } catch (error) {
    throw error;
  }
};

self.retrieve = async (req, res) => {
  try {
    const instance = await Notification.find().sort({ _id: -1 });
    res.status(200).send(instance);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

self.lastFive = async (req, res) => {
  try {
    const retrieve = await Notification.find().sort({ _id: -1 }).limit(-15);

    res.status(200).send(retrieve);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

self.seen = async (req, res) => {
  try {
    const instance = await Notification.updateOne(
      {
        _id: req.params.NOTIFICATION_ID,
      },
      { seen: Boolean(req.body.seen) }
    );
    res.status(200).send(instance);
  } catch (error) {
    res.status(404).send(error.message);
  }
};
