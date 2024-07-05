function Succes(user) {
    return [
        {id: 1, name: "Ça y est, tu as 10 ans !", cond: user.stats.totalCatch.total >= 1, desc: "Attraper son 1er pokémon"},
        {id: 2, name: "Test", cond: user.stats.totalCatch.total >= 10, desc: "Attraper 10 pokémons"},
        {id: 3, name: "Test 2", cond: user.stats.totalCatch.total >= 100, desc: "Attraper 50 pokémons"}
    ]
}

module.exports = { Succes }