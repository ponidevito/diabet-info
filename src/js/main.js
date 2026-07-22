// Custom scripts

const lins = document.getElementsByClassName("menu__item a");

//burger js

let burgerMenu = document.querySelector(".menu__icon");
function burger() {
  burgerMenu.classList.toggle("_active");
  document.body.classList.toggle("_lock");
  document.querySelector(".menu__body").classList.toggle("_active");
}
burgerMenu.addEventListener("click", burger);

let html = document.querySelector("html");

// submenu (dropdown) — nav has several independent dropdowns
let subs = document.querySelectorAll(".menu__item.sub");

function closeAllSubmenus(except) {
  subs.forEach((subItem) => {
    if (subItem === except) return;
    subItem.querySelector(".submenu").classList.remove("_active");
    subItem.querySelector(".menu__item-svg").classList.remove("_active");
    subItem.querySelector(".menu__link-svg").classList.remove("_active");
    subItem.querySelector(".menu__linkSub").classList.remove("_activeArrow");
  });
}

subs.forEach((subItem) => {
  subItem.addEventListener("click", function (e) {
    let submenuEl = subItem.querySelector(".submenu");
    let isActive = submenuEl.classList.contains("_active");
    closeAllSubmenus(subItem);
    submenuEl.classList.toggle("_active", !isActive);
    subItem.querySelector(".menu__item-svg").classList.toggle("_active", !isActive);
    subItem.querySelector(".menu__link-svg").classList.toggle("_active", !isActive);
    subItem.querySelector(".menu__linkSub").classList.toggle("_activeArrow", !isActive);
    e.stopPropagation();
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

// calculator

if (document.querySelector(".section__calculator")) {
  let btnResult = document.querySelector(".form__resultBtn");
  let btnXo = document.querySelectorAll(".form-btn");
  let result = document.querySelector(".form__result");
  let btn1 = document.querySelector(".form__btn1");
  let btn2 = document.querySelector(".form__btn2");
  let massive = [];
  let mass = [];
  let xo = [];
  let number = [];

  let form = document.forms["form"];
  let carbohydrates = form.carbohydrates;
  let totalWeight = form.totalWeight;

  function addInfo(e) {
    btnXo.forEach((item) => {
      item.addEventListener("click", () => {
        btnXo.forEach((item) => {
          item.style.backgroundColor = "rgb(228, 245, 243)";
        });
        item.style.backgroundColor = "rgb(255, 111, 89)";
        xo.push(item.value);
        result.innerHTML = "";
        event.preventDefault();
      });
    });
    return true;
  }
  addInfo();

  if (document.querySelector(".section__calculator")) {
  }

  function check() {
    mass.push(carbohydrates.value);
    number.push(totalWeight.value);

    let sum = (mass / xo) * number;
    massive.push(sum);
    let a = Array.from(massive.toString(), Number);
    let finalSum = a.join("");
    let summa = parseFloat(finalSum);

    result.textContent += `${summa.toFixed(2) / 100} хо `;

    event.preventDefault();
    resetAll();
    return true;
  }
  btnResult.addEventListener("click", check);

  function resetAll() {
    carbohydrates.value = "";
    totalWeight.value = "";
    btnXo.forEach((item) => {
      item.style.backgroundColor = "rgb(228, 245, 243)";
      btnResult.setAttribute("disabled", "");
    });
    massive = [];
    mass = [];
    xo = [];
    number = [];
    return true;
  }

  let carbonRegExp = /^[0-9]{1,20}$/;
  carbohydrates.oninput = () => {
    let loginValid = carbonRegExp.test(carbohydrates.value);
    console.log(loginValid);
    if (loginValid) {
      carbohydrates.style.border = "1px solid rgb(124, 231, 241)";
    
      if (carbohydrates.value > 100 ) {
        document.querySelector(".form__modal-carbon").classList.add("_active");
      
      }
     else if(carbohydrates.value < 1 ){
      document.querySelector(".form__modal-carbon-second").classList.add("_active");
        console.log("hhhhh")
      }
     
       else {
        document
          .querySelector(".form__modal-carbon")
          .classList.remove("_active");
          document.querySelector(".form__modal-carbon-second").classList.remove("_active");
      }
      
    } else {
      carbohydrates.style.border = "1px solid red";
    }
  };
  let totalRegExp = /^[0-9]{2,20}$/;
  totalWeight.oninput = () => {
    let loginValid = totalRegExp.test(totalWeight.value);
    if (loginValid) {
      totalWeight.style.border = "1px solid rgb(124, 231, 241)";
    } else {
      totalWeight.style.border = "1px solid red";
    }
  };

  const checking = () =>
    (btnResult.disabled =
      carbohydrates.value.length < 1 ||
      carbohydrates.value > 100 ||
      carbohydrates.value < 1 ||
      totalWeight.value.length < 2 ||
      (btn1.style.backgroundColor !== "rgb(255, 111, 89)") &
        (btn2.style.backgroundColor !== "rgb(255, 111, 89)"));

  carbohydrates.addEventListener("input", checking);
  totalWeight.addEventListener("input", checking);
  btn1.addEventListener("click", checking);
  btn2.addEventListener("click", checking);

  // function checkInput() {
  //   if (carbohydrates.value.length > 2) {
  //     document.querySelector(".form__modal-carbon").classList.add("_active")
  //   }
  //   else{
  //     document.querySelector(".form__modal-carbon").classList.remove("_active")
  //   }

  // }

  //  btn1.addEventListener("click",checkInput)
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
