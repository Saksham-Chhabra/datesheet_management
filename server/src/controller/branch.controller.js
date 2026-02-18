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
  const { branch_name } = req.body;
  if (!branch_name) {
    return res.status(400).json({ message: "Branch name is required" });
  }
  Branch.create({ branch_name })
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
  const { branch_name } = req.body;
  Branch.update({ branch_name }, { where: { branch_id: id } })
    .then(([updated]) => {
      if (updated) {
        res.status(200).json({ message: "Branch updated successfully" });
      } else {
        res.status(404).json({ message: "Branch not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating branch", error });
    });
}
