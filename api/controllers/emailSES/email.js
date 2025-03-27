const {
  SESClient,
  SendBulkTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const self = module.exports;

self.configBulkCustom = async (obj) => {
  try {
    let emailSettings = {};
    let emailsFormat = [];
    emailSettings.subject = obj.subject.replace(/(\r\n|\n|\r)/gm, " ");
    for (const key in obj.emails) {
      emailsFormat.push({
        Destination: {
          ToAddresses: [obj.emails[key]],
        },
        ReplacementTemplateData:
          '{ "subject": "' +
          emailSettings.subject +
          '","email": "' +
          obj.emails[key] +
          '" }',
      });
    }
    // emailsFormat.push({
    //   Destination: {
    //     ToAddresses: obj.emailSender,
    //   },
    //   ReplacementTemplateData:
    //     '{ "subject": "' +
    //     emailSettings.subject +
    //     '", "email": "' +
    //     obj.emailSender +
    //     '" }',
    // });
    emailSettings.ToAddresses = emailsFormat;
    emailSettings.emailSender = obj.emailSender;
    return emailSettings;
  } catch (error) {
    return error.message;
  }
};

self.sendCustom = async (emailSettings) => {
  try {
    const client = new SESClient({ region: process.env.AWS_REGION });
    const params = {
      Source: "Centro de Cirugía Plástica <" + emailSettings.emailSender + ">",
      Template: process.env.TEMPLATE_BULK_NAME,
      Destinations: emailSettings.ToAddresses,
      DefaultTemplateData:
        '{ "subject": "Promoción de Centro de Cirugía Plástica","email":"undefined.com"}',
    };
    const command = new SendBulkTemplatedEmailCommand(params);
    const response = await client.send(command);
    return response;
  } catch (error) {
    throw {
      code: 403,
      title: "Error al enviar el correo",
      detail: error.message,
      suggestion: "Revisa el detalle",
      error: new Error(),
    };
  }
};
