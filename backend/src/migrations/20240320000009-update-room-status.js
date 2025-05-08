'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('rooms', 'status', {
      type: Sequelize.ENUM('available', 'Đã có Người ở', 'Room đầy', 'maintenance'),
      allowNull: false,
      defaultValue: 'available'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('rooms', 'status', {
      type: Sequelize.ENUM('available', 'occupied', 'full', 'maintenance'),
      allowNull: false,
      defaultValue: 'available'
    });
  }
}; 