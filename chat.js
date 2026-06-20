const composer = document.getElementById("composer");
const field = document.getElementById("field");
const log = document.getElementById("log");

const clock = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" });

function append(text, who) {
  const entry = document.createElement("article");
  entry.className = `entry entry--${who}`;

  const whoTag = document.createElement("span");
  whoTag.className = "entry__who";
  whoTag.textContent = who === "you" ? "you" : "parley";

  const meta = document.createElement("p");
  meta.className = "entry__meta";
  meta.append(whoTag, ` · ${clock.format(new Date())}`);

  const body = document.createElement("p");
  body.className = "entry__body";
  body.textContent = text;

  entry.append(meta, body);
  log.append(entry);
  log.scrollTop = log.scrollHeight;
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = field.value.trim();
  if (text === "") {
    return;
  }

  append(text, "you");
  field.value = "";
  field.focus();
});
