// const { json } = require("stream/consumers");

function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://lab5.live/Quiz/API/V1/");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      for (var object of objects) {
        trHTML += '<td>' + object['id'] + '</td>';
        trHTML += '<td>' + object['question'] + '</td>';
        trHTML += '<td><button type="button" class="btn btn-success" onclick="showEditBox(' + object['id'] + ')"> Edit</button>';
        trHTML += '';
        trHTML += '<button type="button" class="btn btn-danger" onclick="quesDelete(' + object['id'] + ')">Del</button></td>';
        trHTML += "</tr>";
      }
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}
loadTable();

function showCreateBox() {

  Swal.fire({
    title: 'Create new question',
    html: ' <input id="id" type="hidden">' + '<input id="question" class="swal2-input" placeholder="Question">' + '<input id="option1" class="swal2-input" placeholder="Option1">' + ' <input id="option2" class="swal2-input" placeholder="Option2">' + '<input id="option3" class="swal2-input"  placeholder="Option3">' + '<input id="option4" class="swal2-input" placeholder="Option4">' + '<input id="answer" class="swal2-input" placeholder="CorrectAnswer">',
    focusConfirm: false,
    preConfirm: () => {
      questionCreate();
    }
  })
}

function questionCreate() {
  const question = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;
  const answer = document.getElementById("answer").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://lab5.live/Quiz/API/V1/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "question": question,
    "option1": option1,
    "option2": option2,
    "option3": option3,
    "option4": option4,
    "answer": answer
  }));

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText);
      const objects = JSON.parse(this.responseText);
      // console.log(`objects['message'] is ${objects['message']}`);
      Swal.fire(`${objects.question} was created to the DB!`);
      loadTable();
    }
  };
}

function quesDelete(id) {
  const xhttp = new XMLHttpRequest();
  const quest = "";
  jsoncontent = {
    "id": id,
  }
  xhttp.open("GET", "https://lab5.live/Quiz/API/V1/" + id);
  xhttp.send(JSON.stringify(jsoncontent));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      console.log(`objects: ${objects}`);
      quest = objects.question;
    }
  }
  console.log(`quest: ${quest}`);
  xhttp.open("DELETE", "https://lab5.live/Quiz/API/V1/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  console.log("jsoncontent: " + jsoncontent);
  xhttp.send(JSON.stringify(jsoncontent));
  console.log(jsoncontent);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(`${quest} was deleted from the DB!`);
      loadTable();
    }
  };
}

function deleteAll() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "https://lab5.live/Quiz/API/V1/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(`All data was deleted from the DB!`);
      loadTable();
    }
  }
}

function showEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://lab5.live/Quiz/API/V1/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const user = objects[0];
      console.log(user);
      Swal.fire({
        title: 'Edit Question',
        html: '<input id="id" type="hidden" value=' + user['id'] + '>' +
          '<input id="question" class="swal2-input" placeholder="Question" value="' + user['question'] + '">' +
          '<input id="option1" class="swal2-input" placeholder="Option 1" value="' + user['option1'] + '">' +
          '<input id="option2" class="swal2-input" placeholder="Option 2" value="' + user['option2'] + '">' +
          '<input id="option3" class="swal2-input" placeholder="Option 3" value="' + user['option3'] + '">' +
          '<input id="option4" class="swal2-input" placeholder="Option 4" value="' + user['option4'] + '">' +
          '<input id="answer" class="swal2-input" placeholder="Answer" value="' + user['answer'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          quesEdit();
        }
      })
    }
  };
}

function quesEdit() {
  const id = document.getElementById("id").value;
  const question = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;
  const answer = document.getElementById("answer").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "https://lab5.live/Quiz/API/V1/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  jsoncontent = {
    "id": id,
    "question": question,
    "option1": option1,
    "option2": option2,
    "option3": option3,
    "option4": option4,
    "answer": answer
  };
  xhttp.send(JSON.stringify(jsoncontent));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire(this.responseText);
      loadTable();
    }
  };
}





// $(async () => {
//   const questionUrl = 'https://lab5.live/anmol/';

