import TimeSlot from "../models/TimeSlot.js";

export async function getAllTimeSlots(req, res) {
  try {
    const slots = await TimeSlot.findAll({ order: [["slot_id", "ASC"]] });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching time slots", error });
  }
}

export async function getTimeSlotById(req, res) {
  try {
    const slot = await TimeSlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error fetching time slot", error });
  }
}

export async function createTimeSlot(req, res) {
  try {
    const { start_time, end_time } = req.body;
    if (!start_time || !end_time) {
      return res
        .status(400)
        .json({ message: "start_time and end_time are required" });
    }

    const slot = await TimeSlot.create({ start_time, end_time });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating time slot", error });
  }
}

export async function updateTimeSlot(req, res) {
  try {
    const { start_time, end_time } = req.body;
    const slot = await TimeSlot.findByPk(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    await slot.update({
      start_time: start_time ?? slot.start_time,
      end_time: end_time ?? slot.end_time,
    });

    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error updating time slot", error });
  }
}

export async function deleteTimeSlot(req, res) {
  try {
    const deleted = await TimeSlot.destroy({
      where: { slot_id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    res.status(200).json({ message: "Time slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting time slot", error });
  }
}
