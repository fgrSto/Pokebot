function Bagdes(user) {
    return [
        {id: 1, fixe: false, name: `Badge du Collectionneur`, icon: `<:Badge_du_Collectionneur:1265664935120339025>`, cond: "catch", desc: `Avoir attrapé le plus de pokémons`},
        {id: 2, fixe: false, name: `Badge de la Richesse`, icon: `<:Badge_de_la_Richesse:1265664708220813322>`, cond: "money", desc: `Avoir le plus d'argent`},
        {id: 3, fixe: true, name: `Badge des Dieux`, icon: `<:Badge_des_Dieux:1265664859966804044>`, cond: user.succes.includes(80), desc: `Avoir le succès "Maître des Dieux"`}
    ]
}

module.exports = { Bagdes }