//   const getAllQuestions = () => {
//       return new Promise((resolve, reject) => {
//           let xhttp = new XMLHttpRequest();
//           //const questionUrl = serverUrl + 'computing/';

//           xhttp.open('GET', questionUrl, true);
//           xhttp.send();
//           xhttp.onreadystatechange = function () {
//               if (this.readyState == 4) {
//                   if (this.status == 200) {
//                       resolve(JSON.parse(this.responseText));
//                   } else {
//                       reject(this.statusText);
//                   }
//               }
//           };
//       });
//   };

//   const getQuestion = (id) => {
//       return new Promise((resolve, reject) => {
//           let xhttp = new XMLHttpRequest();
//           //const questionUrl = serverUrl + 'computing/' + id;

//           xhttp.open('GET', questionUrl, true);
//           xhttp.send();
//           xhttp.onreadystatechange = function () {
//               if (this.readyState == 4) {
//                   if (this.status == 200) {
//                       resolve(JSON.parse(this.responseText));
//                   } else {
//                       reject(this.statusText + ': ' + this.responseText);
//                   }
//               }
//           };
//       });
//   };


//   const addQuestion = (data) => {
//       return new Promise((resolve, reject) => {
//           let xhttp = new XMLHttpRequest();
//           //const questionUrl = serverUrl + 'computing/';
//         //let question = document.getElementById('question').value
//           xhttp.open('POST', questionUrl, true);
//           xhttp.setRequestHeader('Content-Type', 'application/json');
//           xhttp.send(JSON.stringify(data));
//           xhttp.onreadystatechange = function () {
//               if (this.readyState == 4) {
//                   if (this.status == 200) {
//                       resolve(JSON.parse(this.responseText));
//                   } else {
//                       reject(this.statusText + ': ' + this.responseText);
//                   }
//               }
//           };
//       });
//   };

//   const deleteAllQuestions = () => {
//       return new Promise((resolve, reject) => {
//           let xhttp = new XMLHttpRequest();
//           //const questionUrl = serverUrl + 'computing/';

//           xhttp.open('DELETE', questionUrl, true);
//           xhttp.send();
//           xhttp.onreadystatechange = function () {
//               if (this.readyState == 4) {
//                   if (this.status == 200) {
//                       resolve(JSON.parse(this.responseText));
//                   } else {
//                       reject(this.statusText + ': ' + this.responseText);
//                   }
//               }
//           };
//       });
//   };

//   const deleteQuestion = (id) => {
//       return new Promise((resolve, reject) => {
//           let xhttp = new XMLHttpRequest();
//           const questionUrl = questionUrl+ id;

//           xhttp.open('DELETE', questionUrl, true);
//           xhttp.send();
//           xhttp.onreadystatechange = function () {
//               if (this.readyState == 4) {
//                   if (this.status == 200) {
//                       resolve(JSON.parse(this.responseText));
//                   } else {
//                       reject(this.statusText + ': ' + this.responseText);
//                   }
//               }
//           };
//       });
//   };

//   let QList;
//   let selectedQuestionID;
//   let isAdd = false;

//   await getAllQuestions().then((value) => {
//       QList = value;
//   });

//   const renderList = () => {
//       let questionCount = 1;
//       const listGroupContainer = $('.list-group');

//       for (question of QList) {
//           listGroupContainer.append(`
//           <table class = table table-hover">
//           <tr>
//          <a href="#" class="list-group-item list-group-item-action" data-toggle="modal" data-target="#Modal" data-question-index="${
//               questionCount - 1
//           }">${questionCount}&nbsp&nbsp&nbsp&nbsp${question.question}</a></tr></table>
//           `);

//           questionCount++;
//       }
//   };

//   $('#Modal').on('show.bs.modal', async (event) => {
//       const button = $(event.relatedTarget);

//       if (event.relatedTarget.type != 'button') {
//           isAdd = false;

//           const questionIndex = button.data('question-index');
//           let selectedQuestion;
//           selectedQuestionID = QList[questionIndex].id;

