const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', logout);
// Bejelentkezési ellenőrzés minden oldalon
/*  async function checkLoginStatus() {
    try {
        // Ellenőrizni, hogy a felhasználó be van-e jelentkezve
        const res = await fetch('/api/auth/checkAuth', {
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
document.addEventListener('DOMContentLoaded', checkLoginStatus);  */

// Profil név lekérése
async function getProfileName() {
    try {
        const res = await fetch('/api/profile/getProfileName', {
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
        const res = await fetch('/api/profile/getProfilePic', {
            method: 'GET',
            credentials: 'include', // Küldi a cookie-kat
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Profilkép adatok:', data);

            if (data.profilePicUrl) {
                let imageUrl = data.profilePicUrl.trim();

                // Ha az URL `/uploads/`-szal kezdődik, akkor levágjuk az elejét
                if (imageUrl.startsWith('/uploads/')) {
                    imageUrl = imageUrl.replace('/uploads/', '');
                }

                // Teljes URL létrehozása
                imageUrl = `https://nodejs315.dszcbaross.edu.hu/uploads/${imageUrl}`;

                const editPic = document.getElementById('profilePic');
                
                // 📌 Gyorsítótár törlése (új paraméter)
                editPic.style.backgroundImage = `url(${imageUrl}?t=${new Date().getTime()})`;

                console.log('Végleges kép URL:', imageUrl);
            } else {
                console.log('Nincs beállítva profilkép.');
            }
        } else {
            console.error('Nem sikerült lekérni a profilképet.');
        }
    } catch (error) {
        console.error('Hálózati hiba a profilkép lekérésekor:', error);
    }
}




async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Küldi a sütit a szervernek
    });
    console.log(res);


    if (res.ok) {
        alert('Sikeres kijelentkezés!');

        // Böngésző gyorsítótár ürítése és újratöltés
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1000); // Késleltetett átirányítás, hogy a törlés érvényesüljön
    } else {
        let errorMessage = 'Hiba történt a kijelentkezés során.';
        try {
            const data = await res.json();
            console.log(data);

            errorMessage = data.error || errorMessage;
        } catch (jsonError) {
            console.error('Hibás szerver válasz:', jsonError);
        }
        alert(errorMessage);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    getProfileName();
    getProfilPic();
});
