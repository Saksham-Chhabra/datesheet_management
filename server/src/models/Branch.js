// models/Branch.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Degree from "./Degree.js";

const Branch = sequelize.define(
  "Branch",
  {
    branch_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "degree",
        key: "degree_id",
      },
    },
  },
  {
    tableName: "branch",
    timestamps: false,
  }
);


export default Branch;
