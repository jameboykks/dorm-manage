'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'year', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'year');
  }
}; 