//           await getQuestion(selectedQuestionID)
//               .then((value) => {
//                   selectedQuestion = value;
//               })
//               .catch((error) => {
//                   $('#Modal').modal('hide');
//                   alert(error);
//               });

//           const correctAnswer = selectedQuestion.answer;

//           $('#question').val(selectedQuestion.question);
//           $('#option1').val(selectedQuestion.option1);
//           $('#option2').val(selectedQuestion.option2);
//           $('#option3').val(selectedQuestion.option3);
//           $('#option4').val(selectedQuestion.option4);

//           $(`#inlineRadio${correctAnswer}`).click();

//           console.log(selectedQuestion);
//       
// } else {
//           isAdd = true;
//       }
//   });

//   const validateForm = (
//       question,
//       option1,
//       option2,
//       option3,
//       option4,
//       answer
//   ) => {
//       if (question == '') {
//           $('#question').addClass('is-invalid');
//       } else {
//           $('#question').removeClass('is-invalid');
//       }
//       if (option1 == '') {
//           $('#option1').addClass('is-invalid');
//       } else {
//           $('#option1').removeClass('is-invalid');
//       }
//       if (option2 == '') {
//           $('#option2').addClass('is-invalid');
//       } else {
//           $('#option2').removeClass('is-invalid');
//       }
//       if (option3 == '') {
//           $('#option3').addClass('is-invalid');
//       } else {
//           $('#option3').removeClass('is-invalid');
//       }
//       if (option4 == '') {
//           $('#option4').addClass('is-invalid');
//       } else {
//           $('#option4').removeClass('is-invalid');
//       }
//       if (answer == undefined) {
//           $('input:radio').addClass('is-invalid');
//       } else {
//           $('input:radio').removeClass('is-invalid');
//       }

//       return $('.is-invalid').length == 0;
//   };

//   const clearModal = () => {
//       $('#question').val('');
//       $('#option1').val('');
//       $('#option2').val('');
//       $('#option3').val('');
//       $('#option4').val('');
//   };

//   $('#modalSubmitButton').click((event) => {
//       const id = selectedQuestionID;
//       const question = $('#question').val();
//       const option1 = $('#option1').val();
//       const option2 = $('#option2').val();
//       const option3 = $('#option3').val();
//       const option4 = $('#option4').val();
//       const answer = $('input:radio:checked').val();

//       const isValidForm = validateForm(
//           question,
//           option1,
//           option2,
//           option3,
//           option4,
//           answer
//       );

//       if (!isValidForm) {
//           return;
//       }

//       const dataStr = `{
//           "question":"${question}",
//           "option1":"${option1}",
//           "option2":"${option2}",
//           "option3":"${option3}",
//           "option4":"${option4}",
//           "answer":"${answer}"
//       }`;
//       const data = JSON.parse(dataStr);

//       if (isAdd) {
//           addQuestion(data)
//               .then((value) => {
//                   console.log(value);
//                   console.log("hello")
//               })
//               .catch((err) => {
//                   alert(err);
//               })
//               .finally(() => {
//                   clearModal();
//                   $('#Modal').modal('hide');
//                   location.reload();
//               });
//       } else {
//           updateQuestion(id, data)
//               .then((value) => {
//                   console.log(value);
//               })
//               .catch((err) => {
//                   alert(err);
//               })
//               .finally(() => {
//                   clearModal();
//                   $('#Modal').modal('hide');
//                   location.reload();
//               });
//       }
//   });

//   $('#deleteAllButton').click((event) => {
//       deleteAllQuestions()
//           .then((value) => {
//               console.log(value);
//           })
//           .catch((err) => {
//               alert(err);
//           })
//           .finally(() => {
//               location.reload();
//           });
//   });

//   $('#modalDeleteButton').click((event) => {
//       deleteQuestion(selectedQuestionID)
//           .then((value) => {
//               console.log(value);
//           })
//           .catch((err) => {
//               alert(err);
//           })
//           .finally(() => {
//               location.reload();
//           });
//   });

//   renderList();
// });