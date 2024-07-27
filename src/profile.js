class Profile {
  constructor(user) {
    this.id = user.user.id;
    this.displayName = user.nickname ? user.nickname : user.user.globalName;
    this.avatar = user.user.avatar
    this.inventory = [];
    this.team = [];
    this.badges = [];
    this.money = 0;
    this.lastCatch = null;
    this.trades = [];
    this.succes = [];
    this.stats = {
      totalCatch: {
        total: 0,
        standard: 0,
        ultBeast: 0,
        legend: 0,
        fab: 0,
        god: 0,
      },
      totalMoney: 0,
    };
    this.type = {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 0,
      Ghost: 0,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 0,
      Water: 0,
    };
  }
}

module.exports = Profile;
