import express from "express";
import {
  createTimeSlot,
  deleteTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
} from "../controller/timeslot.controller.js";

const router = express.Router();

router.get("/", getAllTimeSlots);
router.get("/:id", getTimeSlotById);
router.post("/", createTimeSlot);
router.put("/:id", updateTimeSlot);
router.delete("/:id", deleteTimeSlot);

export default router;
