const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

// Bejelentkezés ellenőrzése
async function checkLoginStatus() {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/checkAuth`, {
            method: 'GET',
            credentials: 'include', // Küldi a sütiket
        });

        if (!res.ok) {
            alert('Kérlek, jelentkezz be!');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Hiba történt:', error);
        alert('Nem sikerült ellenőrizni a bejelentkezést.');
        window.location.href = 'login.html';
    }
}

// Profilnév lekérése
async function getProfileName() {
    try {
        const res = await fetch(`${BASE_URL}/api/profile/getProfileName`, {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            document.getElementById('user-name').textContent = data.name;
        } else {
            alert('Hiba történt a név lekérésekor');
        }
    } catch (error) {
        console.error('Hiba történt:', error);
    }
}

// Kijelentkezés funkció
async function logout() {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            window.location.href = '../login.html';
        } else {
            alert('Hiba történt a kijelentkezés során');
        }
    } catch (error) {
        console.error('Hiba történt:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    getProfileName();
});
