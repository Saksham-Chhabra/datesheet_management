import Degree from "../models/Degree.js";

export function getAllDegrees(req, res) {
  Degree.findAll()
    .then((degrees) => {
      res.status(200).json(degrees);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching degrees", error });
    });
}

export function createDegree(req, res) {
  const { degree_name } = req.body;
  if (!degree_name) {
    return res.status(400).json({ message: "Degree name is required" });
  }
  Degree.create({ degree_name })
    .then((degree) => {
      res.status(201).json(degree);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating degree", error });
    });
}

export function deleteDegree(req, res) {
  const { id } = req.params;
  Degree.destroy({ where: { degree_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Degree deleted successfully" });
      } else {
        res.status(404).json({ message: "Degree not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting degree", error });
    });
}

export function updateDegree(req, res) {
  const { id } = req.params;
  const { degree_name } = req.body;
  Degree.update({ degree_name }, { where: { degree_id: id } })
    .then(([updated]) => {
      if (updated) {
        res.status(200).json({ message: "Degree updated successfully" });
      } else {
        res.status(404).json({ message: "Degree not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating degree", error });
    });
}
