(function () {
  "use strict";

  /* ---------- Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");

    var sections = document.querySelectorAll(".section");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    sections.forEach(function (section) {
      io.observe(section);
    });
  }

  /* ---------- Contact form (mailto) ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var nameEl = form.querySelector("#name");
  var messageEl = form.querySelector("#message");
  var RECIPIENT = "Jorge.fabregatb@gmail.com";

  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text || "";
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = nameEl.value.trim();
    var message = messageEl.value.trim();

    if (!message) {
      setStatus("Escribe un mensaje antes de enviar.", "error");
      messageEl.focus();
      return;
    }

    var subject = name
      ? "Mensaje de " + name
      : "Mensaje desde jorgefabregat.vercel.app";

    var bodyLines = [];
    if (name) {
      bodyLines.push("Hola Jorge,");
      bodyLines.push("");
      bodyLines.push("Soy " + name + ".");
      bodyLines.push("");
    }
    bodyLines.push(message);
    var body = bodyLines.join("\n");

    var mailto =
      "mailto:" +
      RECIPIENT +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);

    setStatus("Abriendo tu aplicación de correo…", "success");
    window.location.href = mailto;
  });
})();
