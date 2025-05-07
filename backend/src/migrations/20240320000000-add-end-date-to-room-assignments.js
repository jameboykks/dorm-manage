
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('room_assignments', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'startDate'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('room_assignments', 'endDate');
  }
}; 