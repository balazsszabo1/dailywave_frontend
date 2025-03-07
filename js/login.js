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

        // Admin jogosultság ellenőrzése és átirányítás
        if (data.role && data.role === 'admin') {
            window.location.href = '../adminprofile.html'; // Admin felület
        } else {
            window.location.href = '../home.html'; // Normál felhasználó
        }
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

function resetInputs() {
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
}
