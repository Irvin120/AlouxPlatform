const { IAMUserBusiness, AlouxAWS } = require("aloux-iam");
const self = module.exports;

// Create
self.create = async (req, res) => {
  try {
    let business = new IAMUserBusiness(req.body);
    business.createdAt = new Date().getTime();
    const create = await business.save();

    res.status(201).send(create);
  } catch (error) {
    const obj = {
      title: "Error al crear el negocio.",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Retrieve
self.retrieve = async (req, res) => {
  try {
    const retrieve = await IAMUserBusiness.find({}).sort({ _id: -1 });

    res.status(200).send(retrieve);
  } catch (error) {
    const obj = {
      title: "Error al obtener los negocios",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Detail
self.detail = async (req, res) => {
  try {
    const _id = req.params.BUSINESS_ID;
    const detail = await IAMUserBusiness.findOne({ _id });

    if (!detail) throw new Error("Upss! No se encontró el Elemento");

    res.status(200).send(detail);
  } catch (error) {
    const obj = {
      title: "Error al obtener el detalle del negocio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Update
self.update = async (req, res) => {
  try {
    const _id = req.params.BUSINESS_ID;

    await IAMUserBusiness.updateOne({ _id }, { $set: req.body });

    let business = await IAMUserBusiness.findOne({ _id });

    business.lastUpdate = new Date().getTime();
    const update = await business.save();

    res.status(202).send(update);
  } catch (error) {
    const obj = {
      title: "Error al actualizar el negocio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

// Delete
self.delete = async (req, res) => {
  try {
    const _id = req.params.BUSINESS_ID;
    const del = await IAMUserBusiness.deleteOne({ _id });

    res.status(200).send(del);
  } catch (error) {
    const obj = {
      title: "Error al eliminar el negocio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
};

//update picture
self.picture = async (req, res) => {
  try {
      let business = await IAMUserBusiness.findOne({ _id: req.params.BUSINESS_ID })
      const imgUrl = await AlouxAWS.upload('business/' + 'bus' + "-" + req.params.BUSINESS_ID, req.files.picture)
      business.imgUrl = imgUrl
      const updateBusiness = await business.save()
      res.status(202).send(updateBusiness)
  } catch (error) {
    const obj = {
      title: "Error al cargar la foto el negocio",
      detail: error.message,
      suggestion: "Revisa el detalle del error",
    };
    res.status(400).send(obj);
  }
}

// Validate business ID
self.validateBusinessId = async (req) => {
  const businessId = req.header(process.env.BUSINESS_ID_HEADER);
  if (!businessId) {
    throw {
      code: 400,
      title: "Falta el ID del negocio",
      detail: "El ID del negocio es obligatorio.",
      suggestion: "Proporcione el ID del negocio en los headers de la solicitud."
    };
  }

  const business = await IAMUserBusiness.findById(businessId).lean();
  if (!business) {
    throw {
      code: 404,
      title: "Negocio no encontrado",
      detail: "No se encontró un negocio con el ID proporcionado",
      suggestion: "Verifique que el ID del negocio sea correcto."
    };
  }

  return businessId;
};