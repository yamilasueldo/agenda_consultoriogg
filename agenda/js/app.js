const state = {
  currentView: "dashboard",
  currentDate: new Date(),
  appointments: [],
  patients: [],
  historyRecords: [],
  selectedPatient: null,
  user: null,
};

const views = {
  dashboard: document.getElementById("dashboardView"),
  calendar: document.getElementById("calendarView"),
  week: document.getElementById("weekView"),
  patients: document.getElementById("patientsView"),
};

const pageTitle = document.getElementById("pageTitle");
const sessionEmail = document.getElementById("sessionEmail");
const logoutBtn = document.getElementById("logoutBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const statToday = document.getElementById("statToday");
const statConfirmed = document.getElementById("statConfirmed");
const statPending = document.getElementById("statPending");
const statCancelled = document.getElementById("statCancelled");

const todayAppointments = document.getElementById("todayAppointments");
const upcomingAppointments = document.getElementById("upcomingAppointments");
const patientsList = document.getElementById("patientsList");

const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const weekSchedule = document.getElementById("weekSchedule");
const weekRangeLabel = document.getElementById("weekRangeLabel");
const todayDateLabel = document.getElementById("todayDateLabel");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const professionalFilter = document.getElementById("professionalFilter");

const modal = document.getElementById("appointmentModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const clearFormBtn = document.getElementById("clearFormBtn");

const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const calendarTodayBtn = document.getElementById("calendarTodayBtn");

const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const weekTodayBtn = document.getElementById("weekTodayBtn");

const form = document.getElementById("appointmentForm");
const modalTitle = document.getElementById("modalTitle");
const saveBtn = document.getElementById("saveBtn");

const editingIdInput = document.getElementById("editingId");
const patientNameInput = document.getElementById("patientName");
const useRegisteredPatientInput = document.getElementById("useRegisteredPatient");
const patientSelectWrapper = document.getElementById("patientSelectWrapper");
const patientSelect = document.getElementById("patientSelect");

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const professionalInput = document.getElementById("professional");
const statusInput = document.getElementById("status");
const treatmentInput = document.getElementById("treatment");
const notesInput = document.getElementById("notes");

const patientSearchInput = document.getElementById("patientSearchInput");

const historyModal = document.getElementById("historyModal");
const historyModalBackdrop = document.getElementById("historyModalBackdrop");
const closeHistoryModalBtn = document.getElementById("closeHistoryModalBtn");
const historyModalTitle = document.getElementById("historyModalTitle");
const historyPatientSummary = document.getElementById("historyPatientSummary");
const historyCommentInput = document.getElementById("historyCommentInput");
const saveHistoryCommentBtn = document.getElementById("saveHistoryCommentBtn");
const historyCommentsList = document.getElementById("historyCommentsList");

const patientModal = document.getElementById("patientModal");
const patientModalBackdrop = document.getElementById("patientModalBackdrop");
const closePatientModalBtn = document.getElementById("closePatientModalBtn");
const cancelPatientBtn = document.getElementById("cancelPatientBtn");
const patientForm = document.getElementById("patientForm");
const editingPatientId = document.getElementById("editingPatientId");
const patientModalTitle = document.getElementById("patientModalTitle");
const patientFullNameInput = document.getElementById("patientFullNameInput");
const patientDniInput = document.getElementById("patientDniInput");
const patientPhoneInput = document.getElementById("patientPhoneInput");
const newPatientBtn = document.getElementById("newPatientBtn");

document.addEventListener("DOMContentLoaded", async () => {
  const ok = await checkSession();
  if (!ok) return;

  loadTheme();
  setupDefaults();
  bindEvents();
  await loadPatients();
  await loadAppointments();
  renderPatientSelect();
  renderAll();
});

async function checkSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.href = "index.html";
    return false;
  }

  state.user = data.session.user;
  sessionEmail.textContent = state.user.email || "Usuario autenticado";
  return true;
}

function setupDefaults() {
  dateInput.value = getTodayISO();
  timeInput.value = "09:00";
  statusInput.value = "confirmed";
  professionalInput.value = "Ambos";
  todayDateLabel.textContent = formatLongDate(getTodayISO());
  togglePatientMode();
}

