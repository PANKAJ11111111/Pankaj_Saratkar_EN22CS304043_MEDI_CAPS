protectUserPage();

async function loadFeed() {
    const res = await fetch(`${BASE_URL}/users/feed`, {
        headers: getAuthHeaders()
    });

    const plans = await res.json();
    const container = document.getElementById("feedPlans");
    container.innerHTML = "";

    if (!plans.length) {
        container.innerHTML = "<p style='color:white'>No plans in your feed yet.</p>";
        return;
    }

    plans.forEach(plan => {
        const div = document.createElement("div");
        div.className = "plan-card";

        div.innerHTML = `
            <h3>${plan.title}</h3>

            <div class="trainer-row">
                <span>👤 ${plan.trainerName}</span>
                <button class="btn ${plan.following ? "unfollow-btn" : "follow-btn"}"
                    onclick="toggleFollow('${plan.trainerId}', ${plan.following})">
                    ${plan.following ? "Unfollow" : "Follow"}
                </button>
            </div>

            <p class="price">₹${plan.price} • ${plan.duration} days</p>
            <p>${plan.description}</p>

            ${
                plan.subscribed
                    ? `
                      <span class="badge">Subscribed</span>
                      <button class="btn unfollow-btn" 
                          style="width:100%;margin-top:8px"
                          onclick="unsubscribe('${plan.id}')">
                          Unsubscribe
                      </button>
                      `
                    : `
                      <button class="btn subscribe-btn" 
                          onclick="subscribe('${plan.id}')">
                          Subscribe
                      </button>
                      `
            }
        `;

        container.appendChild(div);
    });
}

async function subscribe(planId) {
    await fetch(`${BASE_URL}/subscribe/${planId}`, {
        method: "POST",
        headers: getAuthHeaders()
    });
    loadFeed();
}


async function unsubscribe(planId) {
    if (!confirm("Are you sure you want to unsubscribe?")) return;

    await fetch(`${BASE_URL}/subscribe/${planId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    loadFeed();
}


async function toggleFollow(trainerId, isFollowing) {
    const endpoint = isFollowing ? "unfollow" : "follow";

    await fetch(`${BASE_URL}/${endpoint}/${trainerId}`, {
        method: "POST",
        headers: getAuthHeaders()
    });

    loadFeed();
}

loadFeed();
