var database = firebase.database();
var quiz = [{
        "answers": [
            "True",
            "False"
        ],
        "correct": {
            "index": 0
        },
        "number": 1,
        "prompt": "FCode is the best club in FPT University?"
    },
    {
        "answers": [
            "Linux",
            "IOS",
            "Windows Moblie",
            "Android"
        ],
        "correct": {
            "index": 0,
        },
        "number": 2,
        "prompt": "What operating system of Iphone?"
    },
    {
        "answers": [
            "Cài win dạo",
            "IT Help Desk ",
            "Hack Facebook",
            "Fix bug",
            "Mở tiệm Net"
        ],
        "correct": {
            "index": 3,
        },
        "number": 3,
        "prompt": "Theo bạn công việc sau này khi tốt nghiệp ngành Kỹ thuật phần mềm sẽ làm gì?"
    }
];
window.onload = createQuiz();

function createQuiz() {
    var main = document.getElementById("quiz");
    var inner = document.createElement("div");
    inner.className = "carousel-inner";
    for (var i = 0; i < quiz.length; i++) {
        main.appendChild(createSlide(quiz[i]));
    }
}

function createSlide(question) {
    var slide = document.createElement("div");
    slide.className = "item";
    // slide.style.height = "80%";
    // slide.style.width = window.innerWidth + "px";
    var quizTitle = document.createElement("div");
    quizTitle.className = "quiz-question";
    quizTitle.innerHTML = "<h3>Question " + question.number + "/" + quiz.length + "</h3> <br> " + question.prompt;
    slide.appendChild(quizTitle);
    var quizAnw = document.createElement("div");
    quizAnw.className = "quiz-answers";
    for (var i = 0; i < question.answers.length; i++) {
        quizAnw.innerHTML += "<a class='quiz-button btn' style='margin-left: 0px;' href='#slide' data-slide='next' onclick='testQuiz(" + question.number + "," + i +");'>" + question.answers[i] + "</a>";
    }
    slide.appendChild(quizAnw);
    return slide;
}

var grade = 0;

function testQuiz(number, answer) {
    
    var question = quiz[number-1];
    var correct = question.correct.index;
    if (answer === correct) {
        grade = parseInt(grade) + 1;
    }
    if (number == quiz.length) {
        swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            allowOutsideClick: false,
            showCancelButton: false,
            allowEscapeKey: false,
            inputValidator: (value) => {
                return !value && 'You need to write something!';
            },
            progressSteps: ['1', '2']
        }).queue([{
                title: 'Step 1',
                text: 'Mã số sinh viên của bạn?'
            },
            {
                title: "Step 2",
                text: 'Tên của bạn là gì?'
            },
        ]).then((result) => {
            if (result.value) {
                swal({
                    title: 'All done! Your grade is ' + grade + '/' + quiz.length,
                    confirmButtonText: 'Lovely ♥ !'
                });

            }
            firebase.database().ref('quiz/' + result.value[0]).set({
                name: result.value[1],
                grade: grade + '/' + quiz.length
            });
        })
    }
}