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
            "index": 1,
        },
        "number": 2,
        "prompt": "What operating system of Iphone?"
    },
    {
        "answers": [
            "Absolutely Yesss",
            "Yes but another option",
        ],
        "correct": {
            "index": 0,
        },
        "number": 3,
        "prompt": "HungPT will passed PRJ321 by ThanhPC?"
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
        "number": 4,
        "prompt": "Theo bạn công việc sau này khi tốt nghiệp ngành Kỹ thuật phần mềm sẽ làm gì?"
    }
];

// window.onload = createQuiz();

function createQuiz() {
    var main = document.getElementById("quiz");
    var inner = document.createElement("div");
    inner.className = "carousel-inner";
    for (var i = 0; i < quiz.length; i++) {
        if (i == quiz.length - 1) {
            main.appendChild(createFinalSlide(quiz[i]));
        } else {
            main.appendChild(createSlide(quiz[i]));
        }
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
        quizAnw.innerHTML += "<a class='quiz-button btn' style='margin-left: 0px;' href='#slide' data-slide='next' onclick='testQuiz(" + question.number + "," + i + ");'>" + question.answers[i] + "</a>";
    }
    slide.appendChild(quizAnw);
    return slide;
}

function createFinalSlide(question) {
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
        quizAnw.innerHTML += "<a class='quiz-button btn' style='margin-left: 0px;' onclick='testQuiz(" + question.number + "," + i + ");'>" + question.answers[i] + "</a>";
    }
    slide.appendChild(quizAnw);
    return slide;
}
var grade = 0;
var idStudent, nameStudent;

function requireID() {
    swal.mixin({
        type: 'success',
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
        var databaseQuiz = database.ref("quiz");
        databaseQuiz.once("value", function (snapshot) {
            var checkId = false;
            var status = false;
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.id === result.value[0]) {
                    checkId = true;
                    status = childData.status;
                    idStudent = childData.id;
                }
            });
            if (checkId) {
                if (status) {
                    swal({
                        type: 'error',
                        title: "This ID has already been used",
                        confirmButtonText: 'Try again',
                        text: 'You can only take a quiz once'
                    });
                    document.getElementById("btnPrev").click();
                } else {
                    swal({
                        type: 'success',
                        title: "Let\'s start",
                        text: "WARNING: Each ID only take a quiz once. Good luck!",
                        confirmButtonText: 'Go ♥ !'
                    });
                    nameStudent = result.value[1];
                }
            } else if (result.value[0] == "FCodeAIO") {
                idStudent = result.value[0];
                nameStudent = result.value[1];
            } else if (checkId == false) {
                swal({
                    type: 'error',
                    title: "Invalid ID",
                    confirmButtonText: 'Try again',
                    text: 'Please use your ID (SE140XXX)'
                });
                document.getElementById("btnPrev").click();
            }
        });
    });
}

function testQuiz(number, answer) {
    var question = quiz[number - 1];
    var correct = question.correct.index;
    if (answer === correct) {
        grade = parseInt(grade) + 1;
    }
    var totalQuiz = quiz.length;
    if (number == totalQuiz) {
        if (idStudent == "FCodeAIO") {
            swal({
                type: 'success',
                title: 'All done! Your grade is ' + grade + '/' + totalQuiz,
                confirmButtonText: 'Lovely ♥ !',
            });
            database.ref().child('anonymous').push();
            database.ref('anonymous/' + nameStudent.split("/")[0]).set({
                id: nameStudent.split("/")[0],
                name: nameStudent.split("/")[1],
                grade: grade + '/' + totalQuiz,
                time: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
            });
            document.getElementById("btnNext").click();
        } else {
            swal({
                type: 'success',
                title: 'All done! Your grade is ' + grade + '/' + totalQuiz,
                confirmButtonText: 'Lovely ♥ !',
            })
            var updateData = {
                id: idStudent,
                name: nameStudent,
                status: true,
                grade: grade + '/' + totalQuiz,
                time: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
            }
            document.getElementById("btnNext").click();
            updateInfo(idStudent, updateData);
        }
        grade = 0;
    }
}

function updateInfo(idStudent, updateData) {
    database.ref('quiz/' + idStudent).set({
        id: updateData.id,
        name: updateData.name,
        grade: updateData.grade,
        time: updateData.time,
        status: updateData.status
    });
}

