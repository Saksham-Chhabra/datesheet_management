import { Op } from "sequelize";
import sequelize from "../db/db.js";
import DateSheet from "../models/DateSheet.js";
import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";
import TimeSlot from "../models/TimeSlot.js";
import StudentProfile from "../models/StudentProfile.js";

const datesheetInclude = [
  {
    model: Subject,
    attributes: [
      "subject_id",
      "subject_code",
      "subject_name",
      "branch_id",
      "semester_id",
    ],
  },
  {
    model: Exam,
    attributes: ["exam_id", "exam_type", "academic_year"],
  },
  {
    model: TimeSlot,
    attributes: ["slot_id", "start_time", "end_time"],
  },
];

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export async function getAllDateSheets(req, res) {
  try {
    const rows = await DateSheet.findAll({
      include: datesheetInclude,
      order: [["exam_date", "ASC"]],
    });
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching datesheets", error });
  }
}

export async function getDateSheetById(req, res) {
  try {
    const row = await DateSheet.findByPk(req.params.id, {
      include: datesheetInclude,
    });
    if (!row) {
      return res.status(404).json({ message: "Datesheet entry not found" });
    }

    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ message: "Error fetching datesheet", error });
  }
}

export async function getDateSheetsByExam(req, res) {
  try {
    const rows = await DateSheet.findAll({
      where: { exam_id: req.params.examId },
      include: datesheetInclude,
      order: [["exam_date", "ASC"]],
    });

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam datesheet", error });
  }
}

export async function getDateSheetsBySubject(req, res) {
  try {
    const rows = await DateSheet.findAll({
      where: { subject_id: req.params.subjectId },
      include: datesheetInclude,
      order: [["exam_date", "ASC"]],
    });

    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subject datesheet", error });
  }
}

export async function getMyDateSheets(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const profile = await StudentProfile.findOne({
      where: { user_id: userId },
      attributes: ["branch_id", "semester_id"],
    });

    if (!profile) {
      return res.status(400).json({
        message:
          "Student academic profile is not set. Please select branch and semester first.",
      });
    }

    const rows = await DateSheet.findAll({
      include: [
        {
          model: Subject,
          where: {
            branch_id: profile.branch_id,
            semester_id: profile.semester_id,
          },
          attributes: [
            "subject_id",
            "subject_code",
            "subject_name",
            "branch_id",
            "semester_id",
          ],
        },
        {
          model: Exam,
          attributes: ["exam_id", "exam_type", "academic_year"],
        },
        {
          model: TimeSlot,
          attributes: ["slot_id", "start_time", "end_time"],
        },
      ],
      order: [["exam_date", "ASC"]],
    });

    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student datesheet", error });
  }
}

export async function createDateSheet(req, res) {
  try {
    const { exam_date, subject_id, exam_id, slot_id } = req.body;
    if (!exam_date || !subject_id || !exam_id || !slot_id) {
      return res.status(400).json({
        message: "exam_date, subject_id, exam_id and slot_id are required",
      });
    }

    const created = await DateSheet.create({
      exam_date,
      subject_id,
      exam_id,
      slot_id,
    });
    const row = await DateSheet.findByPk(created.datesheet_id, {
      include: datesheetInclude,
    });
    res.status(201).json(row);
  } catch (error) {
    res.status(500).json({ message: "Error creating datesheet entry", error });
  }
}

export async function updateDateSheet(req, res) {
  try {
    const row = await DateSheet.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ message: "Datesheet entry not found" });
    }

    const { exam_date, subject_id, exam_id, slot_id } = req.body;
    await row.update({
      exam_date: exam_date ?? row.exam_date,
      subject_id: subject_id ?? row.subject_id,
      exam_id: exam_id ?? row.exam_id,
      slot_id: slot_id ?? row.slot_id,
    });

    const refreshed = await DateSheet.findByPk(row.datesheet_id, {
      include: datesheetInclude,
    });
    res.status(200).json(refreshed);
  } catch (error) {
    res.status(500).json({ message: "Error updating datesheet entry", error });
  }
}

export async function deleteDateSheet(req, res) {
  try {
    const deleted = await DateSheet.destroy({
      where: { datesheet_id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Datesheet entry not found" });
    }

    res.status(200).json({ message: "Datesheet entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting datesheet entry", error });
  }
}

export async function generateDateSheet(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const examIdFromParam = req.params.examId
      ? Number(req.params.examId)
      : null;
    const {
      branch_id,
      semester_id,
      slot_id,
      start_date,
      end_date,
      exam_type,
      academic_year,
    } = req.body;

    if (!branch_id || !semester_id || !slot_id || !start_date || !end_date) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "branch_id, semester_id, slot_id, start_date and end_date are required",
      });
    }

    let exam = null;
    if (examIdFromParam) {
      exam = await Exam.findByPk(examIdFromParam, { transaction });
      if (!exam) {
        await transaction.rollback();
        return res.status(404).json({ message: "Exam not found" });
      }
    } else {
      if (!exam_type || !academic_year) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "exam_type and academic_year are required when examId is not passed",
        });
      }

      const [existingOrCreated] = await Exam.findOrCreate({
        where: {
          exam_type: String(exam_type).trim(),
          academic_year: String(academic_year).trim(),
        },
        defaults: {
          exam_type: String(exam_type).trim(),
          academic_year: String(academic_year).trim(),
        },
        transaction,
      });
      exam = existingOrCreated;
    }

    const slot = await TimeSlot.findByPk(slot_id, { transaction });
    if (!slot) {
      await transaction.rollback();
      return res.status(404).json({ message: "Time slot not found" });
    }

    const subjects = await Subject.findAll({
      where: { branch_id, semester_id },
      order: [["subject_id", "ASC"]],
      transaction,
    });

    if (!subjects.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: "No subjects found for selected branch and semester",
      });
    }

    const startDate = toDate(start_date);
    const endDate = toDate(end_date);
    if (!startDate || !endDate) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Invalid start_date or end_date" });
    }

    if (endDate < startDate) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "end_date must be after start_date" });
    }

    const totalDays =
      Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (totalDays < subjects.length) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Date range has only ${totalDays} day(s), but ${subjects.length} subject(s) need scheduling`,
      });
    }

    const subjectIds = subjects.map((subject) => subject.subject_id);

    await DateSheet.destroy({
      where: {
        exam_id: exam.exam_id,
        subject_id: { [Op.in]: subjectIds },
      },
      transaction,
    });

    const entriesToCreate = subjects.map((subject, index) => {
      const examDate = new Date(startDate);
      examDate.setDate(startDate.getDate() + index);

      return {
        exam_date: formatDate(examDate),
        subject_id: subject.subject_id,
        exam_id: exam.exam_id,
        slot_id,
      };
    });

    await DateSheet.bulkCreate(entriesToCreate, { transaction });
    await transaction.commit();

    const generated = await DateSheet.findAll({
      where: {
        exam_id: exam.exam_id,
        subject_id: { [Op.in]: subjectIds },
      },
      include: datesheetInclude,
      order: [["exam_date", "ASC"]],
    });

    res.status(201).json({
      message: "Datesheet generated successfully",
      exam,
      count: generated.length,
      datesheet: generated,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error generating datesheet", error });
  }
}
