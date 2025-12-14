const planId = getQueryParam("planId");

const titleEl = document.getElementById("planTitle");
const trainerEl = document.getElementById("trainerName");
const priceEl = document.getElementById("planPrice");
const contentEl = document.getElementById("planContent");
const subscribeBtn = document.getElementById("subscribeBtn");

async function loadPlan() {
    const res = await fetch(`${BASE_URL}/plans/${planId}`, {
        headers: getAuthHeaders()
    });

    const plan = await res.json();

    titleEl.innerText = plan.title;
    trainerEl.innerText = plan.trainerName;
    priceEl.innerText = `₹${plan.price} • ${plan.duration} days`;

    trainerEl.onclick = () => {
        window.location.href = `trainer.html?trainerId=${plan.trainerId}`;
    };

    if (plan.subscribed) {
        contentEl.innerHTML = `<p>${plan.description}</p>`;
    } else {
        contentEl.innerHTML = `
            <p>${plan.description.substring(0, 120)}...</p>
            <p><em>Subscribe to unlock full plan details.</em></p>
        `;
        subscribeBtn.style.display = "inline-block";
    }

    subscribeBtn.onclick = subscribe;
}

async function subscribe() {
    await fetch(`${BASE_URL}/subscribe/${planId}`, {
        method: "POST",
        headers: getAuthHeaders()
    });

    loadPlan();
}

loadPlan();
