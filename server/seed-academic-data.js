import dotenv from "dotenv";
import sequelize from "./src/db/db.js";
import {
  Department,
  Degree,
  Branch,
  Year,
  Semester,
  Subject,
  Exam,
  TimeSlot,
} from "./src/models/index.js";

dotenv.config();

const seedData = {
  departments: [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
  ],
  degrees: [
    { name: "B.Tech", department: "Computer Science and Engineering" },
    { name: "B.Tech", department: "Electronics and Communication Engineering" },
  ],
  branches: [
    {
      name: "CSE",
      degree: "B.Tech",
      department: "Computer Science and Engineering",
    },
    {
      name: "ECE",
      degree: "B.Tech",
      department: "Electronics and Communication Engineering",
    },
  ],
  years: [1, 2, 3, 4],
  slots: [
    { start: "09:00:00", end: "12:00:00" },
    { start: "14:00:00", end: "17:00:00" },
  ],
  exams: [
    { exam_type: "Mid Semester", academic_year: "2026-27" },
    { exam_type: "End Semester", academic_year: "2026-27" },
  ],
};

const branchSubjectTemplates = {
  CSE: {
    1: [
      "Programming Fundamentals",
      "Engineering Mathematics-I",
      "Digital Logic",
    ],
    2: [
      "Data Structures",
      "Engineering Mathematics-II",
      "Object Oriented Programming",
    ],
    3: [
      "Discrete Mathematics",
      "Computer Organization",
      "Design and Analysis of Algorithms",
    ],
    4: [
      "Operating Systems",
      "Database Management Systems",
      "Theory of Computation",
    ],
    5: ["Computer Networks", "Software Engineering", "Web Technologies"],
    6: ["Artificial Intelligence", "Compiler Design", "Machine Learning"],
    7: ["Cloud Computing", "Information Security", "Big Data Analytics"],
    8: ["DevOps", "Deep Learning", "Major Project"],
  },
  ECE: {
    1: [
      "Network Theory",
      "Engineering Mathematics-I",
      "Basic Electrical Engineering",
    ],
    2: [
      "Signals and Systems",
      "Engineering Mathematics-II",
      "Electronic Devices",
    ],
    3: [
      "Analog Electronics",
      "Digital Electronics",
      "Electromagnetic Field Theory",
    ],
    4: [
      "Communication Systems",
      "Microprocessors",
      "Linear Integrated Circuits",
    ],
    5: [
      "Control Systems",
      "Digital Signal Processing",
      "Antenna and Wave Propagation",
    ],
    6: ["VLSI Design", "Embedded Systems", "Wireless Communication"],
    7: ["Optical Communication", "Microwave Engineering", "Internet of Things"],
    8: ["Satellite Communication", "Advanced VLSI", "Major Project"],
  },
};

function subjectCode(branchCode, semesterNumber, index) {
  return `${branchCode}${semesterNumber}${String(index + 1).padStart(2, "0")}`;
}

function key(...parts) {
  return parts.join("::");
}

function getAttributeType(model, attributeName) {
  const attr = model.getAttributes()?.[attributeName];
  if (!attr) return "STRING";
  const type = attr.type;
  if (type.key) return type.key;
  const typeStr = type.toString().toUpperCase();
  if (typeStr.includes("VARCHAR") || typeStr.includes("STRING"))
    return "STRING";
  if (typeStr.includes("INTEGER")) return "INTEGER";
  if (typeStr.includes("BIGINT")) return "BIGINT";
  return "STRING";
}

function normalizeValueByType(value, dataType) {
  if (["INTEGER", "BIGINT", "FLOAT", "DOUBLE", "DECIMAL"].includes(dataType)) {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      throw new Error(
        `Invalid numeric value '${value}' for data type ${dataType}`
      );
    }
    return numberValue;
  }

  if (dataType === "BOOLEAN") {
    return Boolean(value);
  }

  return String(value);
}

function validateSeedData() {
  if (!Array.isArray(seedData.years) || seedData.years.length === 0) {
    throw new Error("seedData.years must be a non-empty array");
  }

  if (!Array.isArray(seedData.branches) || seedData.branches.length === 0) {
    throw new Error("seedData.branches must be a non-empty array");
  }

  for (const branchSeed of seedData.branches) {
    const template = branchSubjectTemplates[branchSeed.name];
    if (!template || typeof template !== "object") {
      throw new Error(
        `Missing subject template for branch '${branchSeed.name}'`
      );
    }

    for (let semesterNumber = 1; semesterNumber <= 8; semesterNumber += 1) {
      const subjects = template[semesterNumber];
      if (!Array.isArray(subjects) || subjects.length < 2) {
        throw new Error(
          `Branch '${branchSeed.name}' semester '${semesterNumber}' must have at least 2 subjects`
        );
      }
    }

    if (Object.keys(template).length !== 8) {
      throw new Error(
        `Subject template for branch '${branchSeed.name}' must contain semesters 1 to 8`
      );
    }
  }
}

