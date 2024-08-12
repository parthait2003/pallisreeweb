import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    expense: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    noOfNewTraineeCricket: {
      type: Number,
      required: true,
    },
    noOfNewTraineeFootball: {
      type: Number,
      required: true,
    },
    noOfNewClubMember: {
      type: Number,
      required: true,
    },
    profitAndLoss: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;
