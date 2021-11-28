const resource="register";
const endPointRoot = 'https://lab5.live/Quiz/API/V1/';

const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const message = document.getElementById('message');

const registerHandler = (e) => {
  e.preventDefault();

  const xhttp = new XMLHttpRequest();

  const jsonContent = {
    'username': username.value,
    'email': email.value,
    'password': password.value
  };

  xhttp.open("POST", endPointRoot+resource, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(jsonContent));
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          alert("You are registered successfully !");
          window.location.href = "./login.html";
      } else if (xhttp.readyState == 4) {
          message.textContent = `Error`;
      }
  };
}

const form = document.getElementById('form');
form.addEventListener('submit', registerHandler);
