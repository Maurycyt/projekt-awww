import bcrypt from "bcrypt";

const initFunc = async (db) => {
  // Synchronizacja
  try {
    await db.sequelize.sync({ force: true });

    // Miasto
    const miasto = await db.Wycieczka.create({
      nazwa: "Miasto",
      opis: "Wycieczka do ciekawego miasta.",
      krotki_opis: "Fajnie jest w mieście",
      obrazek: "/images/trips/miasto.jpg",
      obrazek_tekst: "Zdjęcie miasta",
      cena: 1750.5,
      data_poczatku: new Date("2022-12-12"),
      data_konca: new Date("2023-01-01"),
      liczba_dostepnych_miejsc: 10,
    });

    // Góry
    await db.Wycieczka.create({
      nazwa: "Góry",
      opis: "Wycieczka do ciekawych gór.",
      krotki_opis: "Fajnie jest w górach",
      obrazek: "/images/trips/szczyt.jpg",
      obrazek_tekst: "Zdjęcie szczytu",
      cena: 1350.5,
      data_poczatku: new Date("2024-12-12"),
      data_konca: new Date("2025-01-01"),
      liczba_dostepnych_miejsc: 8,
    });

    // Morza
    await db.Wycieczka.create({
      nazwa: "Morza",
      opis: "Mórz jest wiele, więc i opis może być nieco dłuższy niż poprzednio. Atrakcji też może być więcej.",
      krotki_opis: "Fajnie jest w górach",
      obrazek: "/images/trips/morze.jpg",
      obrazek_tekst: "Zdjęcie morza",
      cena: 17.3,
      data_poczatku: new Date("2021-10-10"),
      data_konca: new Date("2021-11-11"),
      liczba_dostepnych_miejsc: 8,
    });

    const zgloszenie1 = await db.Zgloszenie.create({
      first_name: "Anna",
      last_name: "Kaliska",
      email: "anna.kaliska@wp.pl",
      n_people: 2,
    });

    const zgloszenie2 = await db.Zgloszenie.create({
      first_name: "Mateusz",
      last_name: "Maniowski",
      email: "mateusz.maniowski@wp.pl",
      n_people: 3,
    });

    await miasto.addZgloszenie(zgloszenie1);
    await miasto.addZgloszenie(zgloszenie2);

    // Admin
    await db.Uzytkownik.create({
      first_name: "Maurycy",
      last_name: "Wojda",
      email: "mw429680@students.mimuw.edu.pl",
      password: bcrypt.hashSync("admin", 10),
    });
  } catch (error) {
    console.log("An error occurred during data loading");
    console.log(error);
  }
};

export default initFunc;