function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      switchView(btn.dataset.view);
    });
  });

    themeToggleBtn.addEventListener("click", toggleTheme);

    openModalBtn.addEventListener("click", openNewModal);
    closeModalBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    clearFormBtn.addEventListener("click", resetForm);
    patientSearchInput.addEventListener("input", renderPatients);

    patientModalBackdrop.addEventListener("click", closePatientModal);
    closePatientModalBtn.addEventListener("click", closePatientModal);
    cancelPatientBtn.addEventListener("click", closePatientModal);
    patientForm.addEventListener("submit", handlePatientSubmit);
    newPatientBtn.addEventListener("click", openNewPatientModal)

    historyModalBackdrop.addEventListener("click", closeHistoryModal);
    closeHistoryModalBtn.addEventListener("click", closeHistoryModal);
    saveHistoryCommentBtn.addEventListener("click", saveHistoryComment);

    useRegisteredPatientInput.addEventListener("change", togglePatientMode);

  prevMonthBtn.addEventListener("click", () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  calendarTodayBtn.addEventListener("click", () => {
    state.currentDate = new Date();
    renderCalendar();
  });

  prevWeekBtn.addEventListener("click", () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth(),
      state.currentDate.getDate() - 7
    );
    renderWeek();
  });

  nextWeekBtn.addEventListener("click", () => {
    state.currentDate = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth(),
      state.currentDate.getDate() + 7
    );
    renderWeek();
  });

  weekTodayBtn.addEventListener("click", () => {
    state.currentDate = new Date();
    renderWeek();
  });

  searchInput.addEventListener("input", renderCalendar);
  statusFilter.addEventListener("change", renderCalendar);
  professionalFilter.addEventListener("change", renderCalendar);

  logoutBtn.addEventListener("click", logout);
  form.addEventListener("submit", handleFormSubmit);
}

async function loadPatients() {
  const { data, error } = await supabaseClient
    .from("pacientes")
    .select("*")
    .order("paciente_nombrecompleto", { ascending: true });

  if (error) {
    console.error("Error al cargar pacientes:", error);
    alert("No se pudieron cargar los pacientes.");
    return;
  }

  state.patients = data || [];
}

async function loadAppointments() {
  const { data, error } = await supabaseClient
    .from("turnos")
    .select(`
      *,
      pacientes (
        paciente_id,
        paciente_nombrecompleto,
        paciente_dni,
        paciente_telefono
      )
    `)
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) {
    alert("No se pudieron cargar los turnos.");
    console.error(error);
    return;
  }

  state.appointments = data || [];
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

function switchView(viewName) {
  state.currentView = viewName;

  Object.values(views).forEach((view) => view.classList.remove("active-view"));
  views[viewName].classList.add("active-view");

  const titles = {
    dashboard: "Resumen general",
    calendar: "Calendario mensual",
    week: "Agenda semanal",
    patients: "Pacientes",
  };

  pageTitle.textContent = titles[viewName];

  if (viewName === "dashboard") {
    renderStats();
    renderDashboard();
  } else if (viewName === "calendar") {
    renderCalendar();
  } else if (viewName === "week") {
    renderWeek();
  } else if (viewName === "patients") {
    renderPatients();
  }
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function formatLongDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateString) {
  const [, month, day] = dateString.split("-");
  return `${day}/${month}`;
}

function statusLabel(status) {
  return {
    confirmed: "Confirmado",
    pending: "Pendiente",
    cancelled: "Cancelado",
  }[status] || "Sin estado";
}

function sortAppointments(items) {
  return [...items].sort((a, b) => {
    const aDate = new Date(`${a.fecha}T${a.hora || "00:00"}`);
    const bDate = new Date(`${b.fecha}T${b.hora || "00:00"}`);
    return aDate - bDate;
  });
}

function renderAll() {
  renderStats();
  renderDashboard();
  renderCalendar();
  renderWeek();
  renderPatients();
}

function renderStats() {
  const items = state.appointments;
  const today = getTodayISO();

  statToday.textContent = items.filter((i) => i.fecha === today).length;
  statConfirmed.textContent = items.filter((i) => i.estado === "confirmed").length;
  statPending.textContent = items.filter((i) => i.estado === "pending").length;
  statCancelled.textContent = items.filter((i) => i.estado === "cancelled").length;
}

