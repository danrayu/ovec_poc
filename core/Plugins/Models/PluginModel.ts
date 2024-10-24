import { DataTypes, Model } from "sequelize";
import sequelize from "../../DataAccess/database"; // Import your initialized Sequelize instance

// Define the PluginConfig Sequelize model
class PluginModel extends Model {}

PluginModel.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coreVersion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "PluginConfig",
    tableName: "plugin_configs", // optional: specify the table name
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default PluginModel;
