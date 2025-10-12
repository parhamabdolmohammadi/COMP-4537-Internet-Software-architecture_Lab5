const API_URL = 'https://four537lab4-1.onrender.com/api/definitions'
// const API_URL = 'http://localhost:3002/api/definitions'

function displayResult(content) {
  let element = document.getElementById("result");
  element.innerHTML = content;
}

const validInput = word => {
  const regex = /^[A-Za-z\s]+$/; 
  const trimmed = word.trim();
  return trimmed !== "" && regex.test(trimmed);
};




function getSearchWord(event) {
  event.preventDefault();
  const searchWord = document.getElementById('searchWord').value;
  if (validInput(searchWord)) {
    console.log(searchWord);
    makeRequest(searchWord);
    console.log("making request");
  } else {
    console.log("not a valid word");
    displayResult(messages.empty);
    return;
  }
}

function makeRequest(searchWord) {
  let xhttp = new XMLHttpRequest();
  const url = `${API_URL}?word=${encodeURIComponent(searchWord.trim())}`;

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const response = JSON.parse(this.responseText);
        const content = `
          <div class="word">${messages.wordLabel} ${response.word}</div>
          <div class="definition">${messages.defLabel} ${response.definition}</div>
          <div class="request-info">${messages.reqNum} ${response.requestCount}</div>
        `;
        displayResult(content);

      } else if (this.status == 404) {
        const response = JSON.parse(this.responseText);
        const content = `<div>${messages.reqNum} ${response.requestCount}, word '${searchWord}' ${messages.notFound}</div>`;
        displayResult(content);

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
  xhttp.open('GET', url, true);
  xhttp.send();
}

const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", getSearchWord);
