let elem = document.getElementById('c'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];
let Word = function (text, colour, top, left, width, height, isCorrect = false) {
    this.text = text;
    this.colour = colour;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.opacity = 1;
    this.isCorrect = isCorrect;
    this.drowWord = () => {
        context.clearRect(this.left, this.top - 1, width, height);
        context.fillStyle = this.colour;
        context.fillRect(this.left, this.top, this.width, this.height);
        context.globalAlpha = this.opacity;
        context.font = "15px Arial";
        context.fillStyle = "Black";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText(this.text, this.left, this.top);
    };

    this.animateWord = () => {
        let interval = setInterval(() => {
            this.drowWord();
            ++this.top;
            this.opacity -= 0.01;
        }, 10);
        setTimeout(() => {
            clearInterval(interval);
            elements.forEach(function (element) {
                element.drowWord();
            });
        }, 1000);
    };
};

const drawUntransWord = (word) => {
    // context.fillStyle = "red";
    // context.fillRect(100, 5, 70, 20);
    context.clearRect(205, 5, 70, 20);
    context.font = "15px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(word, 205, 5);
}

const translatedWords = [
    [[new Word("apple", "gold", 30, 20, 60, 15, true), new Word("house", "tan", 30, 90, 60, 15)], "яблуко"],
    [[new Word("garage", "gold", 30, 20, 60, 15), new Word("data", "tan", 30, 90, 60, 15, true)], "дані"],
    [[new Word("milk", "gold", 30, 20, 60, 15), new Word("forest", "tan", 30, 90, 60, 15, true)], "ліс"],
    [[new Word("window", "gold", 30, 20, 60, 15, true), new Word("watermelon", "tan", 30, 90, 60, 15)], "вікно"],
    [[new Word("board", "gold", 30, 20, 60, 15, true), new Word("door", "tan", 30, 90, 60, 15)], "дошка"]
];

let counter = 0;
let corAnsws = 0;
let incorAnsws = 0;
let drawScore = function () {
    context.clearRect(5, 5, 200, 20);
    context.clearRect(285, 5, 200, 20);
    context.font = "15px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(`Правильних відповідей: ${corAnsws}`, 5, 5);
    context.fillText(`Неправильних відповідей: ${incorAnsws}`, 285, 5);
};

drawScore();

const pushWords = (counter) => translatedWords[counter][0].map((word) => elements.push(word));
pushWords(counter);
drawUntransWord(translatedWords[counter][1]);

elem.addEventListener('click', function (event) {
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);
    
    elements.forEach(function (element) {
        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
            if (element.isCorrect) {
                console.log(element.text);
                corAnsws++;
            } else {
                console.log("false");
                incorAnsws++;
            }
            
        }
        element.animateWord();
        drawScore();
    });
    counter++;
    elements = [];
    pushWords(counter);
    drawUntransWord(translatedWords[counter][1]);
}, false);
// Отрисовка всех элементов массива
elements.forEach(function (element) {
    element.drowWord();
});