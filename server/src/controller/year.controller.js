import Year from "../models/Year.js";

export function getAllYears(req, res) {
  Year.findAll()
    .then((years) => {
      res.status(200).json(years);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching years", error });
    });
}

export function createYear(req, res) {
  const { year_name, degree_id } = req.body;
  if (!year_name || !degree_id) {
    return res
      .status(400)
      .json({ message: "Year name and degree_id are required" });
  }
  Year.create({ year_name, degree_id })
    .then((year) => {
      res.status(201).json(year);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating year", error });
    });
}

export function deleteYear(req, res) {
  const { id } = req.params;
  Year.destroy({ where: { year_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Year deleted successfully" });
      } else {
        res.status(404).json({ message: "Year not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting year", error });
    });
}

export function updateYear(req, res) {
  const { id } = req.params;
  const { year_name, degree_id } = req.body;
  Year.update({ year_name, degree_id }, { where: { year_id: id } })
    .then(([updated]) => {
      if (updated) {
        Year.findByPk(id).then((year) => {
          res.status(200).json({ message: "Year updated successfully", year });
        });
      } else {
        res.status(404).json({ message: "Year not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating year", error });
    });
}
