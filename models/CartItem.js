const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class CartItem extends Model {
        static associate(models) {
            // Define associations here
            // CartItem.belongsTo(models.User, { foreignKey: 'userId' });
            // CartItem.belongsTo(models.Book, { foreignKey: 'bookId' });
        }
    }

    CartItem.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
    }, {
        sequelize,
        modelName: "CartItem",
        tableName: "cart_items", // Optional: explicit table name
        timestamps: true,
        indexes: [{
            unique: true,
            fields: ["userId", "bookId"],
        }, ],
    });

    return CartItem;
};