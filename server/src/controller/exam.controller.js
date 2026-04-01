import Exam from "../models/Exam.js";

export async function getAllExams(req, res) {
  try {
    const exams = await Exam.findAll({ order: [["exam_id", "DESC"]] });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error });
  }
}

export async function getExamById(req, res) {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exam", error });
  }
}

export async function getExamsByType(req, res) {
  try {
    const exams = await Exam.findAll({
      where: { exam_type: req.params.examType },
      order: [["exam_id", "DESC"]],
    });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams by type", error });
  }
}

export async function getExamsByAcademicYear(req, res) {
  try {
    const exams = await Exam.findAll({
      where: { academic_year: req.params.academicYear },
      order: [["exam_id", "DESC"]],
    });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams by year", error });
  }
}

export async function createExam(req, res) {
  try {
    const { exam_type, academic_year } = req.body;
    if (!exam_type || !academic_year) {
      return res
        .status(400)
        .json({ message: "exam_type and academic_year are required" });
    }

    const exam = await Exam.create({
      exam_type: String(exam_type).trim(),
      academic_year: String(academic_year).trim(),
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error creating exam", error });
  }
}

export async function updateExam(req, res) {
  try {
    const { exam_type, academic_year } = req.body;
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await exam.update({
      exam_type: exam_type ?? exam.exam_type,
      academic_year: academic_year ?? exam.academic_year,
    });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Error updating exam", error });
  }
}

export async function deleteExam(req, res) {
  try {
    const deleted = await Exam.destroy({ where: { exam_id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam", error });
  }
}
