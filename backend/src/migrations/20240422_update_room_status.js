
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Bước 1: Chuyển đổi cột status thành VARCHAR tạm thời
      await queryInterface.sequelize.query(
        "ALTER TABLE rooms MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'available'"
      );

      // Bước 2: Cập nhật dữ liệu dựa trên số lượng room_assignments
      await queryInterface.sequelize.query(`
        UPDATE rooms r
        LEFT JOIN (
          SELECT roomId, COUNT(*) as current_occupancy
          FROM room_assignments
          WHERE status = 'active'
          GROUP BY roomId
        ) ra ON r.id = ra.roomId
        SET r.status = CASE 
          WHEN r.status = 'occupied' AND (ra.current_occupancy >= r.capacity OR ra.current_occupancy IS NULL) THEN 'Room đầy'
          WHEN r.status = 'occupied' AND ra.current_occupancy < r.capacity THEN 'Đã có Người ở'
          ELSE r.status 
        END
      `);

      // Bước 3: Chuyển đổi lại thành ENUM với các giá trị mới
      await queryInterface.sequelize.query(
        "ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'Đã có Người ở', 'Room đầy', 'maintenance') NOT NULL DEFAULT 'available'"
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
        "ALTER TABLE rooms MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'available'"
      );

      // Bước 2: Cập nhật dữ liệu về trạng thái cũ
      await queryInterface.sequelize.query(
        "UPDATE rooms SET status = 'occupied' WHERE status IN ('Đã có Người ở', 'Room đầy')"
      );

      // Bước 3: Chuyển đổi lại thành ENUM với các giá trị cũ
      await queryInterface.sequelize.query(
        "ALTER TABLE rooms MODIFY COLUMN status ENUM('available', 'occupied', 'maintenance') NOT NULL DEFAULT 'available'"
      );
    } catch (error) {
      console.error('Migration Down Error:', error);
      throw error;
    }
  }
}; 