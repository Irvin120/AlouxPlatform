const Payment = require("../models/Payment");
const Customer = require("../models/Client");
const Invoice = require("../models/Invoice");

const self = module.exports;

self.create = async (req, res) => {
  try {
    let payment = new Payment(req.body);
    payment.createdAt = new Date().getTime();
    payment.lastUpdate = payment.createdAt;
    let customer = await Customer.findOne({ _id: req.body._client });
    for (key in customer.projects) {
      if (
        customer.projects[key]._id.toString() === req.body._project.toString()
      ) {
        customer.projects[key].payments.push({
          _id: payment._id,
          amount: payment.amount,
        });
      }
    }

    await customer.save();
    const create = await payment.save();

    res.status(201).send(create);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.retrieve = async (req, res) => {
  try {
    const retrieve = await Payment.find({})
      .populate("_client")
      .sort({ _id: -1 })
      .lean();
    for (const i in retrieve) {
      let invoices = await Invoice.find({
        _payment: retrieve[i]._id,
        $or: [
          { type: "Normal" },
          { type: "Por definir" },
          { type: "Cancelación" },
        ],
      });
      retrieve[i].invoice = invoices;
    }

    res.status(200).send(retrieve);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

// Count
self.count = async (req, res) => {
  try {
    const response = await Payment.countDocuments();

    res.status(200).send({ count: response });
  } catch (error) {
    const obj = {
      title: "Error al contar los cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Count
self.payable = async (req, res) => {
  try {
    const retrieve = await Payment.find({ status: "Pagado" }).countDocuments();

    res.status(200).send({ count: retrieve });
  } catch (error) {
    const obj = {
      title: "Error al contar los cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Count
self.expired = async (req, res) => {
  try {
    const retrieve = await Payment.find({
      status: "Por pagar",
    }).countDocuments();

    res.status(200).send({ count: retrieve });
  } catch (error) {
    const obj = {
      title: "Error al contar los cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.detail = async (req, res) => {
  try {
    const _id = req.params.PAYMENT_ID;
    const detail = await Payment.findOne({ _id })
      .populate("_customer")
      .populate("_client")
      .lean();
    if (!detail) throw new Error("Upss! No se encontró el Elemento");
    const invoices = await Invoice.find({ _payment: detail._id })
      .populate({ path: "_complement", select: { amount: 1 } })
      .sort({
        _id: 1,
      });
    detail.invoices = invoices;
    res.status(200).send(detail);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.update = async (req, res) => {
  try {
    const _id = req.params.PAYMENT_ID;
    const update = await Payment.updateOne(
      { _id },
      { $set: req.body, lastUpdate: new Date().getTime() }
    );

    res.status(202).send(update);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.status = async (req, res) => {
  try {
    const _id = req.params.PAYMENT_ID;
    let payment = await Payment.findOne({ _id });

    if (!payment) {
      throw {
        code: 404,
        title: "Id no encontrado",
        detail: "No se encontró el _id: " + _id,
        suggestion: "Verifique la información",
        error: new Error(),
      };
    }

    payment.status = req.body.status;
    req.body.status === "Pagado"
      ? (payment.datePay = new Date().getTime())
      : true;
    payment.lastUpdate = new Date().getTime();
    const result = await payment.save();

    res.status(200).send(result);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error al cambiar el estatus",
        detail: error.message,
        suggestion: "Revisa el detalle del error",
      };
    }
    res.status(error.code).send(obj);
  }
};

self.delete = async (req, res) => {
  try {
    const _id = req.params.PAYMENT_ID;
    const del = await Payment.deleteOne({ _id });

    res.status(200).send(del);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.createByService = async (servicesMonth, daysLimit) => {
  try {
    //calcula día limite del pago
    let currentDate = new Date();
    let date;
    date = new Date(
      currentDate.getTime() + Number(daysLimit) * 24 * 60 * 60 * 1000
    );
    date.setHours(23, 59, 59);

    //Genera pago
    let newPayment = new Payment();
    newPayment.concept =
      "Pago recurrente de servicio: " + servicesMonth.concept;
    newPayment.satProduct = servicesMonth.satCode;
    newPayment.satPaymentMethod = { id: "99", description: "Por definir" };
    newPayment.satUnit = servicesMonth.satUnit;
    newPayment.amount = servicesMonth.amount;
    newPayment.dateLimit = date.getTime();
    newPayment.type = "Servicio";
    newPayment._service = servicesMonth._id;
    newPayment._client = servicesMonth._client;
    newPayment.createdAt = currentDate.getTime();
    newPayment.lastUpdate = newPayment.createdAt;
    const create = await newPayment.save();
    return create;
  } catch (error) {
    throw error;
  }
};
