console.log("EVENT ROUTER FILE LOADED");



const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const admin = require("../middleware/adminmiddleware");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventcontroller");

router.get("/", auth, getEvents);
router.post("/", auth, admin, createEvent);
router.put("/:id", auth, admin, updateEvent);
router.delete("/:id", auth, admin, deleteEvent);

module.exports = router;

