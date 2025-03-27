const Campaign = require("../../models/emailSES/Campaign");
const Email = require("./email");
const LogSES = require("../../models/emailSES/Log");
const Utils = require("./util");

const self = module.exports;

self.create = async (req, res) => {
  try {
    let emails = [];
    let campaign = new Campaign(req.body);
    campaign.createdAt = new Date().getTime();
    campaign.lastUpdate = campaign.createdAt;
    campaign.count = campaign.segmentation.length;
    campaign.countSuccess = 0;
    const createCampaign = await campaign.save();

    emails = campaign.segmentation;
    let arrayEmails = [];

    if (emails.length > 50) {
      const block = 50;
      for (let i = 0; i < emails.length; i += block) {
        let newArrayEmail = emails.slice(i, i + block);
        arrayEmails.push(newArrayEmail);
      }
      for (const j in arrayEmails) {
        await Utils.sleep(2500);
        await self.sendEmailBulkCustom(
          arrayEmails[j],
          campaign.emailTitle,
          createCampaign._id,
          campaign.emailSender
        );
      }
    } else {
      await Utils.sleep(2500);
      await self.sendEmailBulkCustom(
        emails,
        campaign.emailTitle,
        createCampaign._id,
        campaign.emailSender
      );
    }

    const contLogs = await LogSES.countDocuments({
      _campaign: createCampaign._id,
    });
    await Campaign.updateOne(
      { _id: createCampaign._id },
      { countSuccess: campaign.count - Number(contLogs) }
    );

    const create = await Campaign.findOne({ _id: createCampaign._id });
    res.status(201).send(create);
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

// self.retrieve = async (req, res) => {
//   try {
//     const retrieve = await Campaign.find({}).sort({ _id: -1 }).lean();
//     res.status(200).send(retrieve);
//   } catch (error) {
//     res.status(404).send({ error: error.message });
//   }
// };

// self.detail = async (req, res) => {
//   try {
//     let detail = await Campaign.findOne({ _id: req.params.CAMPAIGN_ID }).lean();
//     if (!detail) {
//       throw {
//         code: 404,
//         title: "No se encontro el elemento",
//         detail: "No se encontro la campaña",
//         suggestion: "Verifica su existencia",
//       };
//     }
//     res.status(200).send(detail);
//   } catch (error) {
//     let obj = error;
//     if (!error.code) {
//       obj = {
//         code: 400,
//         title: "Error",
//         detail: error.message,
//         suggestion: "Revisa el detallle del error",
//       };
//     }
//     res.status(obj.code).send(obj);
//   }
// };

self.sendEmailBulkCustom = async (
  emails,
  emailTitle,
  campaign_id,
  emailSender
) => {
  try {
    const options = {
      emails: emails,
      subject: emailTitle,
      emailSender: emailSender,
    };

    const status = await Email.sendCustom(
      await Email.configBulkCustom(options)
    );
    for (let j in status.Status) {
      if (status.Status[j].Status !== "Success") {
        //Logs email bulk
        let log = new LogSES();
        log.status = status.Status[j].Status;
        log.error = status.Status[j].Error;
        log.email = emails[j];
        log._campaign = campaign_id;
        log.createdAt = new Date().getTime();
        await log.save();
      }
    }
    return status;
  } catch (error) {
    return error;
  }
};
