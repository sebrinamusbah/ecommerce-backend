const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class OrderItem extends Model {
        static associate(models) {
            // Define associations here
            // OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
            // OrderItem.belongsTo(models.Book, { foreignKey: 'bookId' });
        }
    }

    OrderItem.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items", // Optional: explicit table name
        timestamps: true,
    });

    return OrderItem;
};