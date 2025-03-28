const Payment = require("../models/Payment");
const BusinessController = require("./business");
const Utils = require("./utils");
const self = module.exports;

self.summary = async (req, res) => {
  try {
    let payments = await Payment.aggregate([
      { $match: { $or: [{ status: "Por pagar" }, { status: "Pagado" }] } },
      {
        $group: { _id: "$status", total: { $sum: "$amount" } },
      },
    ]);
    payments.push({});
    payments[2]._id = "General";
    payments[2].total =
      Number(payments[0].total.toFixed(2)) +
      Number(payments[1].total.toFixed(2));

    res.status(200).send(payments);
  } catch (error) {
    await Utils.responseError(res, error);
  }
};

self.graphics = async (req, res) => {
  try {
    const general = await Payment.aggregate([
      {
        $project: {
          year: { $year: { $toDate: "$createdAt" } },
          month: { $month: { $toDate: "$createdAt" } },
          amount: 1,
          status: 1,
        },
      },
      {
        $match: {
          year: req.body.year,
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const paid = await Payment.aggregate([
      {
        $project: {
          year: { $year: { $toDate: "$createdAt" } },
          month: { $month: { $toDate: "$createdAt" } },
          amount: 1,
          status: 1,
        },
      },
      {
        $match: {
          year: req.body.year,
          status: "Pagado",
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const toPay = await Payment.aggregate([
      {
        $project: {
          year: { $year: { $toDate: "$createdAt" } },
          month: { $month: { $toDate: "$createdAt" } },
          amount: 1,
          status: 1,
        },
      },
      {
        $match: {
          year: req.body.year,
          status: "Por pagar",
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).send({ general: general, paid: paid, toPay: toPay });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
