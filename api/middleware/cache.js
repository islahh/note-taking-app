const redisClient = require('../../config/databases/redisdb')

exports.clearNoteCache = async (req, res, next) => {

  // Force clear cache if any
  const redisKey = JSON.stringify({
    user_id: req.user.id,
    table: 'user_notes',
  })
  redisClient.del(redisKey)

  next()
}