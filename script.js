let elem = document.getElementById('canvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];
elem.width = screen.width;
let isGameStarted = false;
let isGameFinished = false;
let pressProhibition = false;
let isSetsShowed = false;

const blocksData = {
    "startGame": [195, 175, 40],
    "startAgain": [245, 235, 40],
    "gameFinish": [195, 235, 40]
}

const drawInfo = (color, text, top, width, height) => {
    context.fillStyle = color;
    context.fillRect((elem.width - width) / 2, top, width, height);
    context.font = "32px Arial";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(text, elem.width / 2, top + 5);
}
let startGameBlock = blocksData.startGame;
drawInfo('lightblue', 'Почати гру', startGameBlock[0], startGameBlock[1], startGameBlock[2]);

let Word = function (text, colour = "lightblue", top, left, width, isCorrect = false) {
    this.text = text;
    this.colour = colour;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = 40;
    this.opacity = 1;
    this.isCorrect = isCorrect;
    this.fallInterval;
    this.drowWord = (multiplier) => {
        context.clearRect(this.left, this.top - multiplier - 1, width, this.height);
        context.fillStyle = this.colour;
        context.fillRect(this.left, this.top, this.width, this.height);
        context.globalAlpha = this.opacity;
        context.font = "15px Arial";
        context.fillStyle = "Black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        console.log(this.width)
        context.fillText(this.text, this.width / 2 + this.left, this.height / 2 + this.top);
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
                isGameFinished = true;
                context.clearRect(500, 15, 600, 32);
                let gameFinishBlock = blocksData.gameFinish;
                drawInfo('lightblue', 'Гра завершена', gameFinishBlock[0], gameFinishBlock[1], gameFinishBlock[2]);
                let startAgainBlock = blocksData.startAgain;
                drawInfo('lightblue', 'Почати заново', startAgainBlock[0], startAgainBlock[1], startAgainBlock[2]);
            }
        }, 30);
    };
};

const drawUntransWord = (word) => {
    context.clearRect(500, 15, 600, 32);
    context.font = "32px Arial";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(word, elem.width / 2, 15);
}

let translatedWords = [];

const wordsSets = {
    "Їжа": [
        [[new Word("apple", undefined, 100, 690, 60, true), new Word("fruit", undefined, 100, 790, 60)], "яблуко"],
        [[new Word("pear", undefined, 100, 690, 60), new Word("cucumber", undefined, 100, 790, 70, true)], "огірок"],
        [[new Word("apple", undefined, 100, 690, 60), new Word("pear", undefined, 100, 790, 60, true)], "груша"],
        [[new Word("cherries", undefined, 100, 690, 60, true), new Word("watermelon", undefined, 100, 790, 80)], "вишня"],
        [[new Word("tomato", undefined, 100, 690, 60), new Word("orange", undefined, 100, 790, 60, true)], "апельсин"]
    ],
    "Природа": [
        [[new Word("tomato", undefined, 100, 690, 60), new Word("field", undefined, 100, 790, 60, true)], "поле"],
        [[new Word("frog", undefined, 100, 690, 60), new Word("forest", undefined, 100, 790, 60, true)], "ліс"],
        [[new Word("lake", undefined, 100, 690, 60, true), new Word("lace", undefined, 100, 790, 60)], "озеро"],
        [[new Word("rat", undefined, 100, 690, 60), new Word("river", undefined, 100, 790, 60, true)], "річка"],
        [[new Word("mountain", undefined, 100, 690, 60, true), new Word("watermelon", undefined, 100, 790, 80)], "гора"]
    ],
    "IT": [
        [[new Word("web itelligence", undefined, 100, 650, 100), new Word("web development", undefined, 100, 800, 120, true)], "веб-розробка"],
        [[new Word("artificial intelligence", undefined, 100, 630, 150, true), new Word("artist", undefined, 100, 810, 60)], "штучний інтелект"],
        [[new Word("security key", undefined, 100, 650, 100), new Word("network security", undefined, 100, 810, 120, true)], "мережева безпека"],
        [[new Word("cybertrack", undefined, 100, 690, 90), new Word("cybersecurity", undefined, 100, 790, 120, true)], "кібербезпека"],
        [[new Word("software", undefined, 100, 690, 80, true), new Word("sofa", undefined, 100, 790, 60)], "програмне забезпечення"]
    ]
}

const setsData = {
    "Їжа": [420.5, 195],
    "Природа": [420.5, 245],
    "IT": [420.5, 295]
};

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

const drawSets = () => {
    context.font = "32px Arial";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "top";
    context.fillText(`Оберіть набір слів`, elem.width / 2, 120);
    let topOffset = 0;
    for (const key in wordsSets) {
        drawInfo('lightblue', key, 195 + topOffset, 175, 40);
        topOffset += 50;
    }
}


elem.addEventListener('click', function (event) {
    let isAnswChoosed = false;
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    if (!isGameStarted) {
        if (!isSetsShowed) {
            let centerX = (elem.width - startGameBlock[1]) / 2;
            if (y > startGameBlock[0] && y < startGameBlock[0] + startGameBlock[2] && x > centerX && x < centerX + startGameBlock[1]) {
                drawSets();
                isSetsShowed = true;
            }
        } else {
            context.clearRect(600, 120, 375, 40);
            for (const key in setsData) {
                if (y > setsData[key][1] && y < setsData[key][1] + 50 && x > 420.5 && x < 870) {
                    translatedWords = wordsSets[key];
                    break;
                }
            }
            pushWords(counter);
            for (const key in setsData) {
                context.clearRect(680.5, setsData[key][1], 175, 40);
            }
            isGameStarted = true;
            drawScore();
            elements.forEach(function (element) {
                element.animateWord();
            });
            drawUntransWord(translatedWords[counter][1]);
        }
    } else if (isGameFinished) {
        if (y > 245 && y < 295 && x > 420.5 && x < 870) {
            location.reload();
        }
    }
    else {
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
                        context.clearRect(500, 15, 600, 32);
                        let gameFinishBlock = blocksData.gameFinish;
                        drawInfo('lightblue', 'Гра завершена', gameFinishBlock[0], gameFinishBlock[1], gameFinishBlock[2]);
                        let startAgainBlock = blocksData.startAgain;
                        drawInfo('lightblue', 'Почати заново', startAgainBlock[0], startAgainBlock[1], startAgainBlock[2]);
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