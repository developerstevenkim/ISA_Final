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
    html: ' <input id="id" type="hidden">' + '<input id="question" class="swal2-input" placeholder="Question">' + '<input id="option1" class="swal2-input" placeholder="Option1">' + ' <input id="option2" class="swal2-input" placeholder="Option2">' + '<input id="option3" class="swal2-input"  placeholder="Option3">' + '<input id="option4" class="swal2-input" placeholder="Option4">' + '<input id="answer" type ="number" class="swal2-input" pattern ="[0-9]" min ="1" max ="4" placeholder="Answer" width ="300px">',
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
  console.log(question);
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://lab5.live/Quiz/API/V1/");
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
      console.log(xhttp.responseText);
      const objects = JSON.parse(xhttp.responseText);
      console.log(objects);
      Swal.fire(`${question} is stored into DB!`);
      loadTable();
    }
  };
}

function quesDelete(id) {
  const xhttp = new XMLHttpRequest();
  jsoncontent = {
    "id": id,
  }
  xhttp.open("DELETE", "https://lab5.live/Quiz/API/V1/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  console.log("jsoncontent: " + jsoncontent);
  xhttp.send(JSON.stringify(jsoncontent));
  console.log(jsoncontent);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(`#${id} was deleted from the DB!`);
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
          '<input type ="number" id="answer" class="swal2-input" placeholder="Answer" pattern ="[0-9]" min="1" max="4" value=""' + user['answer'] + '">',
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
      console.log(xhttp.responseText);
      Swal.fire(this.responseText);
      loadTable();
    }
  };
}