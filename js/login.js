const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', login);

async function login() {
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email, password: psw }),
    });

    const data = await res.json()

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
        event.preventDefault();

        try {
            const res = await fetch('/api/auth/checkAuth', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                window.location.href = 'profile.html';
            } else {
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
