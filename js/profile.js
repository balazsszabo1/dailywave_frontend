const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

// Bejelentkezési ellenőrzés minden oldalon
/* async function checkLoginStatus() {
    try {
        // Ellenőrizni, hogy a felhasználó be van-e jelentkezve
        const res = await fetch(`${BASE_URL}/api/auth/checkAuth`, {
            method: 'GET',
            credentials: 'include', // Küldi a cookie-kat
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
document.addEventListener('DOMContentLoaded', checkLoginStatus); */

// Profil név lekérése
async function getProfileName() {
    try {
        const res = await fetch(`${BASE_URL}/api/profile/getProfileName`, {
            method: 'GET',
            credentials: 'include', // Küldi a cookie-kat
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Aktuális név:', data.name);

            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = data.name;
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
        const res = await fetch(`${BASE_URL}/api/profile/getProfilePic`, {
            method: 'GET',
            credentials: 'include', // Küldi a cookie-kat
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data);

            if (data.profilePicUrl) {
                const editPic = document.getElementById('profilePic');
                editPic.style.backgroundImage = `url(${BASE_URL}${data.profilePicUrl})`;
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
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Küldi a hitelesítési sütiket
        });

        if (!res.ok) {
            console.error('Sikertelen kijelentkezés:', res.status);
            try {
                const errorData = await res.json();
                alert(errorData.error || 'Ismeretlen hiba történt kijelentkezéskor.');
            } catch {
                alert('Nem sikerült feldolgozni a szerver válaszát.');
            }
            return;
        }

        let data;
        try {
            data = await res.json(); // Ellenőrizzük, hogy a válasz valóban JSON-e
        } catch (jsonError) {
            console.error('Hibás válaszformátum:', jsonError);
            alert('A szerver nem adott vissza megfelelő választ.');
            return;
        }

        // Extra biztosíték: helyi sütik törlése
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.dszcbaross.edu.hu";
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        alert(data.message || 'Sikeresen kijelentkeztél!');

        // Netlify login URL-re átirányítás
        window.location.href = 'https://deft-moonbeam-90e218.netlify.app/login';
    } catch (error) {
        console.error('Hiba történt a kijelentkezés során:', error);
        alert('Nem sikerült kapcsolódni a szerverhez. Próbáld újra később.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    getProfileName();
    getProfilPic();
});
