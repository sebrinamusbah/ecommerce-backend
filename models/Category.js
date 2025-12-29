const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Category extends Model {
        static associate(models) {
            // Define associations here
            // Category.hasMany(models.Book, { foreignKey: 'categoryId' });
        }
    }

    Category.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
    }, {
        sequelize,
        modelName: "Category",
        timestamps: true,
    });

    return Category;
};