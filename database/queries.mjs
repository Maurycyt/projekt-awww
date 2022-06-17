import { Op } from "sequelize";

export const get_all_wycieczki = async (db, t = null) =>
  await db.Wycieczka.findAll({
    where: {
      data_poczatku: {
        [Op.gt]: new Date(Date.now()),
      },
    },
    order: ["data_poczatku"],
    transaction: t,
    lock: true,
  });

export const get_wycieczka = async (db, id, t = null) => ({
  wycieczka: await db.Wycieczka.findByPk(id, {
    transaction: t,
    lock: true,
  }),
  zgloszenia: await db.Zgloszenie.findAll({
    where: {
      WycieczkaId: id,
    },
    transaction: t,
    lock: true,
  }),
});
