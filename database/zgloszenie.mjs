export default (conn, Sequelize, DataTypes) => {
  // odkomentuj i uzupełnij argumenty metody sequelize.define

  const Zgloszenie = conn.define("Zgloszenie", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    n_people: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      defaultValue: 0,
    },
  });

  return Zgloszenie;
};
