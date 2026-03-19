import Branch from "../models/Branch.js";

export function getAllBranches(req, res) {
  Branch.findAll()
    .then((branches) => {
      res.status(200).json(branches);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching branches", error });
    });
}

export function createBranch(req, res) {
  const { branch_name, degree_id } = req.body;
  if (!branch_name || !degree_id) {
    return res
      .status(400)
      .json({ message: "Branch name and degree_id are required" });
  }
  Branch.create({ branch_name, degree_id })
    .then((branch) => {
      res.status(201).json(branch);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating branch", error });
    });
}

export function deleteBranch(req, res) {
  const { id } = req.params;
  Branch.destroy({ where: { branch_id: id } })
    .then((deleted) => {
      if (deleted) {
        res.status(200).json({ message: "Branch deleted successfully" });
      } else {
        res.status(404).json({ message: "Branch not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting branch", error });
    });
}

export function updateBranch(req, res) {
  const { id } = req.params;
  const { branch_name, degree_id } = req.body;
  Branch.update({ branch_name, degree_id }, { where: { branch_id: id } })
    .then(([updated]) => {
      if (updated) {
        Branch.findByPk(id).then((branch) => {
          res
            .status(200)
            .json({ message: "Branch updated successfully", branch });
        });
      } else {
        res.status(404).json({ message: "Branch not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating branch", error });
    });
}
