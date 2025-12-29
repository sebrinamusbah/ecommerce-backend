const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Order extends Model {
        static associate(models) {
            // Define associations here
            // Order.belongsTo(models.User, { foreignKey: 'userId' });
            // Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
            // Order.hasOne(models.Payment, { foreignKey: 'orderId' });
        }
    }

    Order.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ),
            defaultValue: "pending",
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.ENUM("credit_card", "paypal", "cash_on_delivery"),
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.ENUM("pending", "paid", "failed"),
            defaultValue: "pending",
        },
        notes: {
            type: DataTypes.TEXT,
        },
    }, {
        sequelize,
        modelName: "Order",
        timestamps: true,
    });

    return Order;
};