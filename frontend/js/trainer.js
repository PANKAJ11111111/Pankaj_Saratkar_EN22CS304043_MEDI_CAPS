
protectUserPage();

const trainerId = getQueryParam("trainerId");

const trainerNameEl = document.getElementById("trainerName");
const trainerEmailEl = document.getElementById("trainerEmail");
const followBtn = document.getElementById("followBtn");
const trainerPlansDiv = document.getElementById("trainerPlans");
const planCountEl = document.getElementById("planCount");
const followerCountEl = document.getElementById("followerCount");

let isFollowing = false;



async function loadTrainerProfile() {
    if (!trainerId) {
        alert("Trainer not found");
        return window.location.href = "feed.html";
    }

    try {
       
        const trainersRes = await fetch(`${BASE_URL}/trainers`);
        const trainers = await trainersRes.json();

        const trainer = trainers.find(t => t.id === trainerId);
        if (!trainer) throw new Error("Trainer not found");

        trainerNameEl.innerText = trainer.name;
        trainerEmailEl.innerText = trainer.email;

       
        const plansRes = await fetch(
            `${BASE_URL}/trainers/${trainerId}/plans`
        );
        const plans = await plansRes.json();

        planCountEl.innerText = plans.length;
        renderTrainerPlans(plans);

        
        const followStatusRes = await fetch(
            `${BASE_URL}/follow/status/${trainerId}`,
            { headers: getAuthHeaders() }
        );
        const followStatus = await followStatusRes.json();

        isFollowing = followStatus.following;
        updateFollowButton();

      
        const followerCountRes = await fetch(
            `${BASE_URL}/follow/count/${trainerId}`
        );
        const countData = await followerCountRes.json();

        followerCountEl.innerText = countData.count;

    } catch (err) {
        console.error(err);
        alert("Unable to load trainer profile");
        window.location.href = "feed.html";
    }
}


function updateFollowButton() {
    followBtn.innerText = isFollowing ? "Unfollow Trainer" : "Follow Trainer";
    followBtn.className = `follow-btn ${isFollowing ? "unfollow" : "follow"}`;
}

async function toggleFollow() {
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
        const res = await fetch(`${BASE_URL}/${endpoint}/${trainerId}`, {
            method: "POST",
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error("Follow failed");

        isFollowing = !isFollowing;
        followerCountEl.innerText =
            parseInt(followerCountEl.innerText) + (isFollowing ? 1 : -1);

        updateFollowButton();

    } catch (err) {
        console.error(err);
        alert("Action failed");
    }
}

function renderTrainerPlans(plans) {
    trainerPlansDiv.innerHTML = "";

    if (!plans.length) {
        trainerPlansDiv.innerHTML = "<p>No plans created yet.</p>";
        return;
    }

    plans.forEach(plan => {
        const card = document.createElement("div");
        card.className = "plan-card";

        card.innerHTML = `
            <h4>${plan.title}</h4>
            <p class="price">₹${plan.price} • ${plan.duration} days</p>
            <p>${plan.description.substring(0, 80)}...</p>
            <button class="view-btn">View Plan Details</button>
        `;

        card.querySelector(".view-btn").onclick = () => {
            window.location.href = `plan.html?planId=${plan.id}`;
        };

        trainerPlansDiv.appendChild(card);
    });
}

followBtn.addEventListener("click", toggleFollow);


loadTrainerProfile();
