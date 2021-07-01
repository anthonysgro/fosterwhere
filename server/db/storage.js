const { Sequelize, DataTypes, Model } = require("sequelize");
const db = require("./db");
const bcrypt = require("bcrypt");

class DistanceMapping extends Model {}

DistanceMapping.init(
    {
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { notEmpty: true },
        },

        distance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: false,
            validate: { notEmpty: true },
        },
    },
    {
        hooks: {},
        timestamps: false,
        sequelize: db,
        modelName: "distanceMappings",
    },
);

DistanceMapping.addHook("beforeCreate", async (distanceMapping) => {
    distanceMapping.key = await bcrypt.hash(distanceMapping.key, 10);
});

// DistanceMapping.findMapping = async (key) => {
//     if (await bcrypt.compare(key, DistanceMapping.key)) {
//         return;
//     }
// };

module.exports = DistanceMapping;
