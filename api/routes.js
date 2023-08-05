const express = require('express');
const router = express.Router();
const passport = require('passport');
const { clearNoteCache } = require('./middleware/cache')
const base = "/api/v1";
const { check, param, validationResult, oneOf } = require('express-validator');
// auth actions
const { register, login } = require("./controllers/v1/auth/authController");
// note actions
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require("./controllers/v1/user/noteController");

// Authentication
router.post(`${base}/auth/register`, register);
router.post(`${base}/auth/login`, login);

// Notes
router.post(`${base}/user/notes`, passport.authenticate('jwt', { session: false }), clearNoteCache, createNote);
router.get(`${base}/user/notes`, passport.authenticate('jwt', { session: false }), getNotes);
router.get(`${base}/user/notes/:id`, passport.authenticate('jwt', { session: false }), getNoteById);
router.put(`${base}/user/notes/:id`, passport.authenticate('jwt', { session: false }), clearNoteCache, updateNote);
router.delete(`${base}/user/notes/:id`, passport.authenticate('jwt', { session: false }), clearNoteCache, deleteNote);


router.get(base + '/health', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('Up and running!');
});

module.exports = router;