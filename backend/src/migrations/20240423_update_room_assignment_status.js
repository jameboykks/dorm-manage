
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Bước 1: Chuyển đổi cột status thành VARCHAR tạm thời
      await queryInterface.sequelize.query(
        "ALTER TABLE room_assignments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'"
      );

      // Bước 2: Chuyển đổi lại thành ENUM với các giá trị mới
      await queryInterface.sequelize.query(
        "ALTER TABLE room_assignments MODIFY COLUMN status ENUM('pending', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'"
      );
    } catch (error) {
      console.error('Migration Up Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Bước 1: Chuyển đổi cột status thành VARCHAR tạm thời
      await queryInterface.sequelize.query(
        "ALTER TABLE room_assignments MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active'"
      );

      // Bước 2: Chuyển đổi lại thành ENUM với các giá trị cũ
      await queryInterface.sequelize.query(
        "ALTER TABLE room_assignments MODIFY COLUMN status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active'"
      );
    } catch (error) {
      console.error('Migration Down Error:', error);
      throw error;
    }
  }
}; 