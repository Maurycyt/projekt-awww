export default (sequelize, Sequelize, DataTypes) => {
  // odkomentuj i uzupełnij argumenty metody sequelize.define

  const Zgloszenie = sequelize.define("Zgloszenie", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imie: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20],
        isAlpha: true,
      },
    },
    nazwisko: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20],
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
    liczba_miejsc: {
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
