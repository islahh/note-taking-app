const db = require('../models');
const UserNote = db.user_notes
const { note_types } = require('../../config/constants')

/* The code is defining a class called `NoteTypesFactory` that has two async methods: `personal` and
`work`. */

class NoteTypesFactory {
  async personal(title, content, user_id) {
    return await UserNote.create({ title, content, type: 'personal', user_id });
  }

  async work(title, content, user_id) {
    return await UserNote.create({ title, content, type: 'work', user_id }).then((user_note) => {

      return user_note
    })
  }
}

module.exports = NoteTypesFactory