import Department from "../models/Department.js";

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
