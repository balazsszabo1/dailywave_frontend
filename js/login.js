const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', login);

async function login() {
    const email = document.getElementById('email').value;  // Email kinyerése a beviteli mezőből
    const psw = document.getElementById('psw').value;  // Jelszó kinyerése a beviteli mezőből

    // Kérés küldése a backend felé
    const res = await fetch('/api/auth/login', {
        method: 'POST',  // POST kérés
        headers: {
            'content-type': 'application/json',  // JSON típusú adat
        },
        body: JSON.stringify({ email, password: psw }),  // Kérési body, ami tartalmazza az email-t és a jelszót
    });

    const data = await res.json();  // Válasz adatainak kinyerése

    // Ha sikeres a bejelentkezés
    if (res.ok) {
        resetInputs();  // Input mezők törlése
        alert(data.message);  // Üzenet megjelenítése
        window.location.href = '../home.html';  // Átirányítás a főoldalra
    } else if (data.errors) {
        // Ha hibák vannak
        let errorMessage = '';
        for (let i = 0; i < data.errors.length; i++) {
            errorMessage += `${data.errors[i].error}\n`;  // Hibák összesítése
        }
        alert(errorMessage);  // Hibák megjelenítése
    } else if (data.error) {
        alert(data.error);  // Egyedi hibaüzenet megjelenítése
    } else {
        alert('Ismeretlen hiba');  // Ismeretlen hiba
    }
}

// Beviteli mezők visszaállítása
function resetInputs() {
    document.getElementById('email').value = '';  // Email mező törlése
    document.getElementById('psw').value = '';  // Jelszó mező törlése
}
