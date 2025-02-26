const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

// Jelszó módosító gomb eseménykezelője
document.getElementById('btnChangePassword').addEventListener('click', async () => {
    const psw = document.getElementById('psw').value.trim();
    const psw2 = document.getElementById('psw2').value.trim();

    // Ellenőrizzük, hogy a két jelszó megegyezik-e
    if (psw !== psw2) {
        return alert('A két jelszó nem egyezik!');
    }

    // Ellenőrizzük a jelszó hosszát
    if (psw.length < 6) {
        return alert('A jelszónak legalább 6 karakterből kell állnia!');
    }

    // Frissítjük a jelszót az API-n keresztül
    try {
        const res = await fetch('/api/profile/editProfilePsw', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ psw }),
            credentials: 'include'
        });

        const data = await res.json();

        // Ha sikeres, értesítjük a felhasználót
        if (res.ok) {
            resetInputs();
            alert(data.message || 'Jelszó frissítve');
            window.location.href = 'profile.html'; // Vissza a profil oldalra
        } else {
            alert(data.error || 'Ismeretlen hiba történt');
        }
    } catch (error) {
        console.error('Hiba történt a jelszó frissítésekor:', error);
        alert('Hiba történt a jelszó frissítésekor. Kérlek próbáld újra később.');
    }
});

// Funkció a beviteli mezők törlésére
function resetInputs() {
    document.getElementById('psw').value = '';
    document.getElementById('psw2').value = '';
}
