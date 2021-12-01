const xhttp = new XMLHttpRequest();
const endPointRoot = 'https://prernadohun.com/';
const resource="adminLogin";
const verifyResource = "admins/verify";

const username = document.getElementById('username');
const password = document.getElementById('password');
const message = document.getElementById('message');

const redirectToAdminPageIfLoggedIn = () => {
  if (!window.localStorage.getItem("adminToken")) return;

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", endPointRoot+verifyResource, true);
  xhttp.setRequestHeader('Authorization',`Bearer ${window.localStorage.getItem("adminToken")}`);
  xhttp.send();
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          window.location.href = "./admin.html";
      }
  };
}

const loginHandler = (e) => {
  e.preventDefault();

  const xhttp = new XMLHttpRequest();
  const paramsJson = {'username': username.value, 'password': password.value};

  xhttp.open("POST", endPointRoot+resource, true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(paramsJson));
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          const res = JSON.parse(xhttp.responseText);
          window.localStorage.setItem("adminToken", res.token);
          alert(`${res.message}`);
          window.location.href = "./admin.html";
      } else if (xhttp.readyState == 4) {
          message.textContent  = `Error: ${JSON.parse(xhttp.responseText).message}`;
      }
  };
}

redirectToAdminPageIfLoggedIn();
const form = document.getElementById('form');
form.addEventListener('submit', loginHandler);