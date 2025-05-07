
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('notifications', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'general'
    });

    // Make userId nullable
    await queryInterface.changeColumn('notifications', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'type');
    
    // Revert userId to not nullable
    await queryInterface.changeColumn('notifications', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });
  },
}; 