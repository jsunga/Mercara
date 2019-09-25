'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable(
          'product_tags', {
            tag_id: {
              type: Sequelize.UUID,
              foreignKey: true,
              references: {
                model: 'tags',
                key: 'tag_id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
              allowNull: false
            },
            product_id: {
              type: Sequelize.UUID,
              foreignKey: true,
              references: {
                model: 'products',
                key: 'product_id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
              allowNull: false
            }
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('product_tags')
  }
};