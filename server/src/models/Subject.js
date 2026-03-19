// models/Subject.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Branch from "./Branch.js";
import Semester from "./Semester.js";

const Subject = sequelize.define(
  "Subject",
  {
    subject_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    subject_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subject_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "branch",
        key: "branch_id",
      },
    },
    semester_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "semester",
        key: "semester_id",
      },
    },
  },
  {
    tableName: "subject",
    timestamps: false,
  }
);


export default Subject;
