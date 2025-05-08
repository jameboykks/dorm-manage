'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('room_assignments', 'status', {
      type: Sequelize.ENUM('pending', 'active', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('room_assignments', 'status', {
      type: Sequelize.ENUM('pending', 'active', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    });
  }
}; 