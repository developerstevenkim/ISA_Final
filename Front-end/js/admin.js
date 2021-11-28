const endPointRoot = 'https://lab5.live/Quiz/API/V1/';
const resource="admins/stats";
const message = "There is no Admin stat data";

const table = document.getElementById('statTable');

const loadStats = () => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", endPointRoot+resource, true);
  xhttp.setRequestHeader('Authorization',`Bearer ${window.localStorage.getItem("adminToken")}`);
  xhttp.send();
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          const stats = JSON.parse(xhttp.responseText).stats;
          if (stats.length == 0) {
            let row = table.insertRow();
            let cell = row.insertCell();
            cell.innerHTML = emptyTableMessage;
          } else {
            for (let i = 0; i < stats.length; i++) {
              let row = table.insertRow();
              let methodCell = row.insertCell();
              let endpointCell = row.insertCell();
              let countCell = row.insertCell();
              methodCell.innerHTML = stats[i].method;
              endpointCell.innerHTML = stats[i].endpoint;
              countCell.innerHTML = stats[i].count;
            }
          }
      } else if (xhttp.readyState == 4) {
          console.log(`Error: ${JSON.parse(xhttp.responseText).message}`);
          alert(`Error: ${JSON.parse(xhttp.responseText).message}`)
      }
  };
}

loadStats();