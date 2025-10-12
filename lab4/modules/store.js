const API_URL = 'https://four537lab4-1.onrender.com/api/definitions';
// const API_URL = 'http://localhost:3002/api/definitions'


function displayResult(message) {
  let element = document.getElementById("result");
  element.innerHTML = message;
  element.style.display = 'block';
}

const validInput = (word, definition) => {
  if (word && definition) {
    const regex = /^[A-Za-z\s]+$/;
    const w = word.trim();
    const d = definition.trim();
    return regex.test(w) && regex.test(d) && w !== "" && d !== "";
  }
  return false;
};

function getData(event) {
  event.preventDefault();
  const word = document.getElementById('word').value;
  const definition = document.getElementById('definition').value;

  if (validInput(word, definition)) {
    console.log(word, definition);
    makeRequest(word, definition);
    console.log("making request");
  } else {
    console.log("not valid input");
    displayResult(messages.empty);
    return;
  }
}

function makeRequest(word, definition) {
  let xhttp = new XMLHttpRequest();

  const data = {
    word: word.trim(),
    definition: definition.trim()
  };

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 201) {
        const response = JSON.parse(this.responseText);
        const message = `${messages.reqNum} ${response.requestCount}\n${response.message}`;
        displayResult(message);
        document.getElementById('storeForm').reset();

      } else if (this.status == 409) {
        const response = JSON.parse(this.responseText);
        displayResult(response.message);

      } else if (this.status == 400) {
        const response = JSON.parse(this.responseText);
        displayResult(response.message || messages.invalidInput);

      } else if (this.status == 0) {
        displayResult(messages.errNet);

      } else {
        displayResult(messages.errServer);
      }
    }
  };

  xhttp.open('POST', API_URL, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(data));
}

const storeForm = document.getElementById("storeForm");
storeForm.addEventListener("submit", getData);