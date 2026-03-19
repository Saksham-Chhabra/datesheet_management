// models/Semester.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Year from "./Year.js";

const Semester = sequelize.define(
  "Semester",
  {
    semester_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    semester_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "year",
        key: "year_id",
      },
    },
  },
  {
    tableName: "semester",
    timestamps: false,
  }
);


export default Semester;
