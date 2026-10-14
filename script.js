// Funciones compartidas: tema, menú, búsqueda, año, botón arriba y código QR.
const body = document.body;
const themeButton = document.querySelector("[data-theme-toggle]");
const menuButton = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector("[data-main-nav]");
const backTop = document.querySelector("[data-back-top]");

// Modo claro/oscuro. La preferencia se conserva en este navegador.
const savedTheme = localStorage.getItem("tr-theme");
if (savedTheme === "dark") body.classList.add("dark");
updateThemeButton();

function updateThemeButton() {
  if (!themeButton) return;
  themeButton.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
  themeButton.title = body.classList.contains("dark") ? "Activar modo claro" : "Activar modo oscuro";
}
if (themeButton) {
  themeButton.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("tr-theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeButton();
  });
}

// Menú desplegable para teléfonos.
if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });
}

// Marca el enlace de la página actual.
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

// Búsqueda básica entre las páginas de este proyecto.
const searchablePages = [
  { title: "Inicio", url: "index.html", words: "tecnología responsable proyecto futuro" },
  { title: "Sostenibilidad", url: "sostenibilidad.html", words: "planeta reciclaje energía residuos electrónicos ambiente" },
  { title: "Convivencia digital", url: "convivencia.html", words: "respeto ciberacoso empatía redes sociales convivencia" },
  { title: "Uso responsable de las TIC", url: "tic.html", words: "seguridad privacidad contraseñas datos noticias falsas" },
  { title: "Videos educativos", url: "videos.html", words: "videos audiovisuales youtube aprender" },
  { title: "Enlaces útiles", url: "enlaces.html", words: "fuentes recursos organizaciones internet" },
  { title: "Contacto", url: "contacto.html", words: "contacto opinión sugerencia mensaje" }
];
const searchForm = document.querySelector("[data-search-form]");
if (searchForm) {
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const input = searchForm.querySelector("[data-search-input]");
    const query = input.value.trim().toLocaleLowerCase("es");
    if (!query) {
      input.focus();
      return;
    }
    const match = searchablePages.find(page =>
      (page.title + " " + page.words).toLocaleLowerCase("es").includes(query)
    );
    if (match) {
      location.href = match.url;
    } else {
      alert("No encontramos una sección con ese término. Prueba: sostenibilidad, convivencia, TIC, videos o enlaces.");
    }
  });
}

// Año automático en el pie de página.
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Botón flotante para volver arriba.
if (backTop) {
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("visible", window.scrollY > 450);
  });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Generador de QR: usa un servicio externo y necesita internet.
const qrButton = document.getElementById("qr-generate");
if (qrButton) {
  qrButton.addEventListener("click", () => {
    const field = document.getElementById("qr-url");
    const result = document.getElementById("qr-result");
    let url;
    try {
      url = new URL(field.value.trim());
    } catch {
      result.textContent = "Escribe un enlace válido, por ejemplo https://tusitio.com";
      return;
    }
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".")) {
      result.textContent = "El enlace debe comenzar con http:// o https:// y tener un dominio válido.";
      return;
    }
    const image = document.createElement("img");
    image.alt = "Código QR que abre " + url.href;
    image.width = 200;
    image.height = 200;
    image.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(url.href);
    image.onload = () => { result.replaceChildren(image); };
    image.onerror = () => { result.textContent = "No se pudo cargar el QR. Revisa tu conexión a internet."; };
    result.textContent = "Generando código QR…";
    // Reemplaza el mensaje cuando la imagen cargue correctamente.
    image.addEventListener("load", () => result.replaceChildren(image), { once: true });
  });
}

// Mini cuestionario opcional, usado en la página de convivencia.
document.querySelectorAll("[data-quiz-answer]").forEach(button => {
  button.addEventListener("click", () => {
    const feedback = document.querySelector("[data-quiz-feedback]");
    if (!feedback) return;
    const correct = button.dataset.quizAnswer === "correct";
    feedback.textContent = correct
      ? "¡Correcto! Verifica la información y respeta a las personas antes de compartir."
      : "Inténtalo otra vez. La mejor opción es comprobar la fuente y actuar con respeto.";
    feedback.style.color = correct ? "var(--primary)" : "#d97706";
  });
});

// Formulario demostrativo: no envía información a un servidor.
const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.querySelector("[data-contact-feedback]");
    feedback.textContent = "¡Gracias! Esta demostración validó el formulario, pero no envía mensajes por internet.";
    contactForm.reset();
  });
}
