let elem = document.getElementById('canvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];
elem.width = screen.width;
let isGameStarted = false;
let isGameFinished = false;
let pressProhibition = false;

const drawInfo = (color, text, width, height) => {
    let centerX = elem.width / 2 - width / 2;
    context.fillStyle = color;
    context.fillRect(centerX, 195, width, height);
    context.font = "32px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(text, centerX + 5, 200);
}
drawInfo('lightblue', 'Почати гру', 175, 40);

let Word = function (text, colour = "lightblue", top, left, width, height, isCorrect = false) {
    this.text = text;
    this.colour = colour;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.opacity = 1;
    this.isCorrect = isCorrect;
    this.fallInterval;
    this.drowWord = (multiplier) => {
        context.clearRect(this.left, this.top - multiplier - 1, width, height);
        context.fillStyle = this.colour;
        context.fillRect(this.left, this.top, this.width, this.height);
        context.globalAlpha = this.opacity;
        context.font = "15px Arial";
        context.fillStyle = "Black";
        context.textAlign = "left";
        context.textBaseline = "top";
        context.fillText(this.text, this.left, this.top);
    };

    this.clearFallInterval = () => {
        clearInterval(this.fallInterval);
    }

    this.animateWord = (multiplier = 1) => {
        this.fallInterval = setInterval(() => {
            if (this.top <= 500) {
                this.drowWord(multiplier);
                this.top += multiplier;
            } else {
                this.clearFallInterval();
                elements.forEach(function (element) {
                    context.clearRect(element.left, element.top - multiplier, element.width, element.height + multiplier);
                });
                drawInfo('lightblue', 'Гра завершена', 235, 40);
            }
        }, 30);
    };
};

const drawUntransWord = (word) => {
    context.clearRect(720, 15, 100, 32);
    context.font = "32px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(word, 720, 15);
}

const translatedWords = [
    [[new Word("apple", undefined, 100, 690, 60, 15, true), new Word("house", undefined, 100, 790, 60, 15)], "яблуко"],
    [[new Word("garage", undefined, 100, 690, 60, 15), new Word("data", undefined, 100, 790, 60, 15, true)], "дані"],
    [[new Word("milk", undefined, 100, 690, 60, 15), new Word("forest", undefined, 100, 790, 60, 15, true)], "ліс"],
    [[new Word("window", undefined, 100, 690, 60, 15, true), new Word("watermelon", undefined, 100, 790, 80, 15)], "вікно"],
    [[new Word("board", undefined, 100, 690, 60, 15, true), new Word("door", undefined, 100, 790, 60, 15)], "дошка"]
];

let counter = 0;
let corAnsws = 0;
let incorAnsws = 0;
let drawScore = function () {
    context.clearRect(5, 5, 200, 20);
    context.clearRect(5, 30, 200, 20);
    context.font = "15px Arial";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(`Правильних відповідей: ${corAnsws}`, 5, 5);
    context.fillText(`Неправильних відповідей: ${incorAnsws}`, 5, 30);
};

const pushWords = (counter) => translatedWords[counter][0].map((word) => elements.push(word));
pushWords(counter);


elem.addEventListener('click', function (event) {
    let isAnswChoosed = false;
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    if (!isGameStarted) {
        if (y > 195 && y < 235 && x > 420.5 && x < 870) {
            context.clearRect(680.5, 195, 175, 40);
            isGameStarted = true;
            drawScore();
            elements.forEach(function (element) {
                element.animateWord();
            });
            drawUntransWord(translatedWords[counter][1]);
        }
    } else {
        if (pressProhibition === false) {
            elements.forEach(function (element) {
                if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                    pressProhibition = true;
                    if (element.isCorrect) {
                        corAnsws++;
                        element.colour = 'lightgreen';
                    } else {
                        incorAnsws++;
                        element.colour = 'red';
                    }
                    isAnswChoosed = true;

                    elements.forEach(function (element) {
                        element.clearFallInterval();
                        element.drowWord(counter);
                        if (translatedWords.length - 1 === counter) {
                            isGameFinished = true;
                        }
                    });
                    drawScore();
                }
            });
            if (isAnswChoosed) {
                counter++;
                setTimeout(() => {
                    if (isGameFinished) {
                        elements.forEach(function (element) {
                            context.clearRect(element.left, element.top, element.width, element.height);
                        });
                        drawInfo('lightblue', 'Гра завершена', 235, 40);
                    } else {
                        drawUntransWord(translatedWords[counter][1]);
                        elements.forEach(function (element) {
                            context.clearRect(element.left, element.top, element.width, element.height);
                        });
                        elements = [];
                        pushWords(counter);
                        elements.forEach(function (element) {
                            element.animateWord(counter + 1);
                        });
                        pressProhibition = false;
                    }
                }, 1000);
            }
        }
    }
}, false);