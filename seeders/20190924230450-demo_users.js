'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      firstname: 'jawyn',
      lastname: 'sunga',
      email: 'jsunga@mail.com',
      password: '$2a$08$I4j3uVU94ve9ZtgnObFkAui9dihuSds4DxGIrT80AuqrMCtFt/k.6',
      user_id: '1960da83-5253-4219-9d3a-95f611a19f54',
      is_admin: false
    }, ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};