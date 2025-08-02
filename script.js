const missionTitle = document.getElementById("mission-title");

window.addEventListener("scroll", () => {
  const section = document.getElementById("mission");
  const rect = section.getBoundingClientRect();

  if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0) {
    missionTitle.classList.add("underline-show");
  } else {
    missionTitle.classList.remove("underline-show");
  }
});
