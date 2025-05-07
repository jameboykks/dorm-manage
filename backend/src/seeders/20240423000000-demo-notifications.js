'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      {
        userId: 1,
        title: 'Thông báo thanh toán',
        content: 'Bạn đã thanh toán thành công tiền phòng tháng 4/2024',
        type: 'payment',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Thông báo chung',
        content: 'Chào mừng bạn đến với hệ thống quản lý ký túc xá',
        type: 'general',
        isRead: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
}; 