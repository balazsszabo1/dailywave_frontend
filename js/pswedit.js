document.getElementById('btnChangePassword').addEventListener('click', async () => {
    const psw = document.getElementById('psw').value.trim();
    const psw2 = document.getElementById('psw2').value.trim();

    if (psw !== psw2) {
        return alert('A két jelszó nem egyezik!');
    }

    if (psw.length < 6) {
        return alert('A jelszónak legalább 6 karakterből kell állnia!');
    }

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

        if (res.ok) {
            resetInputs();
            alert(data.message || 'Jelszó frissítve');
            window.location.href = 'profile.html';
        } else {
            alert(data.error || 'Ismeretlen hiba történt');
        }
    } catch (error) {
        console.error('Hiba történt a jelszó frissítésekor:', error);
        alert('Hiba történt a jelszó frissítésekor. Kérlek próbáld újra később.');
    }
});

function resetInputs() {
    document.getElementById('psw').value = '';
    document.getElementById('psw2').value = '';
}