function renderDashboard() {
  const items = sortAppointments(state.appointments);
  const today = getTodayISO();
  const now = new Date();

  const todayItems = items.filter((i) => i.fecha === today);

  const upcomingItems = items
    .filter((i) => new Date(`${i.fecha}T${i.hora || "00:00"}`) >= now)
    .slice(0, 8);

  todayAppointments.innerHTML = renderAppointmentList(todayItems, "No hay turnos cargados para hoy.");
  upcomingAppointments.innerHTML = renderAppointmentList(upcomingItems, "No hay próximos turnos.");
}

function renderAppointmentList(items, emptyMessage) {
  if (!items.length) {
    return `<div class="empty-state">${emptyMessage}</div>`;
  }

  return items.map((item) => `
    <article class="appointment-card">
      <div class="card-time">
        ${formatShortDate(item.fecha)}
        <span class="hour">${escapeHtml(item.hora || "--:--")}</span>
      </div>

      <div class="card-main">
        <h4>${escapeHtml(item.pacientes?.paciente_nombrecompleto || "Paciente sin nombre")}</h4>
        <p><strong>Profesional:</strong> ${escapeHtml(item.profesional || "No definido")}</p>
        <p><strong>Tratamiento:</strong> ${escapeHtml(item.tratamiento || "Sin especificar")}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(item.pacientes?.paciente_telefono || "No cargado")}</p>
        <p><strong>Notas:</strong> ${escapeHtml(item.notas || "Sin notas")}</p>
      </div>

      <div class="card-actions">
        <span class="badge ${item.estado}">${statusLabel(item.estado)}</span>
        <button class="small-btn edit" onclick="editAppointment('${item.turno_id}')">Editar</button>
        <button class="small-btn delete" onclick="deleteAppointment('${item.turno_id}')">Eliminar</button>
      </div>
    </article>
  `).join("");
}

function getFilteredAppointments() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedProfessional = professionalFilter.value;

  return state.appointments.filter((item) => {
    const searchable = [
      item.pacientes?.paciente_nombrecompleto,
      item.pacientes?.paciente_dni,
      item.pacientes?.paciente_telefono,
      item.tratamiento,
      item.notas,
      item.profesional,
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || searchable.includes(query);
    const matchesStatus = !selectedStatus || item.estado === selectedStatus;
    const matchesProfessional = !selectedProfessional || item.profesional === selectedProfessional;

    return matchesQuery && matchesStatus && matchesProfessional;
  });
}

function renderCalendar() {
  const currentYear = state.currentDate.getFullYear();
  const currentMonth = state.currentDate.getMonth();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

  calendarTitle.textContent = state.currentDate.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  const appointments = getFilteredAppointments();
  const today = getTodayISO();

  let html = "";

  for (let i = firstWeekday - 1; i >= 0; i--) {
    html += `
      <div class="calendar-day muted">
        <div class="day-number">${prevMonthLastDay - i}</div>
      </div>
    `;
  }

  for (let day = 1; day <= totalDays; day++) {
    const monthString = String(currentMonth + 1).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    const dateISO = `${currentYear}-${monthString}-${dayString}`;

    const dayAppointments = appointments.filter((item) => item.fecha === dateISO);
    const events = dayAppointments
      .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""))
      .slice(0, 3);

    const extraCount = dayAppointments.length - events.length;

    html += `
      <div class="calendar-day ${dateISO === today ? "today" : ""}">
        <div class="day-number">${day}</div>
        <div class="day-events">
          ${events.map((event) => `
            <div class="day-event ${event.estado}" title="${escapeHtml(`${event.pacientes?.paciente_nombrecompleto || ""} - ${event.tratamiento || ""}`)}">
              ${escapeHtml(event.hora || "--:--")} · ${escapeHtml(event.pacientes?.paciente_nombrecompleto || "Paciente")}
            </div>
          `).join("")}
          ${extraCount > 0 ? `<div class="day-event confirmed">+${extraCount} más</div>` : ""}
        </div>
      </div>
    `;
  }

  const filledCells = firstWeekday + totalDays;
  const remaining = (7 - (filledCells % 7)) % 7;

  for (let i = 1; i <= remaining; i++) {
    html += `
      <div class="calendar-day muted">
        <div class="day-number">${i}</div>
      </div>
    `;
  }

  calendarGrid.innerHTML = html;
}

