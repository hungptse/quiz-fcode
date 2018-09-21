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
            } else if (result.value[0] == "FcodeAnonymous") {
                idStudent = "FcodeAnonymous";
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
        if (idStudent == "FcodeAnonymous") {
            swal({
                type: 'success',
                title: 'All done! Your grade is ' + grade + '/' + totalQuiz,
                confirmButtonText: 'Lovely ♥ !',
            }).then(() => {
                database.ref().child('anonymous').push();
                database.ref('anonymous/' + nameStudent.split("/")[0]).set({
                    id: nameStudent.split("/")[0],
                    name: nameStudent.split("/")[1],
                    grade: grade + '/' + totalQuiz,
                    time: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
                });
                document.getElementById("btnNext").click();
                
            });
        } else{
            swal({
                type: 'success',
                title: 'All done! Your grade is ' + grade + '/' + totalQuiz,
                confirmButtonText: 'Lovely ♥ !',
            }).then(() => {
                var updateData = {
                    id: idStudent,
                    name: nameStudent,
                    status: true,
                    grade: grade + '/' + totalQuiz,
                    time: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
                }
                document.getElementById("btnNext").click();
                updateInfo(idStudent, updateData);
            });
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

var idStudentDB = ['SE140001', 'SE140002', 'SE140003', 'SE140005', 'SE140007', 'SE140008', 'SE140009', 'SE140010', 'SE140011', 'SE140012', 'SE140013', 'SE140014', 'SE140015', 'SE140016', 'SE140017', 'SE140018', 'SE140019', 'SE140020', 'SE140021', 'SE140022', 'SE140023', 'SE140024', 'SE140025', 'SE140026', 'SE140027', 'SE140028', 'SE140029', 'SE140030', 'SE140031', 'SE140032', 'SE140033', 'SE140034', 'SE140728', 'SE140036', 'SE140037', 'SE140038', 'SE140039', 'SE140040', 'SE140041', 'SE140424', 'SE140042', 'SE140043', 'SE140044', 'SE140045', 'SE140046', 'SE140748', 'SE140048', 'SE140049', 'SE140050', 'SE140051', 'SE140052', 'SE140053', 'SE140054', 'SE140055', 'SE140056', 'SE140057', 'SE140058', 'SE140059', 'SE140060', 'SE140061', 'SE140062', 'SE140063', 'SE140064', 'SE140065', 'SE140066', 'SE140067', 'SE140068', 'SE140069', 'SE140070', 'SE140071', 'SE140072', 'SE140073', 'SE140074', 'SE140075', 'SE140076', 'SE140077', 'SE140078', 'SE140079', 'SE140080', 'SE140081', 'SE140082', 'SE140083', 'SE140084', 'SE140085', 'SE140086', 'SE140087', 'SE140088', 'SE140089', 'SE140091', 'SE140092', 'SE140093', 'SE140094', 'SE140095', 'SE140096', 'SE140090', 'SE140097', 'SE140098', 'SE140099', 'SE140100', 'SE140101', 'SE140612', 'SE140102', 'SE140760', 'SE140104', 'SE140105', 'SE140106', 'SE140107', 'SE140108', 'SE140109', 'SE140110', 'SE140111', 'SE140112', 'SE140113', 'SE140114', 'SE140115', 'SE140116', 'SE140117', 'SE140118', 'SE140119', 'SE140120', 'SE140121', 'SE140750', 'SE140123', 'SE140735', 'SE140125', 'SE140126', 'SE140127', 'SE140128', 'SE140129', 'SE140130', 'SE140131', 'SE140132', 'SE140133', 'SE140135', 'SE140136', 'SE140137', 'SE140138', 'SE140139', 'SE140140', 'SE140141', 'SE140142', 'SE140143', 'SE140144', 'SE140145', 'SE140146', 'SE140147', 'SE140148', 'SE140150', 'SE140151', 'SE140152', 'SE140153', 'SE140154', 'SE140155', 'SE140156', 'SE140157', 'SE140158', 'SE140159', 'SE140160', 'SE140161', 'SE140162', 'SE140163', 'SE140164', 'SE140165', 'SE140166', 'SE140167', 'SE140168', 'SE140169', 'SE140170', 'SE140171', 'SE140172', 'SE140173', 'SE140174', 'SE140175', 'SE140176', 'SE140177', 'SE140178', 'SE140179', 'SE140180', 'SE140181', 'SE140737', 'SE140182', 'SE140183', 'SE140184', 'SE140185', 'SE140186', 'SE140187', 'SE140188', 'SE140190', 'SE140191', 'SE140192', 'SE140193', 'SE140194', 'SE140195', 'SE140196', 'SE140197', 'SE140198', 'SE140199', 'SE140200', 'SE140201', 'SE140202', 'SE140203', 'SE140204', 'SE140205', 'SE140206', 'SE140207', 'SE140208', 'SE140209', 'SE140210', 'SE140211', 'SE140212', 'SE140213', 'SE140214', 'SE140215', 'SE140216', 'SE140217', 'SE140218', 'SE140219', 'SE140220', 'SE140221', 'SE140222', 'SE140223', 'SE140224', 'SE140759', 'SE140226', 'SE140751', 'SE140227', 'SE140228', 'SE140229', 'SE140230', 'SE140761', 'SE140233', 'SE140234', 'SE140235', 'SE140236', 'SE140237', 'SE140238', 'SE140762', 'SE140240', 'SE140242', 'SE140243', 'SE140244', 'SE140245', 'SE140246', 'SE140713', 'SE140247', 'SE140248', 'SE140249', 'SE140250', 'SE140251', 'SE140252', 'SE140253', 'SE140254', 'SE140255', 'SE140256', 'SE140257', 'SE140258', 'SE140259', 'SE140260', 'SE140261', 'SE140262', 'SE140263', 'SE140264', 'SE140266', 'SE140267', 'SE140268', 'SE140269', 'SE140270', 'SE140271', 'SE140272', 'SE140273', 'SE140274', 'SE140275', 'SE140276', 'SE140277', 'SE140278', 'SE140736', 'SE140279', 'SE140280', 'SE140281', 'SE140282', 'SE140283', 'SE140284', 'SE140285', 'SE140286', 'SE140287', 'SE140288', 'SE140289', 'SE140290', 'SE140291', 'SE140292', 'SE140293', 'SE140294', 'SE140296', 'SE140297', 'SE140298', 'SE140299', 'SE140300', 'SE140301', 'SE140302', 'SE140303', 'SE140304', 'SE140305', 'SE140306', 'SE140749', 'SE140308', 'SE140309', 'SE140310', 'SE140311', 'SE140312', 'SE140313', 'SE140314', 'SE140315', 'SE140316', 'SE140317', 'SE140318', 'SE140319', 'SE140320', 'SE140321', 'SE140323', 'SE140324', 'SE140325', 'SE140326', 'SE140634', 'SE140328', 'SE140329', 'SE140330', 'SE140331', 'SE140332', 'SE140333', 'SE140334', 'SE140335', 'SE140766', 'SE140337', 'SE140338', 'SE140339', 'SE140340', 'SE140341', 'SE140342', 'SE140343', 'SE140344', 'SE140345', 'SE140346', 'SE140348', 'SE140349', 'SE140350', 'SE140351', 'SE140352', 'SE140353', 'SE140354', 'SE140355', 'SE140356', 'SE140357', 'SE140358', 'SE140360', 'SE140361', 'SE140362', 'SE140566', 'SE140363', 'SE140364', 'SE140365', 'SE140367', 'SE140711', 'SE140368', 'SE140369', 'SE140370', 'SE140371', 'SE140372', 'SE140373', 'SE140374', 'SE140375', 'SE140376', 'SE140377', 'SE140378', 'SE140379', 'SE140380', 'SE140381', 'SE140382', 'SE140383', 'SE140384', 'SE140385', 'SE140386', 'SE140387', 'SE140388', 'SE140389', 'SE140390', 'SE140391', 'SE140392', 'SE140393', 'SE140394', 'SE140714', 'SE140396', 'SE140397', 'SE140398', 'SE140399', 'SE140400', 'SE140401', 'SE140402', 'SE140403', 'SE140404', 'SE140405', 'SE140406', 'SE140407', 'SE140408', 'SE140409', 'SE140410', 'SE140411', 'SE140412', 'SE140413', 'SE140414', 'SE140415', 'SE140416', 'SE140417', 'SE140655', 'SE140418', 'SE140419', 'SE140420', 'SE140421', 'SE140422', 'SE140423', 'SE140425', 'SE140426', 'SE140427', 'SE140428', 'SE140429', 'SE140430', 'SE140431', 'SE140432', 'SE140433', 'SE140434', 'SE140435', 'SE140436', 'SE140437', 'SE140438', 'SE140439', 'SE140440', 'SE140441', 'SE140442', 'SE140443', 'SE140444', 'SE140445', 'SE140446', 'SE140447', 'SE140448', 'SE140449', 'SE140451', 'SE140452', 'SE140453', 'SE140454', 'SE140455', 'SE140456', 'SE140457', 'SE140458', 'SE140459', 'SE140460', 'SE140461', 'SE140462', 'SE140463', 'SE140464', 'SE140465', 'SE140466', 'SE140467', 'SE140468', 'SE140469', 'SE140470', 'SE140471', 'SE140472', 'SE140473', 'SE140474', 'SE140475', 'SE140476', 'SE140477', 'SE140478', 'SE140479', 'SE140480', 'SE140481', 'SE140482', 'SE140727', 'SE140483', 'SE140484', 'SE140485', 'SE140486', 'SE140487', 'SE140488', 'SE140489', 'SE140490', 'SE140491', 'SE140493', 'SE140494', 'SE140495', 'SE140496', 'SE140497', 'SE140498', 'SE140499', 'SE140500', 'SE140501', 'SE140502', 'SE140503', 'SE140504', 'SE140505', 'SE140506', 'SE140507', 'SE140509', 'SE140510', 'SE140511', 'SE140512', 'SE140513', 'SE140492', 'SE140514', 'SE140515', 'SE140516', 'SE140517', 'SE140518', 'SE140519', 'SE140520', 'SE140521', 'SE140522', 'SE140523', 'SE140524', 'SE140525', 'SE140526', 'SE140527', 'SE140528', 'SE140529', 'SE140530', 'SE140531', 'SE140532', 'SE140533', 'SE140534', 'SE140535', 'SE140536', 'SE140537', 'SE140538', 'SE140539', 'SE140540', 'SE140541', 'SE140542', 'SE140543', 'SE140544', 'SE140545', 'SE140546', 'SE140547', 'SE140548', 'SE140549', 'SE140550', 'SE140551', 'SE140552', 'SE140553', 'SE140554', 'SE140555', 'SE140556', 'SE140557', 'SE140558', 'SE140559', 'SE140637', 'SE140560', 'SE140561', 'SE140562', 'SE140563', 'SE140564', 'SE140565', 'SE140567', 'SE140568', 'SE140569', 'SE140570', 'SE140571', 'SE140572', 'SE140573', 'SE140574', 'SE140575', 'SE140576', 'SE140577', 'SE140578', 'SE140579', 'SE140580', 'SE140581', 'SE140582', 'SE140583', 'SE140584', 'SE140585', 'SE140586', 'SE140587', 'SE140588', 'SE140589', 'SE140590', 'SE140591', 'SE140592', 'SE140593', 'SE140594', 'SE140595', 'SE140596', 'SE140597', 'SE140598', 'SE140599', 'SE140600', 'SE140601', 'SE140602', 'SE140603', 'SE140604', 'SE140605', 'SE140606', 'SE140607', 'SE140608', 'SE140609', 'SE140610', 'SE140613', 'SE140614', 'SE140615', 'SE140616', 'SE140617', 'SE140618', 'SE140619', 'SE140620', 'SE140621', 'SE140622', 'SE140623', 'SE140624', 'SE140625', 'SE140626', 'SE140627', 'SE140628', 'SE140629', 'SE140630', 'SE140631', 'SE140654', 'SE140632', 'SE140633', 'SE140635', 'SE140636', 'SE140638', 'SE140639', 'SE140640', 'SE140641', 'SE140642', 'SE140643', 'SE140644', 'SE140645', 'SE140646', 'SE140647', 'SE140648', 'SE140649', 'SE140650', 'SE140651', 'SE140652', 'SE140653', 'SE140656', 'SE140657', 'SE140658', 'SE140659', 'SE140660', 'SE140661', 'SE140662', 'SE140663', 'SE140664', 'SE140665', 'SE140666', 'SE140667', 'SE140668', 'SE140669', 'SE140670', 'SE140671', 'SE140672', 'SE140673', 'SE140674', 'SE140675', 'SE140676', 'SE140677', 'SE140678', 'SE140679', 'SE140680', 'SE140681', 'SE140682', 'SE140683', 'SE140684', 'SE140685', 'SE140686', 'SE140687', 'SE140688', 'SE140689', 'SE140690', 'SE140691', 'SE140692', 'SE140693', 'SE140694', 'SE140695', 'SE140696', 'SE140697', 'SE140698', 'SE140699', 'SE140700', 'SE140701', 'SE140702', 'SE140703', 'SE140704', 'SE140705', 'SE140706', 'SE140707', 'SE140708', 'SE140709', 'SE140710', 'SE140715', 'SE140716', 'SE140717', 'SE140718', 'SE140719', 'SE140720', 'SE140721', 'SE140722', 'SE140723', 'SE140724', 'SE140725', 'SE140726', 'SE140729', 'SE140730', 'SE140731', 'SE140732', 'SE140733', 'SE140734', 'SE140738', 'SE140739', 'SE140740', 'SE140741', 'SE140742', 'SE140743', 'SE140744', 'SE140745', 'SE140746', 'SE140747', 'SE140752', 'SE140753', 'SE140754', 'SE140755', 'SE140756', 'SE140757', 'SE140758', 'SE140763', 'SE140764', 'SE140765', 'SE140767', 'SE140768', 'SE140769', 'SE140770', 'SE140771', 'SE140772', 'SE140773', 'SE140774', 'SE140775', 'SE140776', 'SE140777', 'SE140795', 'SE140796', 'SE140797', 'SE140798', 'SE140799', 'SE140800', 'SE140801', 'SE140778', 'SE140802', 'SE140803', 'SE140804', 'SE140805', 'SE140806', 'SE140807', 'SE140808', 'SE140809', 'SE140810', 'SE140811', 'SE140812', 'SE140813', 'SE140779', 'SE140814', 'SE140780', 'SE140815', 'SE140816', 'SE140817', 'SE140781', 'SE140818', 'SE140819', 'SE140820', 'SE140821', 'SE140822', 'SE140823', 'SE140824', 'SE140782', 'SE140825', 'SE140826', 'SE140827', 'SE140828', 'SE140829', 'SE140830', 'SE140783', 'SE140831', 'SE140832', 'SE140833', 'SE140834', 'SE140835', 'SE140836', 'SE140837', 'SE140838', 'SE140839', 'SE140784', 'SE140840', 'SE140841', 'SE140842', 'SE140843', 'SE140844', 'SE140845', 'SE140785', 'SE140846', 'SE140847', 'SE140848', 'SE140786', 'SE140849', 'SE140850', 'SE140851', 'SE140852', 'SE140853', 'SE140854', 'SE140787', 'SE140855', 'SE140856', 'SE140857', 'SE140858', 'SE140859', 'SE140860', 'SE140861', 'SE140862', 'SE140863', 'SE140864', 'SE140865', 'SE140866', 'SE140788', 'SE140867', 'SE140868', 'SE140869', 'SE140870', 'SE140871', 'SE140872', 'SE140873', 'SE140874', 'SE140875', 'SE140876', 'SE140789', 'SE140877', 'SE140878', 'SE140879', 'SE140880', 'SE140790', 'SE140881', 'SE140882', 'SE140883', 'SE140791', 'SE140884', 'SE140885', 'SE140886', 'SE140887', 'SE140888', 'SE140889', 'SE140890', 'SE140891', 'SE140892', 'SE140893', 'SE140894', 'SE140895', 'SE140896', 'SE140792', 'SE140897', 'SE140898', 'SE140899', 'SE140793', 'SE140900', 'SE140901', 'SE140902', 'SE140903', 'SE140904', 'SE140905', 'SE140906', 'SE140907', 'SE140908', 'SE140909', 'SE140910', 'SE140911', 'SE140912', 'SE140913', 'SE140914', 'SE140915', 'SE140916', 'SE140917', 'SE140794', 'SE140918', 'SE140919', 'SE140920', 'SE140921', 'SE140922', 'SE140923', 'SE140924', 'SE140925', 'SE140926'];

function init() {
    for (var i = 0; i < idStudentDB.length; i++) {
        database.ref('quiz/' + idStudentDB[i]).set({
            id: idStudentDB[i],
            name: 'null',
            grade: 'null',
            time: 'null',
            status: false
        });
        console.log("Success");
    }
}