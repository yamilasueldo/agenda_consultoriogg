const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const themeToggleBtn = document.getElementById("themeToggleBtn");

document.addEventListener("DOMContentLoaded", async () => {
  loadTheme();

  try {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      showMessage("Error al verificar la sesión: " + error.message, true);
      return;
    }

    if (data.session) {
      window.location.href = "/agenda.html";
    }
  } catch (err) {
    showMessage("Error inesperado al iniciar: " + err.message, true);
    console.error(err);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  showMessage("Ingresando...", false);

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      showMessage("Error: " + error.message, true);
      return;
    }

    showMessage("Ingreso correcto. Redirigiendo...", false);
    window.location.href = "/agenda.html";
  } catch (err) {
    console.error(err);
    showMessage("Error inesperado: " + err.message, true);
  }
});

function showMessage(text, isError = false) {
  loginMessage.textContent = text;
  loginMessage.className = isError ? "auth-message error" : "auth-message success";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("gg_theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  } else {
    document.body.classList.remove("dark-mode");
    updateThemeIcon(false);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("gg_theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  if (!themeToggleBtn) return;
  themeToggleBtn.textContent = isDark ? "🌙" : "☀️";
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? "Activar modo claro" : "Activar modo oscuro"
  );
}