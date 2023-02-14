"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // email: DataTypes.STRING,
        //   password: DataTypes.STRING,
        //   firstName: DataTypes.STRING,
        //   lastName: DataTypes.STRING,
        //   address: DataTypes.STRING,
        //   phonenumber: DataTypes.STRING,
        //   gender: DataTypes.BOOLEAN,
        //   image: DataTypes.STRING,
        //   roleId: DataTypes.STRING,
        //   positionId: DataTypes.STRING,
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            birthday: {
                type: Sequelize.STRING,
            },
            phonenumber: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            roleId: {
                type: Sequelize.STRING,
            },
            positionId: {
                type: Sequelize.STRING,
            },
            token: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Users");
    },
};
