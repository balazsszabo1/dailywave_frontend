// Bejelentkezési ellenőrzés minden oldalon
async function checkLoginStatus() {
    try {
        // Ellenőrizni, hogy a felhasználó be van-e jelentkezve
        const res = await fetch('http://127.0.0.1:3000/api/auth/checkAuth', {
            method: 'GET',
            credentials: 'include', // Az authentikációs süti elküldése
        });

        // Ha a válasz nem OK, irányítsuk át a bejelentkezési oldalra
        if (!res.ok) {
            alert('Kérlek, jelentkezz be!');
            window.location.href = 'login.html'; // Átirányítás a login oldalra
        }
    } catch (error) {
        console.error('Hiba történt a hitelesítés ellenőrzésekor:', error);
        alert('Nem sikerült ellenőrizni a bejelentkezési állapotot.');
        window.location.href = 'login.html'; // Ha hiba történt, irányítás a login oldalra
    }
}

// Hívjuk meg ezt a funkciót minden oldalon, ahol szükséges a bejelentkezés ellenőrzése
document.addEventListener('DOMContentLoaded', checkLoginStatus);


// Profil név lekérése
async function getProfileName() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/profile/getProfileName', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Aktuális név:', data.name);

            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = data.name;  // Ez a 'username' lesz most
        } else {
            const data = await res.json();
            console.error('Hiba a név lekérésekor:', data.error);
            alert(data.error || 'Hiba történt a név lekérésekor');
        }
    } catch (error) {
        console.error('Hálózati hiba a név lekérésekor:', error);
        alert('Nem sikerült lekérni a nevet');
    }
}

// Profilkép lekérése
async function getProfilPic() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/profile/getProfilePic', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);

            if (data.profilePicUrl) {
                const editPic = document.getElementById('profilePic');
                editPic.style.backgroundImage = `url('http://127.0.0.1:3000${data.profilePicUrl}')`;
            } else {
                console.log('Profile picture is not set.');
            }
        } else {
            console.error('Failed to fetch profile picture.');
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

// Kijelentkezés funkció
async function logout() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Küldi a cookie-kat a szervernek
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message); // Sikeres kijelentkezési üzenet
            window.location.href = '../login.html'; // Átirányítás a bejelentkezési oldalra
        } else if (data.errors) {
            // Több hiba megjelenítése, ha van
            alert(data.errors.map(e => e.error).join('\n'));
        } else if (data.error) {
            // Egyedi hiba megjelenítése
            alert(data.error);
        } else {
            alert('Ismeretlen hiba történt');
        }
    } catch (error) {
        console.error('Hiba történt a kijelentkezés során:', error);
        alert('Nem sikerült kapcsolódni a szerverhez. Próbáld újra később.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getProfileName();
    getProfilPic();
});