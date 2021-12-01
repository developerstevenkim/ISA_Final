const xhttp = new XMLHttpRequest();
const endPointRoot = 'https://prernadohun.com/';
const resource="login";

const email = document.getElementById('email');
const password = document.getElementById('password');
const message = document.getElementById('message');

const loginHandler = (e) => {
  e.preventDefault();
  const jsonContent = {'email': email.value, 'password': password.value};

  xhttp.open("POST", endPointRoot+resource, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(jsonContent));
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          const res = JSON.parse(xhttp.responseText);
          window.localStorage.setItem("uid", res.id);
          window.localStorage.setItem("token", res.token);
          alert(`${res.message}`);
          window.location.href = './landingPage.html'; 
      } else if (xhttp.readyState == 4) {
          message.textContent  = `Error`;
      }
  };
}
const form = document.getElementById('form');
if (form) {
    form.addEventListener('submit', loginHandler);
  }
