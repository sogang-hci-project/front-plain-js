const state = {
  sessionID: null,
  nextStage: null,
  currentStage: null,
  server: null,
};

window.onload = function () {
  state.server =
    window.localStorage.getItem("picasso") || "http://localhost:3030";
  window.localStorage.setItem("picasso", state.server);
  document.getElementById("server").textContent =
    "current server: " + state.server;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${state.server}/api/v1/greeting/0`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      state.sessionID = response.data.sessionID;
      state.nextStage = response.data.nextStage;
      state.currentStage = response.data.currentStage;
      console.log("session initialize", state.sessionID);
    }
  };
  xhr.send();
};

document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("repeat").addEventListener("click", repeatMessage);
document.getElementById("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
    // } else if (e.key === "Escape") {
    //   e.preventDefault();
    //   console.log("escaped");
    //   repeatMessage();
    // }
  } else if (e.key === "`") {
    e.preventDefault();
    repeatMessage();
  }
});
var serverInput = document.getElementById("serverInput");
document.getElementById("confirm").addEventListener("click", setServer);

function setServer() {
  state.server = document.getElementById("serverInput").value;
  document.getElementById("serverInput").value = "";
  window.localStorage.setItem("picasso", state.server);
  document.getElementById("server").textContent =
    "current server: " + state.server;
}

function sendMessage() {
  var inputValue = document.getElementById("input").value;
  var url = `${state.server}/api/v1${state.nextStage}?lang=en&sessionID=${state.sessionID}`;
  var body = {
    user: inputValue,
  };
  document.getElementById("user").textContent = inputValue;
  document.getElementById("ai").textContent = "loading";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var agent = response.data.contents.agent;
      state.nextStage = response.data.nextStage;
      state.currentStage = response.data.currentStage;
      console.log("User: " + inputValue);
      console.log("Agent: " + agent);
      document.getElementById("ai").textContent = agent;
      document.getElementById("input").value = ""; // Reset the input value
    }
  };
  xhr.send(JSON.stringify(body));
}

function repeatMessage() {
  var inputValue = document.getElementById("input").value;
  var url = `http://localhost:3030/api/v1${state.currentStage}?lang=en&sessionID=${state.sessionID}`;
  var body = {
    user: inputValue,
  };
  document.getElementById("user").textContent = inputValue;
  document.getElementById("ai").textContent = "loading";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var agent = response.data.contents.agent;
      state.nextStage = response.data.nextStage;
      console.log("User: " + inputValue);
      console.log("Agent: " + agent);
      document.getElementById("ai").textContent = agent;
      document.getElementById("input").value = ""; // Reset the input value
    }
  };
  xhr.send(JSON.stringify(body));
}
