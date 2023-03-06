// Selectors
const disbursementEl = document.querySelector("#disbursement-date");
const annualTaxEl = document.querySelector("#annual-tax");
const fromDateEl = document.querySelector("#date-from");
const toDateEl = document.querySelector("#date-to");
const resultEl = document.querySelector("#result");
const payorEl = document.querySelector("#payor");

// Functions

function getTimestamp(from, to) {
  const difference = to - from;
  const days = difference / (1000 * 60 * 60 * 24);
  return days;
}

function dateFormat(date) {
  const initial = new Date(date.value);
  const offsetMinutes = initial.getTimezoneOffset();
  initial.setMinutes(initial.getMinutes() + offsetMinutes);
  return initial.toLocaleDateString("en-us");
}

function calculateProration() {
  const disbursement = new Date(disbursementEl.value).getTime();
  const annualTax = annualTaxEl.value;
  const fromDate = new Date(fromDateEl.value).getTime();
  const toDate = new Date(toDateEl.value).getTime();
  const dailyTax = annualTax / 365;
  const payor = payorEl.options[payorEl.selectedIndex].text;
  let firstDate;
  let numberOfDays;
  let proration;
  console.log(payor);
  if (payor === "Buyer") {
    firstDate = dateFormat(fromDateEl);
    numberOfDays = getTimestamp(fromDate, disbursement);
    proration = (numberOfDays * dailyTax).toFixed(2);
  } else if (payor === "Seller") {
    firstDate = dateFormat(toDateEl);
    numberOfDays = getTimestamp(toDate, disbursement);
    proration = ((numberOfDays - 1) * dailyTax).toFixed(2);
  }

  const secondDate = dateFormat(disbursementEl);

  if (proration > 0) {
    resultEl.textContent = `Proration CREDIT of ${proration} from ${firstDate} to ${secondDate}`;
  } else {
    proration *= -1;
    resultEl.textContent = `Proration CHARGE of ${proration} from ${secondDate} to ${firstDate}`;
  }
}

// Form Validation
function validateForm() {
  let trigger = true;
  const inpts = [disbursementEl, annualTaxEl, fromDateEl, toDateEl, payorEl];

  for (const inpt of inpts) {
    if (!inpt.value || inpt.value === "Choose payor") {
      inpt.classList.add("is-invalid");
      trigger = false;
    } else {
      inpt.classList.remove("is-invalid");
    }
  }

  return trigger;
}

// Handlers
function clickHandler() {
  if (validateForm()) {
    console.log("success");
    calculateProration();
  }
}

// Run program
document.querySelector(".calc").addEventListener("click", clickHandler);
