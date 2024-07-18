const { GetData } = require("./controller/controllerData");

function Bagdes(user) {
  let listeProfiles = GetData("data");

    return [
        {id: 1, fixe: false, name: `Badge du Collectionneur`, icon: `🎒`, cond: "catch", desc: `Avoir attrapé le plus de pokémons`},
        {id: 2, fixe: false, name: `Badge de la Richesse`, icon: `💰`, cond: "money", desc: `Avoir le plus d'argent`},
        {id: 3, fixe: true, name: `Badge des Dieux`, icon: `☀️`, cond: user.succes.includes(80), desc: `Avoir le succès "Maître des Dieux"`}
    ]
}

module.exports = { Bagdes }