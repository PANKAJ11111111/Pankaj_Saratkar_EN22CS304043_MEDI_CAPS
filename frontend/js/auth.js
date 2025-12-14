

const BASE_URL = "http://localhost:5000";   



const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;

        if (!name || !email || !password || !role) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed");
                return;
            }

            alert("Signup successful. Please login.");
            window.location.href = "login.html";

        } catch (error) {
            alert("Server error. Try again later.");
        }
    });
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value;

        if (!email || !password || !role) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.userId);

           
            if (data.role === "trainer") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "feed.html";
            }

        } catch (error) {
            alert("Server error. Try again later.");
        }
    });
}
