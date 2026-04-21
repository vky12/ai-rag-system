const API_URL = "/chat";
const TOKEN = localStorage.getItem("token");

if (!TOKEN) {
  window.location.href = "login.html";
}

function addMessage(text, type) {
  const chatBox = document.getElementById("chat-box");

  const div = document.createElement("div");
  div.classList.add("msg", type);
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value;

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  addMessage(data.reply, "bot");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}