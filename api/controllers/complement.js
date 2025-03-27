const Facturapi = require("facturapi");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const Complement = require("../models/Complement");
const Payment = require("../models/Payment");
const invoiceController = require("../controllers/invoice");
const self = module.exports;

self.create = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.payment_id,
      invoiceStatus: "Facturado",
    }).lean();
    if (!payment) {
      throw {
        code: 404,
        title: "Datos insuficientes",
        detail:
          "No se encontró información suficiente para realizar la factura",
        suggestion:
          "Verifica que el pago esté asociado a un cliente y a un servicio",
      };
    }
    const client = await Client.findOne({ _id: payment._client }).lean();
    // Validaciones adicionales sobre el cliente
    if (!client.taxInfo) {
      throw {
        code: 409,
        title: "Datos incompletos",
        detail:
          "La información del cliente o del producto asociado al pago está incompleta",
        suggestion: "Verifica la información del cliente y del producto",
      };
    }
    let installmentCount = await Invoice.find({
      _payment: req.params.payment_id,
      type: "Complemento",
    });
    let installmentCountNum = installmentCount.length || 0;

    for (const i in installmentCount) {
      if (installmentCount[i].type === "Cancelación") {
        installmentCountNum--;
      }
    }

    const invoiceMain = await Invoice.findOne(
      { _payment: payment._id },
      { uuid: 1 }
    ).lean();

    const complementCreated = await self.complement(
      client.taxInfo,
      new Date(req.body.date).toISOString(),
      req.body.payment_form.id,
      invoiceMain.uuid,
      req.body.amount,
      installmentCountNum,
      req.body.lastBalance,
      new Date(req.body.paymentDate).toISOString()
    );
    //comprobar respuesta de facturapi
    if (complementCreated.message) {
      throw {
        code: 400,
        title: "Datos incompletos",
        detail: complementCreated.message,
        suggestion: "Verifica la información",
      };
    }

    //Crea factura y complemento del lado de aloux
    const invoicePlatform = await invoiceController.create(
      complementCreated,
      client._id,
      "Complemento",
      "NA",
      "NA",
      "NA",
      "NA",
      {},
      req.body.payment_form,
      payment._id
    );

    if (!invoicePlatform || !invoicePlatform._id) {
      throw {
        code: 400,
        title: "Error al crear la factura en la plataforma",
        detail: "Error",
        suggestion: "Error",
      };
    }

    let newComplement = new Complement();
    newComplement.amount = req.body.amount;
    newComplement.installment = Number(installmentCount) + 1;
    newComplement.last_balance = req.body.lastBalance;
    newComplement.createdAt = new Date().getTime();
    newComplement.lastUpdate = newComplement.createdAt;
    const complementSave = await newComplement.save();

    await Invoice.updateOne(
      { _id: invoicePlatform._id },
      { _mainInvoice: invoiceMain._id, _complement: complementSave._id }
    );
    res
      .status(201)
      .send({ complement: complementSave, invoiceComplement: invoicePlatform });
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

self.complement = async (
  client,
  date,
  payment_form,
  uuidMain,
  amount,
  installmentCount,
  lastBalance,
  datePayment
) => {
  try {
    const facturapi = new Facturapi(process.env.BILL_KEY);
    const complement = await facturapi.invoices.create({
      type: "P",
      customer: {
        legal_name: client.name,
        tax_id: client.rfc,
        tax_system: client.regime.id,
        address: {
          zip: client.zip,
        },
      },
      series: "F",
      complements: [
        {
          type: "pago",
          data: [
            {
              payment_form: payment_form,
              date: datePayment,
              related_documents: [
                {
                  uuid: uuidMain,
                  amount: amount,
                  installment: Number(installmentCount) + 1,
                  last_balance: lastBalance,
                  taxes: [
                    {
                      base: amount / 1.16,
                      type: "IVA",
                      rate: 0.16,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      date: date,
    });

    return complement;
  } catch (error) {
    throw {
      code: 409,
      title: "Datos incompletos",
      detail: error.message,
      suggestion: "Verifica la información",
    };
  }
};
