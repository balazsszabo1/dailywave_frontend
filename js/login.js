const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', login);

const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

async function login() {
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email, password: psw }),
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        resetInputs();
        alert(data.message);
        window.location.href = '../home.html';
    } else if (data.errors) {
        let errorMessage = '';
        for (let i = 0; i < data.errors.length; i++) {
            errorMessage += `${data.errors[i].error}\n`
        }
        alert(errorMessage);
    } else if (data.error) {
        alert(data.error);
    } else {
        alert('Ismeretlen hiba');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.getElementById('profileLink');

    profileLink.addEventListener('click', async (event) => {
        event.preventDefault(); // Ne engedje az alapértelmezett kattintást

        try {
            const res = await fetch(`${BASE_URL}/api/auth/checkAuth`, {
                method: 'GET',
                credentials: 'include', // Küldje a sütit az azonosításhoz
            });

            if (res.ok) {
                // Ha a bejelentkezés érvényes, engedje tovább
                window.location.href = 'profile.html';
            } else {
                // Bejelentkezés sikertelen
                alert('Kérlek, jelentkezz be, hogy elérhesd a profiloldalt!');
            }
        } catch (error) {
            console.error('Hiba történt az ellenőrzés során:', error);
            alert('Nem sikerült ellenőrizni a bejelentkezést. Próbáld újra később!');
        }
    });
});




function resetInputs() {
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
}