const Client = require("../models/Client");
const Payment = require("../models/Payment");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Invoice = require("../models/Invoice");
const { IAMUserModel } = require("aloux-iam");

const self = module.exports;

self.statementAccount = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.CLIENT_ID });
    const userIam = await IAMUserModel.findOne({ _client: client._id });
    let query1 = { $or: [], _client: req.params.CLIENT_ID };
    let query2 = { $or: [], _client: req.params.CLIENT_ID };
    let paymentsService = [];
    let paymentsProject = [];
    for (const i in req.body.services) {
      query1.$or.push({ _service: req.body.services[i] });
    }
    for (const i in req.body.projects) {
      query2.$or.push({ _project: req.body.projects[i] });
    }

    if (query1.$or.length > 0) {
      paymentsService = await Payment.find(query1).sort({ createdAt: 1 });
    }
    if (query2.$or.length > 0) {
      paymentsProject = await Payment.find(query2).sort({ createdAt: 1 });
    }

    if (paymentsProject.length === 0 && paymentsService.length === 0) {
      throw {
        code: 404,
        title: "Datos insuficientes",
        detail: "No se encontró información suficiente",
        suggestion: "Intentalo más tarde",
      };
    }

    const response = {
      customer: client.name,
      email: userIam?.email || "NA",
      table: {
        projects: [],
        services: [],
      },
    };

    for (const i in req.body.projects) {
      let projectName = await Project.findOne(
        { _id: req.body.projects[i] },
        { name: 1 }
      );
      response.table.projects.push({
        _idProject: projectName._id,
        projectName: projectName.name,
        payments: [],
      });
      for (const j in paymentsProject) {
        if (
          paymentsProject[j]._project.toString() ===
          req.body.projects[i].toString()
        ) {
          let calculate = await self.calculate(paymentsProject[j]);
          response.table.projects[
            response.table.projects.length - 1
          ].payments.push(calculate);
        }
      }
    }

    for (const i in req.body.services) {
      let serviceName = await Service.findOne(
        { _id: req.body.services[i] },
        { concept: 1 }
      );
      response.table.services.push({
        _idService: serviceName._id,
        serviceName: serviceName.concept,
        payments: [],
      });
      for (const j in paymentsService) {
        if (
          paymentsService[j]._service.toString() ===
          req.body.services[i].toString()
        ) {
          let calculate = await self.calculate(paymentsService[j]);
          response.table.services[
            response.table.services.length - 1
          ].payments.push(calculate);
        }
      }
    }

    res.status(200).send(response);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detalle del error",
      };
    }
    res.status(obj.code).send(obj);
  }
};

self.calculate = async (payment) => {
  try {
    let costo = payment.amount;
    let pago = payment.status === "Pagado" ? payment.amount : 0;
    let dateInvoice, typeInvoice;
    if (payment?.invoiceStatus === "Facturado") {
      let invoiceFind = await Invoice.findOne({ _payment: payment._id }).sort({
        createdAt: 1,
        paymentMethod: 1,
      });
      dateInvoice = invoiceFind.createdAt;
      typeInvoice = invoiceFind.paymentMethod;
    } else {
      dateInvoice = null;
      typeInvoice = null;
    }
    const newPaymentPDF = {
      FECHA_DE_FACTURA: dateInvoice,
      TIPO_DE_FACTURA: typeInvoice,
      FECHA_CREACION_PAGO: payment.createdAt,
      FECHA_DE_PAGO: payment?.datePay ? payment?.datePay : null,
      FORMA_DE_PAGO: payment?.satPaymentMethod?.description
        ? payment.satPaymentMethod.description
        : null,
      CANTIDAD: 1,
      U_M: payment.type,
      PEDIDO: payment.concept,
      COSTO: costo,
      PAGO: pago,
      SALDO: Number(costo.toFixed(2)) - Number(pago.toFixed(2)),
      COMENTARIO: null,
    };

    return newPaymentPDF;
  } catch (error) {
    throw new Error(error);
  }
};
