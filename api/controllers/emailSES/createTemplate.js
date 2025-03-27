const {
  SESClient,
  CreateTemplateCommand,
  DeleteTemplateCommand,
} = require("@aws-sdk/client-ses");
const fs = require("fs");
const self = module.exports;

self.configBulk = async (req, res) => {
  try {
    let data = fs.readFileSync(process.env.TEMPLATE_EMAIL_BULK, "utf8");
    const client = new SESClient({ region: process.env.AWS_REGION });
    const input = {
      Template: {
        TemplateName: process.env.TEMPLATE_BULK_NAME,
        SubjectPart: "{{subject}}",
        text: "Promociones que  embellecen tu rostro y cuerpo. 🌟✨",
        HtmlPart: data,
      },
    };
    const command = new CreateTemplateCommand(input);
    const response = await client.send(command);
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

self.deleteTemplate = async (req, res) => {
  try {
    const client = new SESClient({ region: process.env.AWS_REGION });
    const input = {
      TemplateName: process.env.TEMPLATE_BULK_NAME,
    };
    const command = new DeleteTemplateCommand(input);
    const response = await client.send(command);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
