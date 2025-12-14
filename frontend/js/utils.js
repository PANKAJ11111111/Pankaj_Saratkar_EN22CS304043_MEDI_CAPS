

const BASE_URL = "http://localhost:5000";


function getToken() {
    return localStorage.getItem("token");
}

function getRole() {
    return localStorage.getItem("role");
}

function getUserId() {
    return localStorage.getItem("userId");
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}



function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}



function protectTrainerPage() {
    if (getRole() !== "trainer") {
        window.location.href = "login.html";
    }
}

function protectUserPage() {
    if (getRole() !== "user") {
        window.location.href = "login.html";
    }
}



function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}
