import Department from "../models/Department.js";

export function getAllDepartments(req, res) {
  Department.findAll()
    .then((departments) => {
      res.status(200).json(departments);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching departments", error });
    });
}

export function createDepartment(req, res) {
  const { department_name } = req.body;

  if (!department_name) {
    return res.status(400).json({ message: "Department name is required" });
  }
  Department.create({ department_name })
    .then((department) => {
      res.status(201).json(department);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating department", error });
    });
}

export function deleteDepartment(req, res) {
  const { id } = req.params;
  Department.destroy({ where: { department_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Department deleted successfully" });
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting department", error });
    });
}

export function updateDepartment(req, res) {
  const { id } = req.params;
  const { department_name } = req.body;
  Department.update({ department_name }, { where: { department_id: id } })
    .then(([updated]) => {
      if (updated) {
        res.status(200).json({ message: "Department updated successfully" });
      } else {
        res.status(404).json({ message: "Department not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating department", error });
    });
}
