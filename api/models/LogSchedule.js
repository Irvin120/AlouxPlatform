const mongoose = require("mongoose");

const logScheduleSchema = mongoose.Schema({
  origin: { type: String, required: true, maxLength: 50, trim: true },
  comment: { type: String, required: true, maxLength: 700, trim: false },
  app: {
    type: String,
    enum: ["PLATFORM", "OTRO"],
    required: true,
  },
  data: { type: Object, required: false },
  createdAt: { type: Number, required: true },
});

const LogSchedule = mongoose.model("LogSchedule", logScheduleSchema);
module.exports = LogSchedule;
