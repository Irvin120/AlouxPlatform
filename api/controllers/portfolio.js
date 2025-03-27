const Portfolio = require("../models/Portfolio");

const self = module.exports;
self.create = async (req, res) => {
  try {
    let portfolio = new Portfolio(req.body);
    portfolio.createdAt = Date.now();
    portfolio.lastUpdate = portfolio.createdAt;
    const create = await portfolio.save();

    res.status(201).send(create);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.retrieve = async (req, res) => {
  try {
    const retrieve = await Portfolio.find({}).lean();
    res.status(200).send(retrieve);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

self.detail = async (req, res) => {
  try {
    const detail = await Portfolio.findOne({
      _id: req.params.PORTFOLIO_ID,
    }).lean();

    res.status(200).send(detail);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.update = async (req, res) => {
  try {
    const updateStatus = await Portfolio.updateOne(
      { _id: req.params.PORTFOLIO_ID },
      { $set: req.body, lastUpdate: Date.now() }
    );

    res.status(202).send(updateStatus);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.delete = async (req, res) => {
  try {
    const del = await Portfolio.deleteOne({ _id: req.params.PORTFOLIO_ID });
    res.status(200).send(del);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
