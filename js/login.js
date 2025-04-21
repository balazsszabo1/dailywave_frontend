const btnLogin = document.getElementById('btnLogin');
btnLogin.addEventListener('click', login);
async function login() {
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password: psw }),
        });
        const data = await res.json();
        if (res.ok) {
            resetInputs();
            showSuccessToast(data.message || 'Sikeres bejelentkezés!');
            setTimeout(() => window.location.href = '../home.html', 1000);
        } else if (data.errors) {
            let errorMessage = '';
            for (let i = 0; i < data.errors.length; i++) {
                errorMessage += `${data.errors[i].error}\n`;
            }
            showErrorToast(errorMessage || 'Hiba történt a bejelentkezéskor!');
        } else if (data.error) {
            showErrorToast(data.error || 'Ismeretlen hiba történt.');
        } else {
            showErrorToast('Ismeretlen hiba');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        showErrorToast('Hiba történt a szerverrel való kommunikáció során. Próbáld újra később.');
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
                showErrorToast('Kérlek, jelentkezz be, hogy elérhesd a profiloldalt!');
            }
        } catch (error) {
            console.error('Hiba történt az ellenőrzés során:', error);
            showErrorToast('Nem sikerült ellenőrizni a bejelentkezést. Próbáld újra később!');
        }
    });
});
function resetInputs() {
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
}
function showSuccessToast(message) {
    showToast(message, '#28a745');
}
function showErrorToast(message) {
    showToast(message, '#dc3545');
}
function showToast(message, bgColor) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = bgColor;
    toast.style.color = '#fff';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    toast.style.fontSize = '16px';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 1000);
    }, 1000);
}