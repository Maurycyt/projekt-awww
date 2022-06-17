export const init_func = async (db) => {
     // Synchronizacja
    try {
    await db.sequelize.sync({force:true});
    const miasto = await db.Wycieczka.create({ nazwa: "Miasto",
        opis: "Wycieczka do ciekawego miasta.",
        krotki_opis: "Fajnie jest w mieście",
        obrazek: "/images/trips/miasto.jpg",
        obrazek_tekst: "Zdjęcie miasta",
        cena: 1750.50,
        data_poczatku: new Date('2022-12-12'),
        data_konca: new Date('2023-01-01'),
        liczba_dostepnych_miejsc: 10
    })

    const gory = await db.Wycieczka.create({ nazwa: "Góry",
        opis: "Wycieczka do ciekawych gór.",
        krotki_opis: "Fajnie jest w górach",
        obrazek: "/images/trips/szczyt.jpg",
        obrazek_tekst: "Zdjęcie szczytu",
        cena: 1350.50,
        data_poczatku: new Date('2024-12-12'),
        data_konca: new Date('2025-01-01'),
        liczba_dostepnych_miejsc: 8
    })

    const morza = await db.Wycieczka.create({ nazwa: "Morza",
        opis: "Mórz jest wiele, więc i opis może być nieco dłuższy niż poprzednio. Atrakcji też może być więcej.",
        krotki_opis: "Fajnie jest w górach",
        obrazek: "/images/trips/morze.jpg",
        obrazek_tekst: "Zdjęcie morza",
        cena: 17.30,
        data_poczatku: new Date('2021-10-10'),
        data_konca: new Date('2021-11-11'),
        liczba_dostepnych_miejsc: 8
    })

    const zgloszenie1 = await db.Zgloszenie.create({
        imie: "Anna",
        nazwisko: "Kaliska",
        email: "anna.kaliska@wp.pl",
        liczba_miejsc: 2
    })

    const zgloszenie2 = await db.Zgloszenie.create({
        imie: "Mateusz",
        nazwisko: "Maniowski",
        email: "mateusz.maniowski@wp.pl",
        liczba_miejsc: 3
    })

    await miasto.addZgloszenie(zgloszenie1);
    await miasto.addZgloszenie(zgloszenie2);

    }
    catch (error) {
        console.log('An error occurred during data loading');
        console.log(error);
    }
};



