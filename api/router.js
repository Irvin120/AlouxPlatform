const express = require("express");
const { IAMAuth } = require("aloux-iam");
const { authKey } = require("./authKey");

const router = express.Router();

var fileupload = require("express-fileupload");
router.use(fileupload());

// Controllers
const client = require("./controllers/client");
const project = require("./controllers/project");
const service = require("./controllers/service");
const key = require("./controllers/key");
const payment = require("./controllers/payment");
const contact = require("./controllers/contact");
const api = require("./controllers/api");
const utils = require("./controllers/utils");
const sms = require("./controllers/sms");
const email = require("./controllers/email");
const facturapi = require("./controllers/facturapi");
const categorie = require("./controllers/categorie");
const subCategorie = require("./controllers/subCategorie");
const subcategorieService = require("./controllers/serviceSubcategorie");
const complement = require("./controllers/complement");
const schedule = require("./controllers/schedule");
const notification = require("./controllers/notification");
const generatePdf = require("./controllers/generatePdf");
const summary = require("./controllers/summary");
const createTemplate = require("./controllers/emailSES/createTemplate");
const campaign = require("./controllers/emailSES/campaign");
const business = require("./controllers/business");
const portfolio = require("./controllers/portfolio");
// Endponts

// Client
router.post("/client", IAMAuth, client.create); // Validated
router.get("/client", IAMAuth, client.retrieve); // Validated
router.get("/client/count/all", IAMAuth, client.count); // Validated
router.get("/client/:CLIENT_ID", IAMAuth, client.detail);
router.patch("/client/:CLIENT_ID", IAMAuth, client.update);
router.put("/client/:CLIENT_ID/status", IAMAuth, client.status);
router.delete("/client/:CLIENT_ID", IAMAuth, client.delete);
router.patch("/client/:CLIENT_ID/files", IAMAuth, client.files);
router.get("/client/:CLIENT_ID/contact", IAMAuth, client.contact);
router.get("/client/:CLIENT_ID/project", IAMAuth, client.project);
router.get("/client/:CLIENT_ID/service", IAMAuth, client.service);
router.get("/client/:CLIENT_ID/key", IAMAuth, client.key);
router.get("/client/:CLIENT_ID/payment", IAMAuth, client.payment);

// Project
router.post("/project", IAMAuth, project.create); // Validated
router.get("/project", IAMAuth, project.retrieve); // Validated
router.get("/project/count", IAMAuth, project.count); // Validated
router.get("/project/:PROJECT_ID", IAMAuth, project.detail);
router.patch("/project/:PROJECT_ID", IAMAuth, project.update);
router.delete("/project/:PROJECT_ID", IAMAuth, project.delete);
router.get("/project/:PROJECT_ID/payment", IAMAuth, project.payment);
router.patch("/project/:PROJECT_ID/file", IAMAuth, project.file);

// Service
router.post("/service", IAMAuth, service.create);
router.get("/service", IAMAuth, service.retrieve);
router.get("/service/count", IAMAuth, service.count);
router.get("/service/:SERVICE_ID", IAMAuth, service.detail);
router.patch("/service/:SERVICE_ID", IAMAuth, service.update);
router.delete("/service/:SERVICE_ID", IAMAuth, service.delete);
router.get("/service/:SERVICE_ID/payment", IAMAuth, service.payment);
router.patch("/service/:SERVICE_ID/file", IAMAuth, service.file);

// Key
router.post("/key", IAMAuth, key.create);
router.get("/key", IAMAuth, key.retrieve);
router.get("/key/count", IAMAuth, key.count);
router.get("/key/:KEY_ID", IAMAuth, key.detail);
router.patch("/key/:KEY_ID", IAMAuth, key.update);
router.delete("/key/:KEY_ID", IAMAuth, key.delete);

// Payment
router.post("/payment", IAMAuth, payment.create);
router.get("/payment", IAMAuth, payment.retrieve);
router.get("/payment/count", IAMAuth, payment.count);
router.get("/payment/count/payable", IAMAuth, payment.payable);
router.get("/payment/count/expired", IAMAuth, payment.expired);
router.get("/payment/:PAYMENT_ID", IAMAuth, payment.detail);
router.patch("/payment/:PAYMENT_ID", IAMAuth, payment.update);
router.put("/payment/:PAYMENT_ID/status", IAMAuth, payment.status);
router.delete("/payment/:PAYMENT_ID", IAMAuth, payment.delete);

// Contact
router.post("/contact", IAMAuth, contact.create);
router.get("/contact", IAMAuth, contact.retrieve);
router.get("/contact/:CONTACT_ID", IAMAuth, contact.detail);
router.patch("/contact/:CONTACT_ID", IAMAuth, contact.update);
router.delete("/contact/:CONTACT_ID", IAMAuth, contact.delete);

// Log
router.post("/log", IAMAuth, key.create);
router.get("/log", IAMAuth, key.retrieve);
router.get("/log/count", IAMAuth, key.count);
router.get("/log/:LOG_ID", IAMAuth, key.detail);
router.patch("/log/:LOG_ID", IAMAuth, key.update);
router.delete("/log/:LOG_ID", IAMAuth, key.delete);

