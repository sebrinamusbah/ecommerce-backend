const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Book = sequelize.define(
    "Book", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isbn: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        coverImage: {
            type: DataTypes.STRING,
            defaultValue: "default-book-cover.jpg",
        },
        publishedDate: {
            type: DataTypes.DATE,
        },
        pages: {
            type: DataTypes.INTEGER,
        },
        language: {
            type: DataTypes.STRING,
            defaultValue: "English",
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        timestamps: true,
    }
);

module.exports = Book;