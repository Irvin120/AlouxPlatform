var schedule = require("node-schedule");
const scheduleController = require("./controllers/schedule");

const ruleService = new schedule.RecurrenceRule();
ruleService.hour = 1;
ruleService.minute = 10;
const job = schedule.scheduleJob(ruleService, async function () {
  await scheduleController.generateNewPaymentJob();
});

const ruleService = new schedule.RecurrenceRule();
ruleService.hour = 1;
ruleService.minute = 15;
const job2 = schedule.scheduleJob(ruleService, async function () {
  await scheduleController.generateNewPaymentAnnualJob();
});
