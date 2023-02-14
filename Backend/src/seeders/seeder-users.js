"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //   email: DataTypes.STRING,
    //   password: DataTypes.STRING,
    //   firstName: DataTypes.STRING,
    //   lastName: DataTypes.STRING,
    //   address: DataTypes.STRING,
    //   gender: DataTypes.BOOLEAN,
    //   image: DataTypes.STRING,
    //   roleId: DataTypes.STRING,
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: "123456", // plain text
        firstName: "Thai",
        lastName: "BP",
        address: "Da Nang",
        phonenumber: "0788030997",
        gender: 1,
        image: "hihi",
        roleId: "R1",
        positionId: "Processor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
