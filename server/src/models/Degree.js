// models/Degree.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Department from "./Department.js";

const Degree = sequelize.define(
  "Degree",
  {
    degree_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    degree_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "department",
        key: "department_id",
      },
    },
  },
  {
    tableName: "degree",
    timestamps: false,
  }
);


export default Degree;
