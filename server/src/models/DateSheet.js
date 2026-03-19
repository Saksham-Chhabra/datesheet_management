// models/DateSheet.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Subject from "./Subject.js";
import Exam from "./Exam.js";
import TimeSlot from "./TimeSlot.js";

const DateSheet = sequelize.define(
  "DateSheet",
  {
    datesheet_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    exam_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "subject",
        key: "subject_id",
      },
    },
    exam_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "exam",
        key: "exam_id",
      },
    },
    slot_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "timeslot",
        key: "slot_id",
      },
    },
  },
  {
    tableName: "datesheet",
    timestamps: false,
  }
);


export default DateSheet;
