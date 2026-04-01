import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const StudentProfile = sequelize.define(
  "StudentProfile",
  {
    student_profile_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "user_id",
      },
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
    tableName: "student_profile",
    timestamps: false,
  }
);

export default StudentProfile;
