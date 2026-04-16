const filterButtons = document.querySelectorAll(".filter-button");
const galleryCards = document.querySelectorAll(".card");
const bookingForm = document.querySelector("#booking-form");
const successMessage = document.querySelector("#form-success");

// Простая фильтрация по data-атрибуту карточки.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    galleryCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const shouldShow =
        selectedFilter === "all" || selectedFilter === cardCategory;

      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const booking = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    shootType: formData.get("shootType").trim(),
    createdAt: new Date().toLocaleString("ru-RU"),
  };

  clearErrors();
  successMessage.textContent = "";

  const errors = validateBooking(booking);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  saveBooking(booking);
  bookingForm.reset();
  successMessage.textContent =
    "Заявка сохранена. Для V1 она хранится в браузере пользователя.";
});

function validateBooking(booking) {
  const errors = {};
  const phoneDigits = booking.phone.replace(/\D/g, "");

  if (booking.name.length < 2) {
    errors.name = "Введите имя минимум из 2 символов.";
  }

  if (phoneDigits.length < 10) {
    errors.phone = "Введите корректный номер телефона.";
  }

  if (!booking.shootType) {
    errors.shootType = "Выберите тип съемки.";
  }

  return errors;
}

function showErrors(errors) {
  Object.entries(errors).forEach(([fieldName, message]) => {
    const errorElement = document.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (errorElement) {
      errorElement.textContent = message;
    }
  });
}

function clearErrors() {
  document
    .querySelectorAll(".form__error")
    .forEach((element) => (element.textContent = ""));
}

function saveBooking(booking) {
  // localStorage дает минимально рабочее хранение без сервера.
  const storageKey = "photoNadezhdaBookings";
  const existingBookings =
    JSON.parse(localStorage.getItem(storageKey) || "[]");

  existingBookings.push(booking);
  localStorage.setItem(storageKey, JSON.stringify(existingBookings));
}
