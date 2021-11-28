$(document).ready(async () => {
    const getAllQuestions = () => {
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            const questionUrl =
                'https://lab5.live/Quiz/API/V1/';

            xhttp.open('GET', questionUrl, true);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(this.statusText);
                    }
                }
            };
        });
    };

    let QList;

    await getAllQuestions().then((value) => {
        QList = value;
    });
    console.log("QList: " + QList);

    let marks = 0;
    let maxQuestions = QList.length;
    let currentQuestionNumber = 0;
    let answer;
    let selected = false;

    const questionOnClick = (event) => {
        // If the clicked element doesn't have the right selector, bail

        if (event.target.classList[0] === 'answerItem') {
            const marksElem = document.getElementById('mark');
            const correctElem = $(`#${answer}`);
            selected = true;

            if (event.target.id != answer) {
                let element = $(event.target);
                element.addClass('wrongContainer');
                marks -= 1;
                marksElem.innerHTML = `${marks}`;
            } else {
                marks += 1;
                marksElem.innerHTML = `${marks}`;
            }

            correctElem.addClass('correctContainer');
            $('#answerListContainer').off(
                'click',
                '.answerItem',
                questionOnClick
            );

            $('#nextButton').removeClass('hideButton');

            // Don't follow the link
            event.preventDefault();
        }
    };

    const renderQuestions = () => {
        const currentQuestion = QList[currentQuestionNumber];
        answer = currentQuestion.answer;

        const answerListContainer = document.getElementById(
            'answerListContainer'
        );
        const question = document.getElementById('question');
        const questionProgrss = document.getElementById('questionProgress');
        questionProgrss.innerHTML = `${
            currentQuestionNumber + 1
        } / ${maxQuestions}`;
        question.innerHTML = currentQuestion.question;

        answerListContainer.innerHTML = `
            <div class='answerItem' id='1'>
                <span> ${currentQuestion.option1} </span>
            </div>
            <div class='answerItem' id='2'>
                <span> ${currentQuestion.option2} </span>
            </div>
            <div class='answerItem' id='3'>
                <span> ${currentQuestion.option3} </span>
            </div>
            <div class='answerItem' id='4'>
                <span> ${currentQuestion.option4} </span>
            </div>
        `;

        $('#nextButton').addClass('hideButton');
        $('#answerListContainer').on('click', '.answerItem', questionOnClick);
    };

    const endGame = () => {
        window.sessionStorage.setItem('userScore', marks);
        window.sessionStorage.setItem('questionCount', maxQuestions);
        location.reload();
    };

    $('#nextButton').click((event) => {
        if (selected) {
            event.preventDefault();
            currentQuestionNumber += 1;
            if (currentQuestionNumber === maxQuestions) {
                endGame();
            }
            selected = false;
            renderQuestions();
        }
    });

    $('#endButton').click((event) => endGame());

    renderQuestions();
});
