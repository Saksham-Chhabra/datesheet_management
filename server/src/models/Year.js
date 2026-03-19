// models/Year.js
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import Degree from "./Degree.js";

const Year = sequelize.define(
  "Year",
  {
    year_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    year_name: {
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
    tableName: "year",
    timestamps: false,
  }
);

Year.belongsTo(Degree, { foreignKey: "degree_id" });
Degree.hasMany(Year, { foreignKey: "degree_id" });

export default Year;
