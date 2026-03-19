import Department from "./Department.js";
import Degree from "./Degree.js";
import Branch from "./Branch.js";
import Year from "./Year.js";
import Semester from "./Semester.js";
import Subject from "./Subject.js";
import Exam from "./Exam.js";
import TimeSlot from "./TimeSlot.js";
import DateSheet from "./Datesheet.js";
import User from "./User.js";

// Department -> Degree
Department.hasMany(Degree, { foreignKey: "department_id" });
Degree.belongsTo(Department, { foreignKey: "department_id" });

// Degree -> Branch
Degree.hasMany(Branch, { foreignKey: "degree_id" });
Branch.belongsTo(Degree, { foreignKey: "degree_id" });

// Degree -> Year
Degree.hasMany(Year, { foreignKey: "degree_id" });
Year.belongsTo(Degree, { foreignKey: "degree_id" });

// Year -> Semester
Year.hasMany(Semester, { foreignKey: "year_id" });
Semester.belongsTo(Year, { foreignKey: "year_id" });

// Branch -> Subject
Branch.hasMany(Subject, { foreignKey: "branch_id" });
Subject.belongsTo(Branch, { foreignKey: "branch_id" });

// Semester -> Subject
Semester.hasMany(Subject, { foreignKey: "semester_id" });
Subject.belongsTo(Semester, { foreignKey: "semester_id" });

// Subject -> DateSheet
Subject.hasMany(DateSheet, { foreignKey: "subject_id" });
DateSheet.belongsTo(Subject, { foreignKey: "subject_id" });

// Exam -> DateSheet
Exam.hasMany(DateSheet, { foreignKey: "exam_id" });
DateSheet.belongsTo(Exam, { foreignKey: "exam_id" });

// TimeSlot -> DateSheet
TimeSlot.hasMany(DateSheet, { foreignKey: "slot_id" });
DateSheet.belongsTo(TimeSlot, { foreignKey: "slot_id" });

export {
  Department,
  Degree,
  Branch,
  Year,
  Semester,
  Subject,
  Exam,
  TimeSlot,
  DateSheet,
  User,
};
