const { sequelize } = require("../config/db");
const fs = require("fs");
const path = require("path");
const { DataTypes } = require("sequelize");
const basename = path.basename(__filename);

const db = {};

// Load all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelFunction = require(path.join(__dirname, file));
    const model = modelFunction(sequelize, DataTypes);
    db[model.name] = model;
  });

// Run associate methods if they exist
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

// Export the db object
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

module.exports = db;
