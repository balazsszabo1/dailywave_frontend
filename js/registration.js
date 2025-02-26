const btnReg = document.getElementById('btnReg');
const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

btnReg.addEventListener('click', register);

async function register() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const psw = document.getElementById('psw').value.trim();
    const psw2 = document.getElementById('psw2').value.trim();

    // Ellenőrzés: jelszavak egyezése
    if (psw !== psw2) {
        return alert('A két jelszó nem egyezik!');
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password: psw }),
            credentials: 'include', // Szükséges a sütik kezeléséhez
        });

        const data = await res.json();

        if (res.ok) {
            // Sikeres regisztráció
            resetInputs();
            alert(data.message || 'Sikeres regisztráció!');
            window.location.href = '../login.html';
        } else {
            // Hibák kezelése
            handleErrors(data);
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        alert('Hiba történt a szerverrel való kommunikáció során. Próbáld újra később.');
    }
}

function handleErrors(data) {
    if (data.errors && Array.isArray(data.errors)) {
        const errorMessage = data.errors.map(err => err.error).join('\n');
        alert(errorMessage || 'Hiba történt.');
    } else if (data.error) {
        alert(data.error || 'Ismeretlen hiba történt.');
    } else {
        alert('Ismeretlen hiba történt.');
    }
}

function resetInputs() {
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';
    document.getElementById('psw').value = '';
    document.getElementById('psw2').value = '';
}
