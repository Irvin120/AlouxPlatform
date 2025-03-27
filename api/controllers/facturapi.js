const Facturapi = require("facturapi");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const Contact = require("../models/Contact");
const Payment = require("../models/Payment");
const { IAMUserModel, AlouxAWS } = require("aloux-iam");
const invoiceController = require("./invoice");
const fs = require("fs");
const Utils = require("../util");
const self = module.exports;

self.retrieveCatProduct = async (req, res) => {
  try {
    const facturapi = new Facturapi(process.env.BILL_KEY);
    const retrieve = await facturapi.catalogs.searchProducts({
      q: req.body.product,
      page: req.body.page,
    });

    res.status(200).send(retrieve);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

self.retrieveUnit = async (req, res) => {
  try {
    const facturapi = new Facturapi(process.env.BILL_KEY);
    const retrieve = await facturapi.catalogs.searchUnits({
      q: req.body.unit,
    });

    res.status(200).send(retrieve);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

self.createInvoice = async (req, res) => {
  try {
    const facturapi = new Facturapi(process.env.BILL_KEY);

    // Obteniendo datos necesarios
    const payment = await Payment.findOne({ _id: req.params.payment_id })
      .populate("_client")
      .populate("_project");

    const userFind = await Client.findOne({ _id: payment._client._id });

    if (payment.invoiced === true) {
      throw {
        code: 409,
        title: "El pago ya está facturado",
        detail: "No es posible facturar este pago nuevamente",
        suggestion: "Revisa el detalle del pago",
      };
    }

    // Validaciones de existencia de información en el cliente y el producto
    if (!payment || !userFind) {
      throw {
        code: 404,
        title: "Datos insuficientes",
        detail:
          "No se encontró información suficiente para realizar la factura",
        suggestion:
          "Verifica que el pago esté asociado a un cliente y a un servicio",
      };
    }

    // Validaciones adicionales sobre el cliente y el producto
    if (!payment._client.taxInfo) {
      throw {
        code: 409,
        title: "Datos incompletos",
        detail:
          "La información del cliente o del producto asociado al pago está incompleta",
        suggestion: "Verifica la información del cliente y del producto",
      };
    }

    // Creando la factura en Facturapi
    const invoiceFacturapi = await facturapi.invoices.create({
      customer: {
        legal_name: payment._client.taxInfo.name,
        tax_id: payment._client.taxInfo.rfc,
        tax_system: payment._client.taxInfo.regime.id,
        address: {
          zip: payment._client.taxInfo.zip,
        },
      },
      items: [
        {
          product: {
            description: payment.concept,
            product_key: payment.satProduct.key,
            price: payment.amount,
            tax_included: true,
            unit_key: payment.satUnit.key,
            unit_name: payment.satUnit.description,
          },
          quantity: 1,
          discount: 0,
        },
      ],
      payment_form:
        req.body.payment_method.id === "PPD" ? "99" : req.body.payment_form.id,
      payment_method: req.body.payment_method.id,
      use: userFind.taxInfo.CFDIuse.id,
      series: "F",
    });

    // Creando la nueva factura
    const newInvoice = await invoiceController.create(
      invoiceFacturapi,
      payment._client._id,
      invoiceFacturapi.payment_method === "PPD" ? "Por definir" : "Normal",
      "NA",
      "NA",
      "NA",
      "NA",
      req.body.payment_method,
      req.body.payment_method.id === "PPD"
        ? req.body.payment_form
        : payment.satPaymentMethod,
      req.params.payment_id
    );

    //Envio de factura por correo
    const contactFind = await Contact.findOne(
      { _client: userFind._id },
      { email: 1 }
    ).lean();

    if (contactFind) {
      await facturapi.invoices.sendByEmail(invoiceFacturapi.id, {
        email: contactFind.email,
      });
    }

    // Guardando datos más importantes
    await Payment.updateOne(
      { _id: req.params.payment_id },
      { invoiceStatus: "Facturado" }
    );

    res.status(201).send(newInvoice);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detallle del error",
      };
    }
    res.status(obj.code).send(obj);
  }
};

self.detail = async (invoice_id) => {
  try {
    const invoice = await Invoice.findOne({ _id: invoice_id });
    // const facturapi = new Facturapi(process.env.BILL_KEY);
    // const retrieve = await facturapi.invoices.retrieve(invoice._invoice);
    // if (retrieve.message) {
    //   throw {
    //     code: 402,
    //     title: "Error en los parametros",
    //     detail: retrieve.message,
    //     suggestion: "Contacta con el administrador",
    //   };
    // }

    return invoice;
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detallle del error",
      };
    }
    return error; // error al no encontrar la factura en live
  }
};

self.detailFactura = async (req, res) => {
  try {
    const response = await self.detail(req.params.invoice_id);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.deleteFactura = async (req, res) => {
  try {
    const find = await Invoice.findOne({ _id: req.params.invoice_id });
    const facturapi = new Facturapi(process.env.BILL_KEY);
    let invoice;

    if (req.body.motive === "01") {
      if (!req?.body?.substitution) {
        throw {
          code: 402,
          title: "Error en los parametros",
          detail: "Falta el parametro folio fiscal",
          suggestion: "Agrega el folio de la factura que sustituye",
        };
      }
      invoice = await facturapi.invoices.cancel(find._invoice, {
        motive: req.body.motive,
        substitution: req.body.substitution,
      });
    } else {
      invoice = await facturapi.invoices.cancel(find._invoice, {
        motive: req.body.motive,
      });
    }

    if (invoice.message) {
      throw {
        code: 402,
        title: "Error en los parametros",
        detail: invoice.message,
        suggestion: "Contacta con el administrador",
      };
    }

    await Invoice.updateOne(
      { _id: req.params.invoice_id },
      { type: "Cancelación", isActive: false }
    );

    res.status(200).send(invoice);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detallle del error",
      };
    }
    res.status(obj.code).send(obj);
  }
};

