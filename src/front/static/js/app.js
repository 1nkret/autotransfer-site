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

document.addEventListener("DOMContentLoaded", () => {
    loadFleet();
    document.getElementById("orderForm")?.addEventListener("submit", submitOrder);
    initHeroSlider();
});
