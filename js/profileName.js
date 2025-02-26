const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

let currentName = '';
async function editProfileName() {
    const name = document.getElementById('new-name').value.trim();

    if (!name) {
        return alert('Kérlek, adj meg egy érvényes nevet!');
    }

    if (name === currentName) {
        return alert('Az új név nem lehet azonos a jelenlegi névvel!');
    }

    try {
        const res = await fetch('/api/profile/editProfileName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
            credentials: 'include',
        });

        let data;
        try {
            data = await res.json();
        } catch (error) {
            console.error('Hiba a válasz feldolgozása során:', error);
            return alert('Nem sikerült JSON formátumban feldolgozni a választ. Ellenőrizd a szerver válaszát.');
        }

        if (res.ok) {
            alert(data.message || 'Név sikeresen módosítva!');
            window.location.href = '../profile.html';
        } else {
            alert(data.error || 'Hiba történt a név módosítása során.');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        alert('Nem sikerült kapcsolódni a szerverhez. Próbáld újra később.');
    }
}

const btnChangeName = document.getElementById('btnChangeName');
btnChangeName.addEventListener('click', editProfileName);
