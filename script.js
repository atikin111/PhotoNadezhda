const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".card");
const bookingForm = document.querySelector("#booking-form");
const formSuccessMessage = document.querySelector("#form-success");

// Фильтруем карточки галереи по выбранной категории.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    galleryItems.forEach((card) => {
      const cardCategory = card.dataset.category;
      const isVisible =
        selectedCategory === "all" || selectedCategory === cardCategory;

      card.classList.toggle("is-hidden", !isVisible);
    });
  });
});

// Обрабатываем отправку формы без перезагрузки страницы.
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();
  formSuccessMessage.textContent = "";

  const bookingData = getBookingFormData();
  const errors = validateBooking(bookingData);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  saveBooking(bookingData);
  bookingForm.reset();
  formSuccessMessage.textContent =
    "Заявка сохранена. Для V1 она хранится в браузере пользователя.";
});

function getBookingFormData() {
  const formData = new FormData(bookingForm);

  return {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    shootType: formData.get("shootType").trim(),
    createdAt: new Date().toLocaleString("ru-RU"),
  };
}

// Проверяем, что пользователь заполнил обязательные поля корректно.
function validateBooking(bookingData) {
  const errors = {};
  const phoneDigits = bookingData.phone.replace(/\D/g, "");

  if (bookingData.name.length < 2) {
    errors.name = "Введите имя минимум из 2 символов.";
  }

  if (phoneDigits.length < 10) {
    errors.phone = "Введите корректный номер телефона.";
  }

  if (!bookingData.shootType) {
    errors.shootType = "Выбери тип съемки.";
  }

  return errors;
}

// Показываем сообщение под конкретным полем формы.
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

// Очищаем старые ошибки перед новой проверкой формы.
function clearErrors() {
  document
    .querySelectorAll(".form__error")
    .forEach((element) => (element.textContent = ""));
}

function saveBooking(bookingData) {
  // localStorage дает минимально рабочее хранение без сервера.
  const storageKey = "photoNadezhdaBookings";
  const savedBookings =
    JSON.parse(localStorage.getItem(storageKey) || "[]");

  savedBookings.push(bookingData);
  localStorage.setItem(storageKey, JSON.stringify(savedBookings));
}
