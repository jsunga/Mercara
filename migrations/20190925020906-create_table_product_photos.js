'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'product_photos', {
        product_id: {
          type: Sequelize.UUID,
          foreignKey: true,
          allowNull: false
        },
        photo_url: {
          type: Sequelize.STRING,
          allowNull: false
        }
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product_photos');
  }
};