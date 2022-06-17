export default (conn, Sequelize, DataTypes) => {
  // odkomentuj i uzupełnij argumenty metody sequelize.define

  const Wycieczka = conn.define(
    "Wycieczka",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nazwa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 20],
        },
      },
      opis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 100],
        },
      },
      krotki_opis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 100],
        },
      },
      obrazek: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      obrazek_tekst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cena: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      data_poczatku: {
        type: Sequelize.DATEONLY,
        validate: {
          isDate: true,
        },
      },
      data_konca: {
        type: Sequelize.DATEONLY,
        validate: {
          isDate: true,
        },
      },
      liczba_dostepnych_miejsc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      validate: {
        zgodnosc_dat() {
          if (new Date(this.data_konca) < new Date(this.data_poczatku)) {
            throw new Error(
              `Data Początku musi być przed datą końca.${this.data_konca} ${this.data_poczatku}`
            );
          }
        },
      },
    }
  );
  return Wycieczka;
};
