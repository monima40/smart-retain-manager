/* =========================================================
   AUTH.JS — simple client-side login gate
   NOTE: this is a browser-only demo login, not real security.
   Credentials live in localStorage. Fine for a local/offline
   project; don't rely on it to protect real data.
========================================================= */

const AUTH_SESSION_KEY = "srm_auth_session";
const AUTH_CREDENTIALS_KEY = "srm_credentials";

/* Change these to set the default login */
const DEFAULT_CREDENTIALS = {
    username: "admin",
    password: "admin123"
};

function getCredentials() {
    const saved = localStorage.getItem(AUTH_CREDENTIALS_KEY);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(AUTH_CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    return DEFAULT_CREDENTIALS;
}

function isLoggedIn() {
    return sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
}

function attemptLogin(username, password) {
    const creds = getCredentials();
    if (username.trim() === creds.username && password === creds.password) {
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "login.html";
}

/* Guard every page except login.html itself */
(function requireAuth() {
    const onLoginPage = window.location.pathname.endsWith("login.html");

    if (onLoginPage) {
        if (isLoggedIn()) {
            window.location.href = "dashboard.html";
        }
        return;
    }

    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }
})();

/* Wire up the login form (only exists on login.html) */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;
        const errorBox = document.getElementById("loginError");

        if (attemptLogin(username, password)) {
            window.location.href = "dashboard.html";
        } else {
            errorBox.classList.add("show");
        }
    });
});