self.downloadFactura = async (invoice_id) => {
  try {
    let files = {
      pdf: {
        name: "filePDF.pdf",
      },
      xml: {
        name: "fileXML.xml",
      },
    };

    const facturapi = new Facturapi(process.env.BILL_KEY);

    const pdfStream = await facturapi.invoices.downloadPdf(invoice_id);
    const pdfFile = fs.createWriteStream(process.env.INVOICE_PDF);

    const xmlStream = await facturapi.invoices.downloadXml(invoice_id);
    const xmlFile = fs.createWriteStream(process.env.INVOICE_XML);

    pdfStream.pipe(pdfFile);
    xmlStream.pipe(xmlFile);

    await Utils.sleep(2000);

    files.pdf.data = Buffer.from(
      fs.readFileSync(process.env.INVOICE_PDF, "binary"),
      "binary"
    );
    files.xml.data = fs.readFileSync(process.env.INVOICE_XML, "utf8");

    return files;
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};

self.UpadteFiles = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.invoice_id });

    let files = await self.downloadFactura(invoice._invoice);
    if (files.message) {
      throw new Error(files.message);
    }
    const xmlUrl = await AlouxAWS.upload(
      "invoice/xmlUrl-single-" + new Date().getTime(),
      files.xml
    );
    const pdfUrl = await AlouxAWS.upload(
      "invoice/pdfUrl-single-" + new Date().getTime(),
      files.pdf
    );

    const factura = await Invoice.updateOne(
      { _id: req.params.invoice_id },
      {
        $set: {
          xmlUrl: xmlUrl,
          pdfUrl: pdfUrl,
          lastUpdate: new Date().getTime(),
        },
      }
    );

    res.status(200).send({ xmlUrl: xmlUrl, pdfUrl: pdfUrl });
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};

self.cancelFactura = async (invoice_id) => {
  try {
    let files = {
      pdf: {
        name: "filePDF.pdf",
      },
      xml: {
        name: "fileXML.xml",
      },
    };

    const facturapi = new Facturapi(process.env.BILL_KEY);

    // Descargar el PDF
    const pdfStream = await facturapi.invoices.downloadCancellationReceiptPdf(
      invoice_id
    );
    const pdfFile = fs.createWriteStream(process.env.INVOICE_PDF);
    pdfStream.pipe(pdfFile);

    // Descargar el XML
    const xmlStream = await facturapi.invoices.downloadCancellationReceiptXml(
      invoice_id
    );
    const xmlFile = fs.createWriteStream(process.env.INVOICE_XML);
    xmlStream.pipe(xmlFile);

    await Utils.sleep(2000);

    // Leer los archivos descargados
    files.pdf.data = Buffer.from(
      fs.readFileSync(process.env.INVOICE_PDF, "binary"),
      "binary"
    );
    files.xml.data = fs.readFileSync(process.env.INVOICE_XML, "utf8");

    return files;
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};

self.cancelFiles = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.invoice_id });

    // Obtener datos de los archivos PDF y XML
    let files = await self.cancelFactura(invoice._invoice);
    if (files.message) {
      throw new Error(files.message);
    }

    // Subir archivos al servicio de almacenamiento AWS S3
    const xmlCancelUrl = await AlouxAWS.upload(
      "invoiceCancel/xmlUrl-single-" + new Date().getTime(),
      files.xml
    );
    const pdfCancelUrl = await AlouxAWS.upload(
      "invoiceCancel/pdfUrl-single-" + new Date().getTime(),
      files.pdf
    );

    // Actualizar la factura en la base de datos con las URL de los archivos
    const factura = await Invoice.updateOne(
      { _id: req.params.invoice_id },
      {
        $set: {
          xmlCancelUrl: xmlCancelUrl,
          pdfCancelUrl: pdfCancelUrl,
          lastUpdate: new Date().getTime(),
        },
      }
    );

    res
      .status(200)
      .send({ xmlCancelUrl: xmlCancelUrl, pdfCancelUrl: pdfCancelUrl });
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};

self.resend = async (req, res) => {
  try {
    const invoiceFind = await Invoice.findOne({ _id: req.params.invoice_id });
    const facturapi = new Facturapi(process.env.BILL_KEY);
    const resend = await facturapi.invoices.sendByEmail(invoiceFind._invoice, {
      email: req.body.email,
    });

    if (resend.message) {
      throw {
        code: 402,
        title: "Error en los parametros",
        detail: resend.message,
        suggestion: "Intentalo más tarde",
      };
    }

    res.status(200).send("success");
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detallle del error",
      };
    }
    res.status(obj.code).send(obj);
  }
};

self.validateRFC = async (req, res) => {
  try {
    const facturapi = new Facturapi(process.env.BILL_KEY);
    const validation = await facturapi.tools.validateTaxId(req.body.rfc);

    res.status(200).send(validation);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error",
        detail: error.message,
        suggestion: "Revisa el detallle del error",
      };
    }
    res.status(obj.code).send(obj);
  }
};