async function seedAcademicData() {
  const tx = await sequelize.transaction();

  try {
    validateSeedData();

    console.log("Connecting to PostgreSQL...");
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    const yearNameType = getAttributeType(Year, "year_name");
    console.log(`Detected year_name type: ${yearNameType}`);

    const departmentMap = new Map();
    const degreeMap = new Map();
    const branchMap = new Map();
    const semesterMap = new Map();

    for (const departmentName of seedData.departments) {
      const [department, created] = await Department.findOrCreate({
        where: { department_name: departmentName },
        defaults: { department_name: departmentName },
        transaction: tx,
      });

      departmentMap.set(departmentName, department);
      console.log(
        `${created ? "Created" : "Exists"} department: ${departmentName}`
      );
    }

    for (const degreeSeed of seedData.degrees) {
      const department = departmentMap.get(degreeSeed.department);

      const [degree, created] = await Degree.findOrCreate({
        where: {
          degree_name: degreeSeed.name,
          department_id: department.department_id,
        },
        defaults: {
          degree_name: degreeSeed.name,
          department_id: department.department_id,
        },
        transaction: tx,
      });

      degreeMap.set(key(degreeSeed.department, degreeSeed.name), degree);
      console.log(
        `${created ? "Created" : "Exists"} degree: ${degreeSeed.name} (${degreeSeed.department})`
      );
    }

    for (const branchSeed of seedData.branches) {
      const degree = degreeMap.get(
        key(branchSeed.department, branchSeed.degree)
      );

      const [branch, created] = await Branch.findOrCreate({
        where: {
          branch_name: branchSeed.name,
          degree_id: degree.degree_id,
        },
        defaults: {
          branch_name: branchSeed.name,
          degree_id: degree.degree_id,
        },
        transaction: tx,
      });

      branchMap.set(branchSeed.name, branch);
      console.log(
        `${created ? "Created" : "Exists"} branch: ${branchSeed.name}`
      );
    }

    const primaryDegreeSeed = seedData.degrees[0];
    const primaryDegree = degreeMap.get(
      key(primaryDegreeSeed.department, primaryDegreeSeed.name)
    );

    for (let i = 0; i < seedData.years.length; i += 1) {
      const yearValue = normalizeValueByType(seedData.years[i], yearNameType);

      const [year, yearCreated] = await Year.findOrCreate({
        where: { year_name: yearValue },
        defaults: {
          year_name: yearValue,
          degree_id: primaryDegree.degree_id,
        },
        transaction: tx,
      });

      console.log(`${yearCreated ? "Created" : "Exists"} year: ${yearValue}`);

      const sem1 = i * 2 + 1;
      const sem2 = i * 2 + 2;

      for (const semesterNumber of [sem1, sem2]) {
        const [semester, semCreated] = await Semester.findOrCreate({
          where: {
            semester_number: semesterNumber,
            year_id: year.year_id,
          },
          defaults: {
            semester_number: semesterNumber,
            year_id: year.year_id,
          },
          transaction: tx,
        });

        semesterMap.set(key(semesterNumber), semester);
        console.log(
          `${semCreated ? "Created" : "Exists"} semester: ${semesterNumber}`
        );
      }
    }

    for (const branchSeed of seedData.branches) {
      const branch = branchMap.get(branchSeed.name);
      const templateBySemester = branchSubjectTemplates[branchSeed.name] || {};

      for (const [semesterKey, subjectNames] of Object.entries(
        templateBySemester
      )) {
        const semesterNumber = Number(semesterKey);
        const semester = semesterMap.get(key(semesterNumber));

        for (let index = 0; index < subjectNames.length; index += 1) {
          const code = subjectCode(branchSeed.name, semesterNumber, index);

          const [subject, created] = await Subject.findOrCreate({
            where: { subject_code: code },
            defaults: {
              subject_code: code,
              subject_name: subjectNames[index],
              branch_id: branch.branch_id,
              semester_id: semester.semester_id,
            },
            transaction: tx,
          });

          if (!created) {
            await subject.update(
              {
                subject_name: subjectNames[index],
                branch_id: branch.branch_id,
                semester_id: semester.semester_id,
              },
              { transaction: tx }
            );
          }

          console.log(`${created ? "Created" : "Updated"} subject: ${code}`);
        }
      }
    }

    for (const examSeed of seedData.exams) {
      const [exam, created] = await Exam.findOrCreate({
        where: {
          exam_type: examSeed.exam_type,
          academic_year: examSeed.academic_year,
        },
        defaults: examSeed,
        transaction: tx,
      });

      console.log(
        `${created ? "Created" : "Exists"} exam: ${exam.exam_type} ${exam.academic_year}`
      );
    }

    for (const slotSeed of seedData.slots) {
      const [slot, created] = await TimeSlot.findOrCreate({
        where: {
          start_time: slotSeed.start,
          end_time: slotSeed.end,
        },
        defaults: {
          start_time: slotSeed.start,
          end_time: slotSeed.end,
        },
        transaction: tx,
      });

      console.log(
        `${created ? "Created" : "Exists"} slot: ${slot.start_time} - ${slot.end_time}`
      );
    }

    await tx.commit();
    console.log("Academic data seeded successfully.");
    process.exit(0);
  } catch (error) {
    await tx.rollback();
    const errorDetails = error?.errors
      ? error.errors.map((e) => e.message).join(" | ")
      : "";
    console.error(
      "Failed to seed academic data:",
      error.message,
      errorDetails ? `| Details: ${errorDetails}` : ""
    );
    process.exit(1);
  }
}

seedAcademicData();
