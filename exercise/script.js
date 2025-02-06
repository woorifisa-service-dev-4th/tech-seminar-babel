"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var toggleSwitch = document.getElementById("theme-toggle");
  var body = document.body;
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    toggleSwitch.checked = true;
  } else {
    body.classList.remove("dark-mode");
    toggleSwitch.checked = false;
    localStorage.setItem("darkMode", "disabled");
  }
  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
