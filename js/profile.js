const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', logout);

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


async function getProfilPic() {
    try {
        const res = await fetch('/api/profile/getProfilePic', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Profilkép adatok:', data);

            if (data.profilePicUrl) {
                let imageUrl = data.profilePicUrl.trim();

                if (imageUrl.startsWith('/uploads/')) {
                    imageUrl = imageUrl.replace('/uploads/', '');
                }

                imageUrl = `https://nodejs315.dszcbaross.edu.hu/uploads/${imageUrl}`;

                const profilePic = document.getElementById('profilePic');
                profilePic.src = `${imageUrl}?t=${new Date().getTime()}`;

                console.log('Végleges kép URL:', profilePic.src);
            }
        } else {
            console.error('Nem sikerült lekérni a profilképet.');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
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

        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1000);
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
