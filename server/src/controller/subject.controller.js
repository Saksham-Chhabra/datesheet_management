import Subject from "../models/Subject.js";

export function getAllSubjects(req, res) {
  Subject.findAll()
    .then((subjects) => {
      res.status(200).json(subjects);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching subjects", error });
    });
}

export function createSubject(req, res) {
  const { subject_name, subject_code, branch_id, semester_id } = req.body;
  if (!subject_name || !subject_code || !branch_id || !semester_id) {
    return res.status(400).json({
      message:
        "Subject name, subject_code, branch_id, and semester_id are required",
    });
  }
  Subject.create({ subject_name, subject_code, branch_id, semester_id })
    .then((subject) => {
      res.status(201).json(subject);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating subject", error });
    });
}

export function deleteSubject(req, res) {
  const { id } = req.params;
  Subject.destroy({ where: { subject_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Subject deleted successfully" });
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting subject", error });
    });
}

export function updateSubject(req, res) {
  const { id } = req.params;
  const { subject_name, subject_code, branch_id, semester_id } = req.body;
  Subject.update(
    { subject_name, subject_code, branch_id, semester_id },
    { where: { subject_id: id } }
  )
    .then(([updated]) => {
      if (updated) {
        Subject.findByPk(id).then((subject) => {
          res
            .status(200)
            .json({ message: "Subject updated successfully", subject });
        });
      } else {
        res.status(404).json({ message: "Subject not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating subject", error });
    });
}
