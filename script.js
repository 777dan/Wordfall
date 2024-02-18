let elem = document.getElementById('c'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];
let Word = function (text, colour, top, left, width, height) {
    this.text = text;
    this.colour = colour;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.opacity = 1;
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

const words = [
    [new Word("apple", "gold", 30, 20, 60, 15), new Word("house", "tan", 30, 90, 60, 15)],
    [new Word("garage", "gold", 30, 20, 60, 15), new Word("data", "tan", 30, 90, 60, 15)],
    [new Word("milk", "gold", 30, 20, 60, 15), new Word("forest", "tan", 30, 90, 60, 15)]
];
// let word = new Word("apple", "gold", 30, 20, 60, 15);
// let word1 = new Word("house", "tan", 30, 90, 60, 15);
let counter = 0;
const pushWords = (counter) => words[counter].map((word) => elements.push(word));
pushWords(counter);
// elements.push(word); // лучше заносить слова в цикле
// elements.push(word1);
// Слушатель события 'click'
elem.addEventListener('click', function (event) {
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);

    elements.forEach(function (element) {
        // if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
        //     alert(element.text);
        // }
        element.animateWord();
    });
    counter++;
    elements = [];
    pushWords(counter);
}, false);
// Отрисовка всех элементов массива
elements.forEach(function (element) {
    element.drowWord();
});
// Выводим счет игры в левом верхнем углу 
let drawScore = function () {
    context.font = "15px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Вы угадали:", 5, 5);
    context.fillText("Вы не угадали:", 185, 5);
};
drawScore();