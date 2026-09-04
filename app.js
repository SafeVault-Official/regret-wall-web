const starterNotes = [
  { text: "I said I was fine when I really wanted someone to ask twice.", color: "yellow", face: ":(", likes: 182, rotate: -3, position: "n1" },
  { text: "I sold too early. Again.", color: "pink", face: ":/", likes: 76, rotate: 3, position: "n2" },
  { text: "I should have taken the trip.", color: "blue", face: ":(", likes: 241, rotate: -2, position: "n3" },
  { text: "I never told her the truth.", color: "green", face: ":O", likes: 129, rotate: 2, position: "n4" },
  { text: "I miss a version of me that doesn't exist anymore.", color: "purple", face: ":(", likes: 315, rotate: -4, position: "n5" },
  { text: "I let fear write the ending.", color: "orange", face: ":/", likes: 98, rotate: 4, position: "n6" },
  { text: "I wish I had called my dad back.", color: "yellow", face: ":(", likes: 402, rotate: 2, position: "n7" },
  { text: "I pretended I didn't care. I cared too much.", color: "pink", face: "♡", likes: 207, rotate: -2, position: "n8" }
];

const notesGrid = document.querySelector("#notesGrid");
const composer = document.querySelector("#composer");
const reader = document.querySelector("#reader");
const textArea = document.querySelector("#regretText");
let selectedColor = "yellow";
let selectedFace = ":(";
let regrets = Number(localStorage.getItem("regret-count") || 2481);

function renderNotes() {
  notesGrid.innerHTML = "";
  starterNotes.forEach((note, index) => {
    const card = document.createElement("article");
    card.className = `note ${note.color} ${note.position}`;
    card.style.setProperty("--rotate", `${note.rotate}deg`);
    card.style.setProperty("--delay", `${index * 70}ms`);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Read regret: " + note.text);
    card.innerHTML = `<span class="tape"></span><span class="note-face">${note.face}</span><p>${note.text}</p><footer><button class="like" type="button" aria-label="Support this regret">♡ <span>${note.likes}</span></button><span>anonymous</span></footer>`;
    card.addEventListener("click", event => {
      if (event.target.closest(".like")) return;
      openReader(note);
    });
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") openReader(note); });
    card.querySelector(".like").addEventListener("click", event => likeNote(event, note, card));
    notesGrid.append(card);
  });
}

function likeNote(event, note, card) {
  event.stopPropagation();
  const button = event.currentTarget;
  if (button.classList.toggle("liked")) note.likes += 1;
  else note.likes -= 1;
  button.querySelector("span").textContent = note.likes;
  if (card) card.classList.add("bump");
  setTimeout(() => card?.classList.remove("bump"), 240);
}

function openReader(note) {
  const expanded = document.querySelector("#expandedNote");
  expanded.className = `expanded-note ${note.color}`;
  expanded.querySelector(".note-face").textContent = note.face;
  document.querySelector("#readerText").textContent = note.text;
  const like = expanded.querySelector(".like");
  like.classList.remove("liked");
  like.querySelector("span").textContent = note.likes;
  like.onclick = event => likeNote(event, note, null);
  reader.showModal();
}

document.querySelector("#postButton").addEventListener("click", () => composer.showModal());
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close()));
[composer, reader].forEach(modal => modal.addEventListener("click", event => { if (event.target === modal) modal.close(); }));
textArea.addEventListener("input", () => document.querySelector("#counter").textContent = `${textArea.value.length} / 280`);

document.querySelector("#swatches").addEventListener("click", event => {
  const choice = event.target.closest(".swatch"); if (!choice) return;
  selectedColor = choice.dataset.color;
  document.querySelectorAll(".swatch").forEach(item => item.classList.toggle("selected", item === choice));
});
document.querySelector("#faces").addEventListener("click", event => {
  const choice = event.target.closest(".face-choice"); if (!choice) return;
  selectedFace = choice.dataset.face;
  document.querySelectorAll(".face-choice").forEach(item => item.classList.toggle("selected", item === choice));
});

document.querySelector("#regretForm").addEventListener("submit", event => {
  event.preventDefault();
  const text = textArea.value.trim(); if (!text) return;
  starterNotes.unshift({ text, color: selectedColor, face: selectedFace, likes: 0, rotate: Math.floor(Math.random() * 8) - 3, position: "new-note" });
  regrets += 1;
  localStorage.setItem("regret-count", regrets);
  document.querySelector("#regretCount").textContent = regrets.toLocaleString();
  textArea.value = ""; document.querySelector("#counter").textContent = "0 / 280";
  composer.close(); renderNotes();
});

document.querySelector("#copyContract").addEventListener("click", async () => {
  await navigator.clipboard?.writeText("7xFjPq9rE9VhL2mQkA3dBnT4wYzR8cKu");
  const toast = document.querySelector("#toast"); toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800);
});
document.querySelector("#regretCount").textContent = regrets.toLocaleString();
renderNotes();