// Api
router.post("/cat/api", IAMAuth, api.create);
router.get("/cat/api", IAMAuth, api.retrieve);
router.get("/cat/api/:API_ID", IAMAuth, api.detail);
router.patch("/cat/api/:API_ID", IAMAuth, api.update);
router.delete("/cat/api/:API_ID", IAMAuth, api.delete);

router.post("/sms", authKey, sms.send);
router.post("/email", authKey, email.send);

//Cat product - Facturapi
router.post("/cat/product", IAMAuth, facturapi.retrieveCatProduct);
router.post("/cat/unit", IAMAuth, facturapi.retrieveUnit);

//Utils - SAT
router.get("/sat/catalogue/:key", IAMAuth, utils.satInfo);
router.get("/sat/catalogue", IAMAuth, utils.satInfoComplete);
router.get("/cfdi/catalogue", IAMAuth, utils.cfdiInfo);

//Invoice  - Facturapi
router.post("/invoice/api/:payment_id", IAMAuth, facturapi.createInvoice);
router.get("/invoice/api/:invoice_id", IAMAuth, facturapi.detailFactura);
router.get("/invoice/api/:invoice_id/download", IAMAuth, facturapi.UpadteFiles);
router.patch(
  "/invoice/api/cancel/:invoice_id",
  IAMAuth,
  facturapi.deleteFactura
);
router.post("/invoice/:invoice_id/resend", IAMAuth, facturapi.resend);

router.get("/invoice/api/:invoice_id/cancel", IAMAuth, facturapi.cancelFiles);
//Complement  - Facturapi
router.post("/invoice/api/complement/:payment_id", complement.create);
//Utils - Facturapi
router.post("/validate/rfc", IAMAuth, facturapi.validateRFC);

// Categorie
router.post("/service/categorie", IAMAuth, categorie.create);
router.get("/service/categorie/retrieve", IAMAuth, categorie.retrieve);
router.get("/service/categorie/:CATEGORIE_ID", IAMAuth, categorie.detail);
router.patch("/service/categorie/:CATEGORIE_ID", IAMAuth, categorie.update);
router.delete("/service/categorie/:CATEGORIE_ID", IAMAuth, categorie.delete);

// Subcategorie
router.post("/service/subcategorie", IAMAuth, subCategorie.create);
router.get("/service/subcategorie/retrieve", IAMAuth, subCategorie.retrieve);
router.get(
  "/service/subcategorie/:SUBCATEGORIE_ID",
  IAMAuth,
  subCategorie.detail
);
router.patch(
  "/service/subcategorie/:SUBCATEGORIE_ID",
  IAMAuth,
  subCategorie.update
);
router.delete(
  "/service/subcategorie/:SUBCATEGORIE_ID",
  IAMAuth,
  subCategorie.delete
);

// SubcategorieService
router.post("/subcategorie/service", IAMAuth, subcategorieService.create);
router.get(
  "/subcategorie/service/retrieve",
  IAMAuth,
  subcategorieService.retrieve
);
router.get(
  "/subcategorie/service/:SERVICE_ID",
  IAMAuth,
  subcategorieService.detail
);
router.patch(
  "/subcategorie/service/:SERVICE_ID",
  IAMAuth,
  subcategorieService.update
);
router.delete(
  "/subcategorie/service/:SERVICE_ID",
  IAMAuth,
  subcategorieService.delete
);
router.post(
  "/subcategorie/service/:SERVICE_ID/file",
  IAMAuth,
  subcategorieService.updatePicture
);

//Notification
router.get("/notification", IAMAuth, notification.retrieve);
router.get("/notification/last", IAMAuth, notification.lastFive);
router.patch("/notification/:NOTIFICATION_ID/seen", IAMAuth, notification.seen);

//PDF
router.post("/generate/pdf/:CLIENT_ID", IAMAuth, generatePdf.statementAccount);

//Schedule
router.get("/schedule/annual", schedule.generateNewPaymentAnnual);
router.get("/schedule/month", schedule.generateNewPayment);
//Summary
router.get("/summary", IAMAuth, summary.summary);
//Graphics
router.post("/graphics", IAMAuth, summary.graphics);

router.post("/create/template", createTemplate.configBulk);
router.delete("/create/template", createTemplate.deleteTemplate);
router.post("/campaign", campaign.create);

// Business
router.post("/business", IAMAuth, business.create);
router.get("/business/retrieve", IAMAuth, business.retrieve);
router.get("/business/:BUSINESS_ID", IAMAuth, business.detail);
router.patch("/business/:BUSINESS_ID", IAMAuth, business.update);
router.patch("/business/:BUSINESS_ID/picture", IAMAuth, business.picture);
router.delete("/business/:BUSINESS_ID", IAMAuth, business.delete);

// Portfolio
router.post("/portfolio", IAMAuth, portfolio.create);
router.get("/portfolio/retrieve", IAMAuth, portfolio.retrieve);
router.get("/portfolio/:PORTFOLIO_ID", IAMAuth, portfolio.detail);
router.patch("/portfolio/:PORTFOLIO_ID", IAMAuth, portfolio.update);
// router.patch("/portfolio/:PORTFOLIO_ID/picture", IAMAuth, portfolio.picture);
router.delete("/portfolio/:PORTFOLIO_ID", IAMAuth, portfolio.delete);

module.exports = router;
