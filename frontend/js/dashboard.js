
protectTrainerPage();

const planForm = document.getElementById("planForm");
const trainerPlansDiv = document.getElementById("trainerPlans");
const planIdField = document.getElementById("planId");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const durationInput = document.getElementById("duration");


async function loadTrainerPlans() {
    trainerPlansDiv.innerHTML = "<p>Loading your plans...</p>";

    try {
        const res = await fetch(`${BASE_URL}/plans/trainer`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error("Failed to fetch plans");
        }

        const plans = await res.json();

        if (!Array.isArray(plans)) {
            throw new Error("Invalid response format");
        }

        trainerPlansDiv.innerHTML = "";

        if (plans.length === 0) {
            trainerPlansDiv.innerHTML =
                "<p>You haven’t created any plans yet.</p>";
            return;
        }

        plans.forEach(plan => {
            const div = document.createElement("div");
            div.className = "plan-card";

            div.innerHTML = `
                <h4>${plan.title}</h4>
                <p class="price">₹${plan.price} • ${plan.duration} days</p>
                <p>${plan.description}</p>

                <div class="plan-actions">
                    <button class="btn edit-btn">Edit</button>
                    <button class="btn delete-btn">Delete</button>
                </div>
            `;

            div.querySelector(".edit-btn").onclick = () => editPlan(plan);
            div.querySelector(".delete-btn").onclick = () => deletePlan(plan.id);

            trainerPlansDiv.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        trainerPlansDiv.innerHTML =
            "<p style='color:red'>Failed to load plans.</p>";
    }
}


planForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const planData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        price: priceInput.value,
        duration: durationInput.value
    };

    // Validation
    if (!planData.title || !planData.description || !planData.price || !planData.duration) {
        alert("All fields are required");
        return;
    }

    const isEdit = Boolean(planIdField.value);
    const url = isEdit
        ? `${BASE_URL}/plans/${planIdField.value}`
        : `${BASE_URL}/plans`;

    const method = isEdit ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(planData)
        });

        if (!res.ok) {
            throw new Error("Failed to save plan");
        }

        planForm.reset();
        planIdField.value = "";

        loadTrainerPlans();

    } catch (err) {
        console.error(err);
        alert("Unable to save plan. Try again.");
    }
});


function editPlan(plan) {
    planIdField.value = plan.id;
    titleInput.value = plan.title;
    descriptionInput.value = plan.description;
    priceInput.value = plan.price;
    durationInput.value = plan.duration;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deletePlan(id) {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
        const res = await fetch(`${BASE_URL}/plans/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!res.ok) {
            throw new Error("Delete failed");
        }

        loadTrainerPlans();

    } catch (err) {
        console.error(err);
        alert("Failed to delete plan.");
    }
}


loadTrainerPlans();
