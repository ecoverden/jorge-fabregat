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

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var submit = form.querySelector(".submit");
  var submitLabel = submit ? submit.textContent : "Enviar mensaje";
  var ENDPOINT = "https://formsubmit.co/ajax/Jorge.fabregatb@gmail.com";

  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) return;

    var name = form.querySelector("#name");
    var email = form.querySelector("#email");
    var message = form.querySelector("#message");

    if (!name.value.trim() || !message.value.trim()) {
      setStatus("Completa tu nombre y el mensaje, por favor.", "error");
      return;
    }

    if (!validEmail(email.value.trim())) {
      setStatus("Revisa tu email, por favor.", "error");
      email.focus();
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Enviando…";
    }
    setStatus("");

    var payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      _subject: "Nuevo mensaje desde jorgefabregat.vercel.app",
      _template: "table",
      _captcha: "false"
    };

    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        var ok = data && (data.success === true || data.success === "true");
        if (!ok) throw new Error("send_failed");
        form.reset();
        setStatus("Mensaje enviado. Te responderé personalmente en breve.", "success");
      })
      .catch(function () {
        setStatus(
          "No se ha podido enviar. Escríbeme directamente a Jorge.fabregatb@gmail.com",
          "error"
        );
      })
      .then(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = submitLabel;
        }
      });
  });
})();
