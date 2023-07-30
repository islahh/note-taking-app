const auth_messages = require('../../../../config/responses/res_msg_user');
const db = require('../../../models');
const UserNote = db.user_notes
const redisClient = require('../../../../config/databases/redisdb')
const { logger } = require('../../../services/logger')
const NoteTypesFactory = require('../../../factories/noteFactory')
const { note_types } = require('../../../../config/constants')

/* The `createNote` function is an asynchronous function that handles the creation of a new note. It
takes in the `req` (request) and `res` (response) objects as parameters. */
exports.createNote = async (req, res) => {

  try {
    if (req.body.title == null || req.body.title == '') return res.status(400).json(auth_messages.title_is_required)
    if (req.body.content == null || req.body.content == '') return res.status(400).json(auth_messages.content_is_required)
    if (req.body.type == null || req.body.type == '') return res.status(400).json(auth_messages.type_is_required)
    if (req.body.type != note_types.personal && req.body.type != note_types.work) return res.status(400).json(auth_messages.invalid_note_type)

    const noteTypesFactory = new NoteTypesFactory();

    let request_data = {
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.id
    }

    let user_note = await UserNote.findOne({ where: { title: request_data.title, user_id: req.user.id } })
    if (user_note) return res.status(400).json(auth_messages.title_already_taken)
    // Create note based on type
    user_note = await noteTypesFactory[req.body.type](req.body.title, req.body.content, req.user.id);

    // user_note = await UserNote.create(request_data)

    let response = auth_messages.success
    response.data = user_note

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while creating notes:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};

/* The `exports.getNotes` function is an asynchronous function that handles the retrieval of all notes
for a specific user. It uses caching to improve performance. */
exports.getNotes = async (req, res) => {
  let response = auth_messages.success
  try {
    const redisKey = JSON.stringify({
      user_id: req.user.id,
      table: UserNote.getTableName(),
    })
    // Do we have any notes in the cache related to this query
    const cached_notes = await redisClient.get(redisKey);
    // If yes, then respond to the request right away and return
    if (cached_notes) {
      logger.info("====================================")
      logger.info("Serving from cache")
      logger.info("====================================")

      response.data = JSON.parse(cached_notes)
      return res.status(200).json(response)
    }

    // If no, we need to respond to request and update our cache to store the data
    logger.info("====================================")
    logger.info("Serving from DB")
    logger.info("====================================")
    let user_note = await UserNote.findAll({ where: { user_id: req.user.id } })

    await redisClient.set(redisKey, JSON.stringify(user_note), {
      EX: 10 * 60,
      NX: true,
    });

    response.data = user_note

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while listing notes:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};

/* The `exports.getNoteById` function is an asynchronous function that handles the retrieval of a user
single note by its ID. It takes in the `req` (request) and `res` (response) objects as parameters. */
exports.getNoteById = async (req, res) => {

  try {
    let user_note = await UserNote.findOne({ where: { id: req.params.id, user_id: req.user.id } })

    let response = auth_messages.success
    response.data = user_note

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while getting single note:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};

/* The `exports.updateNote` function is an asynchronous function that handles the updating of a note.
It takes in the `req` (request) and `res` (response) objects as parameters. */
exports.updateNote = async (req, res) => {

  try {
    let user_note = await UserNote.findOne({ where: { id: req.params.id, user_id: req.user.id } })
    if (!user_note) return res.status(400).json(auth_messages.note_not_found)

    user_note.title = req.body.title
    user_note.content = req.body.content
    user_note.save()

    let response = auth_messages.success
    response.data = user_note

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while updating note:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};

/* The `exports.deleteNote` function is an asynchronous function that handles the deletion of a note.
It takes in the `req` (request) and `res` (response) objects as parameters. */
exports.deleteNote = async (req, res) => {

  try {
    let user_note = await UserNote.findOne({ where: { id: req.params.id, user_id: req.user.id } })
    if (!user_note) return res.status(400).json(auth_messages.note_not_found)

    user_note = user_note.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    })

    let response = auth_messages.success

    res.status(200).json(response)
  } catch (error) {
    logger.error("Error while deleting a note:", { context: error })
    res.status(500).json(auth_messages.server_error)
  }
};