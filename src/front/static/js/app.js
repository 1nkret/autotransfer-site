const API = {
    fleet: "/api/fleet",
    apply: "/api/applications/",
};

async function loadFleet() {
    try {
        const r = await fetch(API.fleet);
        if (!r.ok) throw new Error();

        const data = await r.json();
        const tbody = document.getElementById("fleetBody");

        tbody.innerHTML =
            (data || [])
                .map(
                    v => `
                    <tr>
                        <td>${v.model ?? ""}</td>
                        <td>${v.type ?? ""}</td>
                        <td>${v.volume_m3 ?? ""}</td>
                        <td>${v.capacity_t ?? ""}</td>
                    </tr>`
                )
                .join("") || `<tr><td colspan="4">Немає даних</td></tr>`;
    } catch {
        document.getElementById("fleetBody").innerHTML =
            `<tr><td colspan="4" style="color:#f88">Помилка завантаження</td></tr>`;
    }
}

async function submitOrder(e) {
    e.preventDefault();

    const body = {
        from: document.getElementById("from").value.trim(),
        to: document.getElementById("to").value.trim(),
        weight: Number(document.getElementById("oWeight").value),
        cargoType: document.getElementById("oCargo").value,
        urgency: document.getElementById("oUrgency").value,
        distance: Number(document.getElementById("oDistance").value),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
    };

    const btn = e.submitter || e.target.querySelector("button[type=submit]");
    btn.disabled = true;

    try {
        const r = await fetch(API.apply, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!r.ok) throw new Error(await r.text());

        const res = await r.json();
        alert(`Заявку прийнято. № ${res.id || "—"}`);
        e.target.reset();
    } catch (err) {
        alert("Помилка відправки");
        console.error(err);
    } finally {
        btn.disabled = false;
    }
}

function initHeroSlider() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const images = [
    "static/img/truck.jpg",
    "static/img/truck1.jpg",
    "static/img/truck2.jpg",
    "static/img/misha.jpg"
  ];

  const slider = document.createElement("div");
  slider.className = "hero-slider";
  hero.insertBefore(slider, hero.firstChild);

  for (let i = 0; i < images.length * 2; i++) {
    const img = document.createElement("img");
    img.src = images[i % images.length];
    img.alt = "background";
    slider.appendChild(img);
  }

  Object.assign(slider.style, {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    width: "max-content",
    height: "100%",
    zIndex: "-1",
    filter: "brightness(0.6)",
    transition: "none",
    willChange: "transform"
  });

  hero.style.position = "relative";
  hero.style.overflow = "hidden";
  hero.style.zIndex = "0";

  slider.querySelectorAll("img").forEach(img => {
    img.style.height = "100%";
    img.style.width = "auto";
    img.style.flexShrink = "0";
    img.style.marginRight = "2px";
    img.style.objectFit = "cover";
  });

  let offset = 0;
  const speed = 0.25;
  function animate() {
    offset -= speed;
    const width = slider.scrollWidth / 2;
    if (Math.abs(offset) >= width) offset = 0;
    slider.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function initDropdownMenu() {
    const dropdownBtn = document.getElementById("dropdownBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (!dropdownBtn || !dropdownMenu) return;

    // Toggle dropdown on button click
    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", (e) => {
        if (!e.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll(".dropdown-content");
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });

    // Close dropdown on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        }
    });
}

// Функція для калькулятора вартості перевезення
function calculatePrice() {
    const distance = Number(document.getElementById("calcDistance").value);
    const weight = Number(document.getElementById("calcWeight").value);
    const cargoType = Number(document.getElementById("calcCargo").value);
    const urgency = Number(document.getElementById("calcUrgency").value);

    // Валідація
    if (!distance || distance < 1) {
        alert("Будь ласка, введіть коректну відстань!");
        return;
    }
    if (!weight || weight < 1) {
        alert("Будь ласка, введіть коректну вагу!");
        return;
    }

    // Базова ціна: 5 грн за км + 0.5 грн за кг
    let basePrice = (distance * 5) + (weight * 0.5);

    // Застосування коефіцієнтів
    let totalPrice = basePrice * cargoType * urgency;

    // Виведення результату
    const resultDiv = document.getElementById("calcResult");
    resultDiv.innerHTML = `
        <h3>Результат розрахунку:</h3>
        <p><strong>Відстань:</strong> ${distance} км</p>
        <p><strong>Вага:</strong> ${weight} кг</p>
        <p><strong>Базова вартість:</strong> ${basePrice.toFixed(2)} грн</p>
        <p><strong>Коефіцієнт типу вантажу:</strong> ×${cargoType}</p>
        <p><strong>Коефіцієнт терміновості:</strong> ×${urgency}</p>
        <p class="price-result"><strong>ЗАГАЛЬНА ВАРТІСТЬ: ${totalPrice.toFixed(2)} грн</strong></p>
    `;
    resultDiv.style.display = "block";
}

// Функція для оновлення відображення бюджету
function updateBudgetDisplay() {
    const budget = document.getElementById("gameBudget").value;
    document.getElementById("budgetValue").textContent = budget;
}

// Функція для оновлення результату гри
function updateGameResult() {
    const auto = document.getElementById("gameAuto").value;
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    const gender = genderRadio ? genderRadio.value : null;
    const budget = Number(document.getElementById("gameBudget").value);

    // Збір інтересів
    const interests = [];
    if (document.getElementById("interestSport").checked) {
        interests.push("Спорт");
    }
    if (document.getElementById("interestMusic").checked) {
        interests.push("Музика");
    }

    // Перевірка заповнення
    if (!auto || !gender) {
        document.getElementById("gameResult").innerHTML =
            '<p style="color: #f88;">Будь ласка, оберіть автомобіль та вкажіть стать!</p>';
        return;
    }

    // Логіка підбору рекомендації
    let recommendation = "";
    let suitability = 0;

    // Аналіз відповідності автомобіля
    if (auto === "BMW") {
        suitability = 80;
        recommendation = "BMW - престижний вибір для динамічної їзди!";
        if (interests.includes("Спорт")) suitability += 10;
        if (budget >= 70) suitability += 10;
    } else if (auto === "Ford") {
        suitability = 70;
        recommendation = "Ford - надійний американський автомобіль!";
        if (interests.includes("Музика")) suitability += 10;
        if (budget >= 40 && budget <= 70) suitability += 15;
    } else if (auto === "Nissan") {
        suitability = 75;
        recommendation = "Nissan - відмінне співвідношення ціни та якості!";
        if (budget <= 50) suitability += 15;
        if (interests.includes("Спорт")) suitability += 5;
    }

    // Формування результату
    const resultDiv = document.getElementById("gameResult");
    resultDiv.innerHTML = `
        <h3>Результат підбору:</h3>
        <p><strong>Обраний автомобіль:</strong> ${auto}</p>
        <p><strong>Стать:</strong> ${gender}</p>
        <p><strong>Інтереси:</strong> ${interests.length > 0 ? interests.join(", ") : "Не вказано"}</p>
        <p><strong>Бюджет:</strong> ${budget} тис. грн</p>
        <div class="recommendation">
            <p><strong>${recommendation}</strong></p>
            <p>Відповідність вашим побажанням: <strong>${suitability}%</strong></p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${suitability}%"></div>
            </div>
        </div>
    `;
    resultDiv.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
    loadFleet();
    document.getElementById("orderForm")?.addEventListener("submit", submitOrder);
    initHeroSlider();
    initDropdownMenu();
});