function renderWeek() {
  const referenceDate = new Date(state.currentDate);
  const dayOfWeek = (referenceDate.getDay() + 6) % 7;
  referenceDate.setDate(referenceDate.getDate() - dayOfWeek);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(referenceDate);
    d.setDate(referenceDate.getDate() + i);
    weekDates.push(d);
  }

  weekRangeLabel.textContent = `${weekDates[0].toLocaleDateString("es-AR")} - ${weekDates[6].toLocaleDateString("es-AR")}`;

  const appointments = sortAppointments(state.appointments);

  weekSchedule.innerHTML = weekDates.map((dateObj) => {
    const iso = toISODate(dateObj);
    const items = appointments.filter((a) => a.fecha === iso);

    return `
      <article class="week-day-card">
        <h4>${dateObj.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</h4>
        ${renderAppointmentList(items, "Sin turnos para este día.")}
      </article>
    `;
  }).join("");
}

function renderPatients() {
  const query = (patientSearchInput?.value || "").trim().toLowerCase();

  const patients = [...state.patients]
    .filter((patient) => {
      const searchable = [
        patient.paciente_nombrecompleto,
        patient.paciente_dni,
        patient.paciente_telefono,
      ]
        .join(" ")
        .toLowerCase();

      return !query || searchable.includes(query);
    })
    .sort((a, b) =>
      (a.paciente_nombrecompleto || "").localeCompare(b.paciente_nombrecompleto || "")
    );

  if (!patients.length) {
    patientsList.innerHTML = `<div class="empty-state">No hay pacientes para mostrar.</div>`;
    return;
  }

  patientsList.innerHTML = patients
    .map(
      (patient) => `
        <article class="patient-card">
          <div class="patient-avatar">${getPatientInitials(patient.paciente_nombrecompleto)}</div>

          <div class="patient-info">
            <h4>${escapeHtml(patient.paciente_nombrecompleto || "")}</h4>
            <p><strong>DNI:</strong> ${escapeHtml(patient.paciente_dni || "No cargado")}</p>
            <p><strong>Teléfono:</strong> ${escapeHtml(patient.paciente_telefono || "No cargado")}</p>

            <div class="patient-actions">
              <button
                type="button"
                class="small-btn edit"
                onclick="openHistoryModal('${patient.paciente_id}')"
              >
                Ver historia clínica
              </button>

              <button
                type="button"
                class="small-btn edit"
                onclick="openPatientModal('${patient.paciente_id}')"
              >
                Editar paciente
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPatientSelect() {
  if (!patientSelect) return;

  patientSelect.innerHTML = `
    <option value="">Seleccionar paciente</option>
    ${state.patients
      .map(
        (patient) => `
          <option value="${patient.paciente_id}">
            ${escapeHtml(patient.paciente_nombrecompleto)}
            ${patient.paciente_dni ? ` - DNI ${escapeHtml(patient.paciente_dni)}` : ""}
          </option>
        `
      )
      .join("")}
  `;
}

function togglePatientMode() {
  const useRegistered = useRegisteredPatientInput.checked;

  if (useRegistered) {
    patientSelectWrapper.classList.remove("hidden");
    patientSelect.required = true;
    patientNameInput.required = false;
    patientNameInput.disabled = true;
  } else {
    patientSelectWrapper.classList.add("hidden");
    patientSelect.required = false;
    patientSelect.value = "";
    patientNameInput.required = true;
    patientNameInput.disabled = false;
  }
}

async function getOrCreatePatient() {
  if (useRegisteredPatientInput.checked) {
    const selectedId = patientSelect.value;

    if (!selectedId) {
      throw new Error("Seleccioná un paciente registrado.");
    }

    const selectedPatient = state.patients.find(
      (p) => String(p.paciente_id) === String(selectedId)
    );

    if (!selectedPatient) {
      throw new Error("No se encontró el paciente seleccionado.");
    }

    return selectedPatient;
  }

  const patientName = patientNameInput.value.trim();

  if (!patientName) {
    throw new Error("Ingresá el nombre completo del paciente.");
  }

  const existingPatient = state.patients.find(
    (p) =>
      (p.paciente_nombrecompleto || "").trim().toLowerCase() === patientName.toLowerCase()
  );

  if (existingPatient) {
    return existingPatient;
  }

  const { data, error } = await supabaseClient
    .from("pacientes")
    .insert({
      user_id: state.user.id,
      paciente_nombrecompleto: patientName,
      paciente_dni: null,
      paciente_telefono: null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear paciente:", error);
    throw new Error(error.message || "No se pudo crear el paciente.");
  }

  await loadPatients();
  renderPatientSelect();

  return data;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  try {
    const editingId = editingIdInput.value;
    const patient = await getOrCreatePatient();

    const payload = {
      user_id: state.user.id,
      paciente_id: patient.paciente_id,
      fecha: dateInput.value,
      hora: timeInput.value,
      profesional: professionalInput.value,
      estado: statusInput.value,
      tratamiento: treatmentInput.value.trim(),
      notas: notesInput.value.trim(),
    };

    if (!payload.paciente_id || !payload.fecha || !payload.hora) {
      alert("Completá al menos paciente, fecha y hora.");
      return;
    }

    let result;

    if (editingId) {
      result = await supabaseClient
        .from("turnos")
        .update(payload)
        .eq("turno_id", editingId);
    } else {
      result = await supabaseClient
        .from("turnos")
        .insert(payload);
    }

    if (result.error) {
      console.error("ERROR AL GUARDAR:", result.error);
      alert("No se pudo guardar el turno:\n" + (result.error.message || "Error desconocido"));
      return;
    }

    await loadPatients();
    await loadAppointments();
    renderPatientSelect();
    resetForm();
    closeModal();
    renderAll();
  } catch (err) {
    console.error(err);
    alert(err.message || "Ocurrió un error al guardar el turno.");
  }
}

function openNewModal() {
  resetForm();
  modalTitle.textContent = "Nuevo turno";
  saveBtn.textContent = "Guardar turno";
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function resetForm() {
  form.reset();
  editingIdInput.value = "";
  modalTitle.textContent = "Nuevo turno";
  saveBtn.textContent = "Guardar turno";

  patientNameInput.value = "";
  useRegisteredPatientInput.checked = false;
  patientSelect.value = "";

  dateInput.value = getTodayISO();
  timeInput.value = "09:00";
  professionalInput.value = "Ambos";
  statusInput.value = "confirmed";

  togglePatientMode();
}

function editAppointment(id) {
  const appointment = state.appointments.find(
    (item) => String(item.turno_id) === String(id)
  );
  if (!appointment) return;

  editingIdInput.value = appointment.turno_id;

  useRegisteredPatientInput.checked = true;
  togglePatientMode();
  patientSelect.value = String(appointment.paciente_id || "");
  patientNameInput.value = appointment.pacientes?.paciente_nombrecompleto || "";

  dateInput.value = appointment.fecha || "";
  timeInput.value = appointment.hora || "";
  professionalInput.value = appointment.profesional || "Ambos";
  statusInput.value = appointment.estado || "confirmed";
  treatmentInput.value = appointment.tratamiento || "";
  notesInput.value = appointment.notas || "";

  modalTitle.textContent = "Editar turno";
  saveBtn.textContent = "Actualizar turno";
  modal.classList.remove("hidden");
}

async function deleteAppointment(id) {
  const confirmDelete = confirm("¿Querés eliminar este turno?");
  if (!confirmDelete) return;

  const { error } = await supabaseClient
    .from("turnos")
    .delete()
    .eq("turno_id", id);

  if (error) {
    alert("No se pudo eliminar el turno.");
    console.error(error);
    return;
  }

  await loadAppointments();
  renderAll();
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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




async function loadHistoryRecords(patientId) {
  const { data, error } = await supabaseClient
    .from("historiaclinica")
    .select("*")
    .eq("paciente_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar historia clínica:", error);
    alert("No se pudo cargar la historia clínica.");
    return;
  }

  state.historyRecords = data || [];
}

async function openHistoryModal(patientId) {
  const patient = state.patients.find(
    (p) => String(p.paciente_id) === String(patientId)
  );

  if (!patient) {
    alert("No se encontró el paciente.");
    return;
  }

  state.selectedPatient = patient;
  historyModalTitle.textContent = `Historia clínica de ${patient.paciente_nombrecompleto || ""}`;

  historyPatientSummary.innerHTML = `
    <p><strong>Nombre:</strong> ${escapeHtml(patient.paciente_nombrecompleto || "")}</p>
    <p><strong>DNI:</strong> ${escapeHtml(patient.paciente_dni || "No cargado")}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(patient.paciente_telefono || "No cargado")}</p>
  `;

  historyCommentInput.value = "";

  await loadHistoryRecords(patient.paciente_id);
  renderHistoryComments();

  historyModal.classList.remove("hidden");
}

function closeHistoryModal() {
  historyModal.classList.add("hidden");
  state.selectedPatient = null;
  state.historyRecords = [];
  historyCommentInput.value = "";
}

function renderHistoryComments() {
  if (!state.historyRecords.length) {
    historyCommentsList.innerHTML = `
      <div class="empty-state">Todavía no hay comentarios cargados en la historia clínica.</div>
    `;
    return;
  }

  historyCommentsList.innerHTML = state.historyRecords
    .map(
      (item) => `
        <article class="history-item">
          <span class="history-item-date">${formatDateTime(item.created_at)}</span>
          <p>${escapeHtml(item.historiaclinica_comentario || "")}</p>
        </article>
      `
    )
    .join("");
}

async function saveHistoryComment() {
  try {
    if (!state.selectedPatient) {
      alert("No hay un paciente seleccionado.");
      return;
    }

    const comment = historyCommentInput.value.trim();

    if (!comment) {
      alert("Escribí un comentario para guardar.");
      return;
    }

    const { error } = await supabaseClient
      .from("historiaclinica")
      .insert({
        user_id: state.user.id,
        paciente_id: state.selectedPatient.paciente_id,
        historiaclinica_comentario: comment,
      });

    if (error) {
      console.error("Error al guardar comentario:", error);
      alert("No se pudo guardar el comentario.");
      return;
    }

    historyCommentInput.value = "";
    await loadHistoryRecords(state.selectedPatient.paciente_id);
    renderHistoryComments();
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error al guardar el comentario.");
  }
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPatientInitials(name) {
  const safeName = (name || "").trim();
  if (!safeName) return "P";

  const parts = safeName.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");

  return initials || "P";
}

function openPatientModal(patientId) {
  const patient = state.patients.find(
    (p) => String(p.paciente_id) === String(patientId)
  );

  if (!patient) {
    alert("No se encontró el paciente.");
    return;
  }

  editingPatientId.value = patient.paciente_id;
  patientModalTitle.textContent = "Editar paciente";
  patientFullNameInput.value = patient.paciente_nombrecompleto || "";
  patientDniInput.value = patient.paciente_dni || "";
  patientPhoneInput.value = patient.paciente_telefono || "";

  patientModal.classList.remove("hidden");
}

function closePatientModal() {
  patientModal.classList.add("hidden");
  editingPatientId.value = "";
  patientFullNameInput.value = "";
  patientDniInput.value = "";
  patientPhoneInput.value = "";
}

async function handlePatientSubmit(e) {
  e.preventDefault();

  const patientId = editingPatientId.value;

  const payload = {
    user_id: state.user.id,
    paciente_nombrecompleto: patientFullNameInput.value.trim(),
    paciente_dni: patientDniInput.value.trim() || null,
    paciente_telefono: patientPhoneInput.value.trim() || null,
  };

  if (!payload.paciente_nombrecompleto) {
    alert("El nombre completo es obligatorio.");
    return;
  }

  let result;

  if (patientId) {
    result = await supabaseClient
      .from("pacientes")
      .update({
        paciente_nombrecompleto: payload.paciente_nombrecompleto,
        paciente_dni: payload.paciente_dni,
        paciente_telefono: payload.paciente_telefono,
      })
      .eq("paciente_id", patientId);
  } else {
    result = await supabaseClient
      .from("pacientes")
      .insert(payload);
  }

  if (result.error) {
    console.error("Error al guardar paciente:", result.error);
    alert("No se pudo guardar el paciente.");
    return;
  }

  await loadPatients();
  await loadAppointments();
  renderPatientSelect();
  renderPatients();

  if (
    patientId &&
    state.selectedPatient &&
    String(state.selectedPatient.paciente_id) === String(patientId)
  ) {
    state.selectedPatient = state.patients.find(
      (p) => String(p.paciente_id) === String(patientId)
    );
  }

  closePatientModal();
}


function openNewPatientModal() {
  editingPatientId.value = "";
  patientModalTitle.textContent = "Nuevo paciente";
  patientFullNameInput.value = "";
  patientDniInput.value = "";
  patientPhoneInput.value = "";

  patientModal.classList.remove("hidden");
}


window.editAppointment = editAppointment;
window.deleteAppointment = deleteAppointment;
window.openHistoryModal = openHistoryModal;
window.openPatientModal = openPatientModal;