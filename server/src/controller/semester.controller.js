import Semester from "../models/Semester.js";

export function getAllSemesters(req, res) {
  Semester.findAll()
    .then((semesters) => {
      res.status(200).json(semesters);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching semesters", error });
    });
}

export function createSemester(req, res) {
  const { semester_name, year_id } = req.body;
  if (!semester_name || !year_id) {
    return res
      .status(400)
      .json({ message: "Semester name and year_id are required" });
  }
  Semester.create({ semester_name, year_id })
    .then((semester) => {
      res.status(201).json(semester);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating semester", error });
    });
}

export function deleteSemester(req, res) {
  const { id } = req.params;
  Semester.destroy({ where: { semester_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Semester deleted successfully" });
      } else {
        res.status(404).json({ message: "Semester not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting semester", error });
    });
}

export function updateSemester(req, res) {
  const { id } = req.params;
  const { semester_name } = req.body;
  Semester.update({ semester_name }, { where: { semester_id: id } })
    .then(([updated]) => {
      if (updated) {
        res.status(200).json({ message: "Semester updated successfully" });
      } else {
        res.status(404).json({ message: "Semester not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating semester", error });
    });
}
