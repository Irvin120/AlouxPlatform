const Service = require("../models/Service");
const paymentController = require("../controllers/payment");
const notificationController = require("../controllers/notification");
const logs = require("../controllers/logs");
const self = module.exports;

self.generateNewPaymentJob = async () => {
  try {
    //(Mensual)
    let arrayPaymentMonth = [];
    const currentDate = new Date().getTime();
    const servicesMonth = await Service.find({
      membershipType: "Mensual",
      dateNextPayment: { $lt: currentDate },
      cutoffDate: { $gt: currentDate },
      status: "Activo",
    }).lean();

    for (const i in servicesMonth) {
      let dateNextPayment = await self.calculateDate(
        servicesMonth[i].dateNextPayment,
        1 //meses
      );

      let newPaymentCreate = await paymentController.createByService(
        servicesMonth[i],
        15 //días limite del pago
      );

      arrayPaymentMonth.push(newPaymentCreate);
      await Service.updateOne(
        { _id: servicesMonth[i]._id },
        { dateNextPayment: dateNextPayment }
      );

      await notificationController.create(
        "Nuevo pago recurrente",
        "Pago de servicio: " + servicesMonth[i].concept,
        newPaymentCreate._id,
        servicesMonth[i]._client
      );
    }

    await logs.create("schedule", "Pagos creados con exito", "PLATFORM", {
      month: arrayPaymentMonth,
    });
    return true;
  } catch (error) {
    await logs.create("schedule", error.message, "OTRO", error);
  }
};

self.generateNewPayment = async (req, res) => {
  try {
    const x = await self.generateNewPaymentJob();

    res.status(200).send(x);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

self.generateNewPaymentAnnualJob = async () => {
  try {
    //(Annual)
    let arrayPaymentAnnual = [];
    const currentDate = new Date().getTime();
    const servicesAnnual = await Service.find({
      membershipType: "Anual",
      dateNextPayment: { $lt: currentDate },
      status: "Activo",
    }).lean();

    for (const i in servicesAnnual) {
      let dateNextPayment = await self.calculateDate(
        servicesAnnual[i].dateNextPayment,
        12 //meses
      );

      let newPaymentCreate = await paymentController.createByService(
        servicesAnnual[i],
        15 //días limite del pago
      );

      arrayPaymentAnnual.push(newPaymentCreate);
      await Service.updateOne(
        { _id: servicesAnnual[i]._id },
        { dateNextPayment: dateNextPayment }
      );

      await notificationController.create(
        "Nuevo pago recurrente",
        "Pago de servicio: " + servicesAnnual[i].concept,
        newPaymentCreate._id,
        servicesAnnual[i]._client
      );
    }

    await logs.create("schedule", "Pagos creados con exito", "PLATFORM", {
      annual: arrayPaymentAnnual,
    });
    return true;
  } catch (error) {
    await logs.create("schedule", error.message, "OTRO", error);
  }
};

self.generateNewPaymentAnnual = async (req, res) => {
  try {
    const x = await self.generateNewPaymentAnnualJob();

    res.status(200).send(x);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

self.calculateDate = async (date, months) => {
  try {
    let dateFormat = new Date(date);
    let newDate = new Date(dateFormat.setMonth(dateFormat.getMonth() + months));
    newDate.setHours(23, 59, 59);
    const response = newDate.getTime();
    return response;
  } catch (error) {
    throw error;
  }
};
