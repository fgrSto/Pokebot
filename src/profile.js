class Profile {
  constructor(user) {
    this.id = user.user.id;
    this.displayName = user.nickname ? user.nickname : user.user.globalName;
    this.inventory = [];
    this.team = [];
    this.money = 0;
    this.lastCatch = null;
    this.trades = [];
    this.succes = [];
    this.stats = {
      totalCatch: {
        total: 0,
        standard: 0,
        subLeg: 0,
        ultBeast: 0,
        legend: 0,
        myth: 0,
        god: 0,
      },
      totalMoney: 0,
    };
  }
}

module.exports = Profile;
