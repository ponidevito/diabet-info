// Custom scripts

//burger js

let burgerMenu = document.querySelector(".menu__icon");
let menuBody = document.querySelector(".menu__body");
function burger() {
  let isOpen = burgerMenu.classList.toggle("_active");
  document.body.classList.toggle("_lock");
  menuBody.classList.toggle("_active");
  burgerMenu.setAttribute("aria-expanded", String(isOpen));
  burgerMenu.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
}
burgerMenu.addEventListener("click", burger);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && burgerMenu.classList.contains("_active")) {
    burger();
    burgerMenu.focus();
  }
});

let html = document.querySelector("html");

// submenu (dropdown) — nav has several independent dropdowns
let subs = document.querySelectorAll(".menu__item.sub");

function closeAllSubmenus(except) {
  subs.forEach((subItem) => {
    if (subItem === except) return;
    let trigger = subItem.querySelector(".menu__linkSub");
    subItem.querySelector(".submenu").classList.remove("_active");
    subItem.querySelector(".menu__item-svg").classList.remove("_active");
    subItem.querySelector(".menu__link-svg").classList.remove("_active");
    trigger.classList.remove("_activeArrow");
    trigger.setAttribute("aria-expanded", "false");
  });
}

subs.forEach((subItem) => {
  let trigger = subItem.querySelector(".menu__linkSub");

  trigger.addEventListener("click", function (e) {
    let submenuEl = subItem.querySelector(".submenu");
    let isActive = submenuEl.classList.contains("_active");
    closeAllSubmenus(subItem);
    submenuEl.classList.toggle("_active", !isActive);
    subItem.querySelector(".menu__item-svg").classList.toggle("_active", !isActive);
    subItem.querySelector(".menu__link-svg").classList.toggle("_active", !isActive);
    trigger.classList.toggle("_activeArrow", !isActive);
    trigger.setAttribute("aria-expanded", String(!isActive));
    e.stopPropagation();
  });

  subItem.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllSubmenus();
      trigger.focus();
    }
  });
});

// click outside — close dropdowns and calculator hints
html.addEventListener("click", function (e) {
  closeAllSubmenus();
  let carbonHint = document.querySelector(".form__modal-carbon");
  let carbonHintSecond = document.querySelector(".form__modal-carbon-second");
  if (carbonHint) carbonHint.classList.remove("_active");
  if (carbonHintSecond) carbonHintSecond.classList.remove("_active");
});

// highlight the current page in navigation for assistive tech (aria-current)
(function markCurrentPage() {
  let currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu__link[href], .submenu__link[href], .footer__link[href]").forEach((link) => {
    let linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });
})();

// calculator

if (document.querySelector(".section__calculator")) {
  let btnResult = document.querySelector(".form__resultBtn");
  let btnXo = document.querySelectorAll(".form-btn");
  let result = document.querySelector(".form__result");
  let btn1 = document.querySelector(".form__btn1");
  let btn2 = document.querySelector(".form__btn2");
  let selectedXo = null;

  let form = document.forms["form"];
  let carbohydrates = form.carbohydrates;
  let totalWeight = form.totalWeight;

  function addInfo() {
    btnXo.forEach((item) => {
      item.addEventListener("click", (event) => {
        btnXo.forEach((btn) => {
          btn.style.backgroundColor = "rgb(228, 245, 243)";
          btn.style.color = "";
          btn.setAttribute("aria-pressed", "false");
        });
        item.style.backgroundColor = "rgb(205, 56, 29)";
        item.style.color = "rgb(255, 255, 255)";
        item.setAttribute("aria-pressed", "true");
        selectedXo = parseFloat(item.value);
        result.textContent = "";
        event.preventDefault();
      });
    });
  }
  addInfo();

  function calculate(event) {
    event.preventDefault();

    const carbValue = parseFloat(carbohydrates.value);
    const totalWeightValue = parseFloat(totalWeight.value);

    if (
      !selectedXo ||
      isNaN(carbValue) ||
      isNaN(totalWeightValue) ||
      carbValue === 0 ||
      totalWeightValue === 0
    ) {
      result.textContent = "Помилка: перевірте введені дані";
      return;
    }

    const summa = (carbValue / selectedXo) * totalWeightValue;

    if (!isFinite(summa)) {
      result.textContent = "Помилка: неможливо порахувати";
      return;
    }

    result.textContent = `${(summa / 100).toFixed(2)} хо`;
    resetAll();
    carbohydrates.style.border = "1px solid rgb(124, 231, 241)";
  }
  btnResult.addEventListener("click", calculate);

  function resetAll() {
    carbohydrates.value = "";
    totalWeight.value = "";
    btnXo.forEach((item) => {
      item.style.backgroundColor = "rgb(228, 245, 243)";
      item.style.color = "";
      item.setAttribute("aria-pressed", "false");
    });
    btnResult.setAttribute("disabled", "");
    selectedXo = null;
  }

  let carbonRegExp = /^[0-9]{1,20}$/;
  carbohydrates.oninput = () => {
    let loginValid = carbonRegExp.test(carbohydrates.value);
    if (loginValid) {
      carbohydrates.style.border = "1px solid rgb(124, 231, 241)";
      carbohydrates.setAttribute("aria-invalid", "false");

      if (carbohydrates.value > 100) {
        document.querySelector(".form__modal-carbon").classList.add("_active");
        carbohydrates.setAttribute("aria-invalid", "true");
      } else if (carbohydrates.value < 1) {
        document.querySelector(".form__modal-carbon-second").classList.add("_active");
        carbohydrates.setAttribute("aria-invalid", "true");
      } else {
        document.querySelector(".form__modal-carbon").classList.remove("_active");
        document.querySelector(".form__modal-carbon-second").classList.remove("_active");
      }
    } else {
      carbohydrates.style.border = "1px solid red";
      carbohydrates.setAttribute("aria-invalid", "true");
    }
  };

  let totalRegExp = /^[0-9]{2,20}$/;
  totalWeight.oninput = () => {
    let loginValid = totalRegExp.test(totalWeight.value);
    if (loginValid) {
      totalWeight.style.border = "1px solid rgb(124, 231, 241)";
      totalWeight.setAttribute("aria-invalid", "false");
    } else {
      totalWeight.style.border = "1px solid red";
      totalWeight.setAttribute("aria-invalid", "true");
    }
  };

  const checking = () =>
    (btnResult.disabled =
      carbohydrates.value.length < 1 ||
      carbohydrates.value > 100 ||
      carbohydrates.value < 1 ||
      totalWeight.value.length < 2 ||
      !selectedXo);

  carbohydrates.addEventListener("input", checking);
  totalWeight.addEventListener("input", checking);
  btn1.addEventListener("click", checking);
  btn2.addEventListener("click", checking);
}

// share bar
document.querySelectorAll(".share-bar__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let type = btn.dataset.share;
    let url = encodeURIComponent(window.location.href);
    let title = encodeURIComponent(document.title);
    let shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${title}`,
      viber: `viber://forward?text=${title}%20${url}`,
    };
    if (type === "copy") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        let original = btn.textContent;
        btn.classList.add("_copied");
        btn.textContent = "Посилання скопійовано!";
        setTimeout(() => {
          btn.classList.remove("_copied");
          btn.textContent = original;
        }, 2000);
      });
    } else if (shareLinks[type]) {
      window.open(shareLinks[type], "_blank", "noopener,noreferrer");
    }
  });
});
