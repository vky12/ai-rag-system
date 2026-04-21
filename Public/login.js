async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

   const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.token) {
    msg.innerText = "Login failed";
    return;
  }

  // Save token
  localStorage.setItem("token", data.token);

  // Redirect to chat
  window.location.href = "chat.html";
}