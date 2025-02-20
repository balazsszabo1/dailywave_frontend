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
        credentials: 'include' // Küldi a sütit a szervernek
    });

    const data = await res.json();

    if (res.ok) {
        resetInputs();
        alert(data.message);
        window.location.href = '../home.html';
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

