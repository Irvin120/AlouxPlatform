const Client = require("../models/Client");
const Project = require("../models/Project");
const Service = require("../models/Service");
const Key = require("../models/Key");
const Contact = require("../models/Contact");
const Payment = require("../models/Payment");
const path = require("path");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

const self = module.exports;

// Create
self.create = async (req, res) => {
  try {
    let client = new Client(req.body);
    client.createdAt = new Date().getTime();
    client.status = "Activo";

    const create = await client.save();

    res.status(201).send(create);
  } catch (error) {
    const obj = {
      title: "Error al crear cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve
self.retrieve = async (req, res) => {
  try {
    const retrieve = await Client.find({}).sort({ _id: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al obtener los cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Count
self.count = async (req, res) => {
  try {
    const response = await Client.countDocuments();

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

// Detail
self.detail = async (req, res) => {
  try {
    const _id = req.params.CLIENT_ID;
    const detail = await Client.findOne({ _id }).lean();
    detail.files = detail.files || {};

    if (!detail) throw new Error("Upss! No se encontró el Elemento");

    res.status(200).send(detail);
  } catch (error) {
    const obj = {
      title: "Error al obtener el detalle del cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Update
self.update = async (req, res) => {
  try {
    const _id = req.params.CLIENT_ID;

    await Client.updateOne({ _id }, { $set: req.body });

    let client = await Client.findOne({ _id });

    client.lastUpdate = new Date().getTime();
    const update = await client.save();

    res.status(202).send(update);
  } catch (error) {
    const obj = {
      title: "Error al actualizar el cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Delete
self.delete = async (req, res) => {
  try {
    const _id = req.params.CLIENT_ID;
    const del = await Client.deleteOne({ _id });

    res.status(200).send(del);
  } catch (error) {
    const obj = {
      title: "Error al eliminar el cliente",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Change Status
self.status = async (req, resp) => {
  try {
    const _id = req.params.CLIENT_ID;
    let client = await Client.findOne({ _id });

    if (!client) {
      throw {
        code: 404,
        title: "Id no encontrado",
        detail: "No se encontró el _id: " + _id,
        suggestion: "Verifique la información",
        error: new Error(),
      };
    }

    client.status = req.body.status;
    client.lastUpdate = new Date().getTime();
    const result = await client.save();

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
    res.status(error.code).send(obj);
  }
};

// Create or replace any files from files
self.files = async (req, res) => {
  try {
    const CLIENT_ID = req.params.CLIENT_ID;
    let client = await Client.findOne({ _id: CLIENT_ID }).lean();

    if (!client) {
      throw {
        code: 404,
        title: "Id no encontrado",
        detail: "No se encontró el _id: " + _id,
        suggestion: "Verifique la información",
        error: new Error(),
      };
    }

    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    let query = {};

    for (let field in req.files) {
      const extension = path.extname(req.files[field].name);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: "clients/" + CLIENT_ID + "/" + field + "/" + "logo" + extension,
        ContentType: "application/" + extension,
        Body: req.files[field].data,
        ACL: "public-read",
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      let filesObject = {};
      filesObject[field] =
        "https://" +
        process.env.AWS_BUCKET +
        ".s3.amazonaws.com/" +
        "clients/" +
        CLIENT_ID +
        "/" +
        field +
        "/" +
        "logo" +
        extension;

      filesObject?.imgUrl
        ? (query["files.imgUrl"] = filesObject.imgUrl)
        : (query = query);
      filesObject?.llcUrl
        ? (query["files.llcUrl"] = filesObject.llcUrl)
        : (query = query);
      filesObject?.satUrl
        ? (query["files.satUrl"] = filesObject.satUrl)
        : (query = query);
      filesObject?.ineFrontUrl
        ? (query["files.ineFrontUrl"] = filesObject.ineFrontUrl)
        : (query = query);
      filesObject?.ineUrl
        ? (query["files.ineUrl"] = filesObject.ineUrl)
        : (query = query);
    }
    await Client.updateOne({ _id: CLIENT_ID }, query);
    client = await Client.findOne({ _id: CLIENT_ID }).lean();
    res.status(200).send(client);
  } catch (error) {
    let obj = error;
    if (!error.code) {
      obj = {
        code: 400,
        title: "Error al cargar el archivo",
        detail: error.message,
        suggestion: "Revisar el detalle del error",
      };
    }
    res.status(error.code).send(obj);
  }
};

// Retrieve projects
self.project = async (req, res) => {
  try {
    const _client = req.params.CLIENT_ID;
    const retrieve = await Project.find({ _client }).sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al crear cliente",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve services
self.service = async (req, res) => {
  try {
    const _client = req.params.CLIENT_ID;
    const retrieve = await Service.find({ _client }).sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al obtener los servicios del cliente",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve keys
self.key = async (req, res) => {
  try {
    const _client = req.params.CLIENT_ID;
    const retrieve = await Key.find({ _client }, { config: 0, origins: 0 })
      .populate("_client")
      .sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error obtener las llaves del cliente",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve keys
self.contact = async (req, res) => {
  try {
    const _client = req.params.CLIENT_ID;
    const retrieve = await Contact.find({ _client }).sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error obtener los contactos del cliente",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve payments
self.payment = async (req, res) => {
  try {
    const _client = req.params.CLIENT_ID;
    const retrieve = await Payment.find({ _client }).sort({ createdAt: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error obtener los pagos del cliente",
      detail: error.message,
      suggestion: "Revisar el detalle del error",
    };
    res.status(400).send(obj);
  }
};
