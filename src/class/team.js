class Team {
  constructor(number, id) {
    this.number = number;
    this.id = id;
    this.questionseries = this.shuffle([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ]).slice(15);
    this.current = this.questionseries[0];
    this.stage = "Question";
  }
  // update(questionnumber) {
  //   this.current = questionnumber;
  //   this.pastquestion.push(questionnumber);
  // }
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  completequestion() {
    this.stage = "Challenge";
  }
  completechallenge() {
    this.stage = "Question";
    this.current =
      this.questionseries[this.questionseries.indexOf(this.current) + 1];
  }
}

module.exports = Team;
