// Lista de divisas principales con código de país para las banderas
const currencies = {
  USD: { name: "Dólar Estadounidense", country: "us" },
  EUR: { name: "Euro", country: "eu" },
  GBP: { name: "Libra Esterlina", country: "gb" },
  JPY: { name: "Yen Japonés", country: "jp" },
  CAD: { name: "Dólar Canadiense", country: "ca" },
  AUD: { name: "Dólar Australiano", country: "au" },
  CHF: { name: "Franco Suizo", country: "ch" },
  MXN: { name: "Peso Mexicano", country: "mx" },
  ARS: { name: "Peso Argentino", country: "ar" },
  BRL: { name: "Real Brasileño", country: "br" },
  CLP: { name: "Peso Chileno", country: "cl" },
  COP: { name: "Peso Colombiano", country: "co" },
  PEN: { name: "Sol Peruano", country: "pe" }
};

const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const amountInput = document.getElementById("amount");
const form = document.getElementById("converterForm");
const swapBtn = document.getElementById("swapBtn");
const finalResult = document.getElementById("finalResult");
const rateInfo = document.getElementById("rateInfo");

// Cargar opciones en los select
function populateSelects() {
  Object.keys(currencies).forEach(code => {
    const optFrom = document.createElement("option");
    optFrom.value = code;
    optFrom.textContent = `${code} - ${currencies[code].name}`;
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = code;
    optTo.textContent = `${code} - ${currencies[code].name}`;
    toSelect.appendChild(optTo);
  });

  fromSelect.value = "USD";
  toSelect.value = "EUR";
}

// Actualizar banderas cuando cambia la selección
function updateFlags() {
  const fromCode = currencies[fromSelect.value]?.country || "us";
  const toCode = currencies[toSelect.value]?.country || "eu";

  fromFlag.src = `https://flagcdn.com/w40/${fromCode}.png`;
  toFlag.src = `https://flagcdn.com/w40/${toCode}.png`;
}

// Función principal de conversión mediante API gratuita
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    finalResult.textContent = "Monto inválido";
    return;
  }

  rateInfo.textContent = "Obteniendo tasa de cambio...";

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.rates[to];
      const convertedAmount = (amount * rate).toFixed(2);

      rateInfo.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
      finalResult.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } else {
      finalResult.textContent = "Error de servicio";
    }
  } catch (error) {
    rateInfo.textContent = "Error de conexión";
    finalResult.textContent = "Sin datos de red";
  }
}

// Intercambiar divisas de origen y destino
swapBtn.addEventListener("click", () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  updateFlags();
  convertCurrency();
});

fromSelect.addEventListener("change", () => {
  updateFlags();
  convertCurrency();
});

toSelect.addEventListener("change", () => {
  updateFlags();
  convertCurrency();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  convertCurrency();
});

// Inicialización
populateSelects();
updateFlags();
convertCurrency();
