function Bagdes(user) {
    return [
        {id: 1, fixe: false, name: `Badge du Collectionneur`, icon: `<:badge_du_collectionneur:1263532009356005418>`, cond: "catch", desc: `Avoir attrapé le plus de pokémons`},
        {id: 2, fixe: false, name: `Badge de la Richesse`, icon: `<:badge_de_la_richesse:1263532055204204634>`, cond: "money", desc: `Avoir le plus d'argent`},
        {id: 3, fixe: true, name: `Badge des Dieux`, icon: `<:badge_des_dieux:1263532027961933955>`, cond: user.succes.includes(80), desc: `Avoir le succès "Maître des Dieux"`}
    ]
}

module.exports = { Bagdes }