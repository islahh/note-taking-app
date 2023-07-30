
module.exports = (sequelize, DataTypes) => {

  const UserNotes = sequelize.define('user_notes', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
  });

  UserNotes.belongsTo(sequelize.models.user, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });

  return UserNotes;
};