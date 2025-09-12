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

document.addEventListener("DOMContentLoaded", () => {
    loadFleet();
    document
        .getElementById("orderForm")
        .addEventListener("submit", submitOrder);
});
