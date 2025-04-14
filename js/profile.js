const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', logout);

async function getProfileName() {
    try {
        const res = await fetch('/api/profile/getProfileName', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Aktuális név:', data.name);

            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = data.name;
        } else {
            const data = await res.json();
            console.error('Hiba a név lekérésekor:', data.error);
            showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
        }
    } catch (error) {
        console.error('Hálózati hiba a név lekérésekor:', error);
        showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
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
            showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
    }
}


async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Küldi a sütit a szervernek
    });
    console.log(res);

    if (res.ok) {
        // Sikeres kijelentkezés után prompt megjelenítése
        showLogoutPrompt('Sikeres kijelentkezés!');

        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000); // 2 másodperc után irányít át
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

function showLogoutPrompt(message = 'Sikeres kijelentkezés!') {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '30px';
    box.style.borderRadius = '12px';
    box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    box.style.textAlign = 'center';
    box.style.maxWidth = '400px';
    box.style.width = '80%';

    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.fontSize = '18px';
    msg.style.marginBottom = '20px';

    const button = document.createElement('button');
    button.textContent = 'Újra bejelentkezés';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';

    button.onclick = () => {
        window.location.href = '../login.html';
    };

    box.appendChild(msg);
    box.appendChild(button);
    container.appendChild(box);
    document.body.appendChild(container);
}


document.addEventListener('DOMContentLoaded', () => {
    getProfileName();
    getProfilPic();
});


function showLoginPrompt(message = 'A profil megtekintéséhez jelentkezz be.') {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '30px';
    box.style.borderRadius = '12px';
    box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    box.style.textAlign = 'center';
    box.style.maxWidth = '400px';
    box.style.width = '80%';

    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.fontSize = '18px';
    msg.style.marginBottom = '20px';

    const button = document.createElement('button');
    button.textContent = 'Bejelentkezés';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';

    button.onclick = () => {
        window.location.href = '../login.html';
    };

    box.appendChild(msg);
    box.appendChild(button);
    container.appendChild(box);
    document.body.appendChild(container);
}
