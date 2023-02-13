import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

//set loading reaction
function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

//function to enter text
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

//function to generate unique id by time
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`; // template string
}

//set chatstripe div
function chatStripe(isAI, value, uniqueID) {
  return `
    <div class="wrapper ${isAI && "ai"}" >
      <div class="chat" >
        <div class="profile" >
          <img src="${isAI ? bot : user}" alt="${isAI ? "bot" : "user"}" />
        </div>
        <div class="message" id=${uniqueID}>${value}</div>
      </div>
    </div>
    
    `;
}

//set async submit function take event as parameter
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  // ensure the new message is in view
  chatContainer.scrollTop = chatContainer.scrollHeight;
  // fetch the newly created div
  const messageDiv = document.getElementById(uniqueId);
  // turn on loader for this div
  loader(messageDiv);

  // fetch data from server -> bot's response
  const response = await fetch("https://chatgpt-cory.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); //parse the data to be readable
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Oops..something went wrong";
    alert(err);
  }
};

// click submit button to call handleSubmit
form.addEventListener("submit", handleSubmit);
// set press 'enter' key another way to call handleSubmit. keycode === 13 is enter key
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
