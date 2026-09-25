const API_URL = "https://v2.jokeapi.dev/joke/Any?type=single,twopart&safe-mode";

const newJokeButton = document.querySelector("#new-joke");
const copyButton = document.querySelector("#copy-joke");
const jokeContent = document.querySelector("#joke-content");
const category = document.querySelector("#category");
const errorMessage = document.querySelector("#error-message");

let currentJoke = "";

function renderJoke(data) {
  currentJoke = data.type === "twopart" ? `${data.setup}\n\n${data.delivery}` : data.joke;
  jokeContent.innerHTML = data.type === "twopart"
    ? `<p><span class="setup">${escapeHtml(data.setup)}</span><span class="delivery">${escapeHtml(data.delivery)}</span></p>`
    : `<p>${escapeHtml(data.joke)}</p>`;
  category.textContent = data.category || "Random joke";
  copyButton.disabled = false;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

async function fetchJoke() {
  newJokeButton.disabled = true;
  copyButton.disabled = true;
  errorMessage.hidden = true;
  jokeContent.innerHTML = '<p class="placeholder">Finding something funny…</p>';
  category.textContent = "Loading";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("The joke service is unavailable.");
    const data = await response.json();
    if (data.error) throw new Error(data.message || "No joke found.");
    renderJoke(data);
  } catch (error) {
    jokeContent.innerHTML = '<p class="placeholder">The jar is stuck. Try again?</p>';
    category.textContent = "Oops";
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  } finally {
    newJokeButton.disabled = false;
  }
}

async function copyJoke() {
  if (!currentJoke) return;
  try {
    await navigator.clipboard.writeText(currentJoke);
    const original = copyButton.innerHTML;
    copyButton.innerHTML = '<span aria-hidden="true">✓</span>';
    copyButton.setAttribute("aria-label", "Joke copied");
    setTimeout(() => {
      copyButton.innerHTML = original;
      copyButton.setAttribute("aria-label", "Copy joke");
    }, 1400);
  } catch {
    errorMessage.textContent = "Could not copy the joke. You can select it manually.";
    errorMessage.hidden = false;
  }
}

newJokeButton.addEventListener("click", fetchJoke);
copyButton.addEventListener("click", copyJoke);
