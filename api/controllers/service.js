const Service = require("../models/Service");
const Payment = require("../models/Payment");
const scheduleController = require("../controllers/schedule");
const paymentController = require("../controllers/payment");
const { AlouxAWS } = require("aloux-iam");
const self = module.exports;

self.create = async (req, res) => {
  try {
    let create;
    let service = new Service(req.body);
    service.createdAt = new Date().getTime();
    service.status = "Activo";

    if (req.body.membershipType === "Mensual") {
      service.dateNextPayment = service.dateStart;
      //el pago se genera en la fecha de inicio con el schedule
      create = await service.save();
    } else {
      //Annual
      let dateAnnual = new Date();
      dateAnnual.setHours(23, 59, 59);
      let dateNextPayment = await scheduleController.calculateDate(
        dateAnnual.getTime(),
        12 //meses
      );
      service.dateNextPayment = dateNextPayment;
      create = await service.save();
      //genera pago al instante
      await paymentController.createByService(
        create,
        3 //días limite del pago
      );
    }

    res.status(201).send(create);
  } catch (error) {
    const obj = {
      title: "Error al crear el servicio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.retrieve = async (req, res) => {
  try {
    const retrieve = await Service.find({}).sort({ _id: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al obtener los proyectos",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.count = async (req, res) => {
  try {
    const response = await Service.countDocuments();

    res.status(200).send({ count: response });
  } catch (error) {
    const obj = {
      title: "Error al contar los proyectos",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.detail = async (req, res) => {
  try {
    const _id = req.params.SERVICE_ID;
    const detail = await Service.findOne({ _id });

    if (!detail) throw new Error("Upss! No se encontró el Elemento");

    res.status(200).send(detail);
  } catch (error) {
    const obj = {
      title: "Error al obtener el detalle del servicio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.update = async (req, res) => {
  try {
    const _id = req.params.SERVICE_ID;

    await Service.updateOne({ _id }, { $set: req.body });

    let service = await Service.findOne({ _id });

    service.lastUpdate = new Date().getTime();
    const update = await service.save();

    res.status(202).send(update);
  } catch (error) {
    const obj = {
      title: "Error al actualizar el servicio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.delete = async (req, res) => {
  try {
    const _id = req.params.SERVICE_ID;
    const del = await Service.deleteOne({ _id });

    res.status(200).send(del);
  } catch (error) {
    const obj = {
      title: "Error al eliminar el servicio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.status = async (req, resp) => {
  try {
    const _id = req.params.SERVICE_ID;
    let service = await Service.findOne({ _id });

    if (!service) {
      throw {
        code: 404,
        title: "Id no encontrado",
        detail: "No se encontró el _id: " + _id,
        suggestion: "Verifique la información",
        error: new Error(),
      };
    }

    service.status = req.body.status;
    service.lastUpdate = new Date().getTime();
    const result = await service.save();

    resp.status(200).send(result);
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
    resp.status(error.code).send(obj);
  }
};

// Retrieve payments
self.payment = async (req, res) => {
  try {
    const retrieve = await Payment.find({
      _service: req.params.SERVICE_ID,
    }).sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al obtener los pagos del servicio",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};

self.file = async (req, res) => {
  try {
    let service = await Service.findOne({ _id: req.params.SERVICE_ID });
    const imgUrl = await AlouxAWS.upload(
      "projectPlatform/" + "agreementService" + "-" + req.params.SERVICE_ID,
      req.files.agreement
    );
    service.files.agreementUrl = imgUrl;
    const updateService = await service.save();
    res.status(202).send(updateService);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
