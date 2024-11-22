const quiz = [
  { ques: "What does the word Angular relate to?", ans: "Angle brackets" },
  { ques: "How is Angular represented?", ans: "NG" },
  { ques: "What is the primary focus of Typescript", ans: "Types" },
  { ques: "What kind of platform is Angular", ans: "JavaScript" },
  {
    ques: "What do you call a language that does not have a defined type",
    ans: "loosly typed",
  },
  { ques: "typeof [1,2,3] will return?", ans: "object" },
  { ques: "The toString method is available in?", ans: "Base Object" },
  { ques: "How is a package.json file is always structured ", ans: "JSON" },
  {
    ques: "What does the npm init command in the JSON language create",
    ans: "package.json",
  },
  {
    ques: "Inside a package.json, you'll almost always find?",
    ans: "project metadata",
  },
];

// this function generates a random integer between a and b, or between 1 and a if only one argument is provided.
function random(a, b = 1) {
  //if only one argument is provided, we need to swap the values of a and b to ensure a is lower bound and b is upper bound
  if (b === 1) {
    [a, b] = [b, a];
  }
  return Math.floor((b - a + 1) * Math.random()) + a;
}

// This is a function to shuffle the elements of an array in-place. It uses the Fisher-Yates shuffle algorithm, which is an efficient and unbiased method for generating a random permutation of a finite sequence.
function shuffle(array) {
  for (let i = array.length; i; i--) {
    let j = random(i) - 1;
    [array[i - 1], array[j]] = [array[j], array[i - 1]];
  }
}

//view object
const view = {
  score: document.querySelector("#score strong"),
  question: document.getElementById("question"),
  result: document.getElementById("result"),
  info: document.getElementById("info"),
  start: document.getElementById("start"),
  response: document.querySelector("#response"),
  timer: document.querySelector("#timer strong"),

  //This function takes an array of values and returns a string of HTML buttons, where each button's text is a value from the array.
  buttons(array) {
    return array.map((value) => `<button>${value}</button>`).join("");
  },

  //render content to the target element
  render(target, content, attributes) {
    for (const key in attributes) {
      target.setAttribute(key, attributes[key]);
    }
    target.innerHTML = content; // target element
  },
  show(element) {
    element.style.display = "block";
  },
  hide(element) {
    element.style.display = "none";
  },
  setup() {
    this.show(this.question);
    this.show(this.response);
    this.show(this.result);
    this.hide(this.start);
    this.render(this.score, game.score);
    this.render(this.result, "");
    this.render(this.info, "");
  },

  teardown() {
    this.hide(this.question);
    this.hide(this.response);
    this.show(this.start);
  },
};

const game = {
  countdown() {
    game.secondsRemaining--;
    view.render(view.timer, game.secondsRemaining);
    if (game.secondsRemaining < 0) {
      game.gameOver();
    }
  },
  start(quiz) {
    console.log("start() invoked");
    this.questions = [...quiz];
    totalQuestions = this.questions.length;
    this.score = 0;
    this.secondsRemaining = 60;
    this.timer = setInterval(this.countdown, 1000); // calls the countdown method every seconds
    view.setup();
    this.ask();
  },
  ask(name) {
    console.log("ask() invoked");
    if (this.questions.length > 2) {
      shuffle(this.questions);
      this.question = this.questions.pop();
      const options = [
        this.questions[0].ans,
        this.questions[1].ans,
        this.question.ans,
      ];
      shuffle(options);
      console.log(options);
      const question = `${this.question.ques}`;
      view.render(view.question, question);
      view.render(view.response, view.buttons(options));
    } else {
      this.gameOver();
    }
  },
  check(e) {
    console.log("check(e) invoked");
    const response = e.target.textContent; //checks the content insde the button
    const answer = this.question.ans;
    if (response === answer) {
      view.render(view.result, "Correct!", { class: "correct" });
      //   alert("Correct!");
      this.score++;
      view.render(view.score, this.score);
    } else {
      view.render(view.result, `Wrong! The correct answer was ${answer}`, {
        class: "wrong",
      });
      alert(`Wrong! The correct answer was ${answer}`);
    }
    this.ask(); // to ask the next question in the list
  },
  gameOver() {
    console.log("gameOver() invoked");
    view.render(
      view.info,
      `Game Over, you scored ${this.score} point${
        this.score !== 1 ? "s" : null
      } out of ${totalQuestions}`
    );
    view.teardown();
    clearInterval(this.timer);
  },
};
view.start.addEventListener("click", () => game.start(quiz), false);
view.response.addEventListener("click", (event) => game.check(event), false);
// view.hide(view.response);
