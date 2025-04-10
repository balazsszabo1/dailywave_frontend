document.getElementById('btnChangePassword').addEventListener('click', async () => {
    const psw = document.getElementById('psw').value.trim();
    const psw2 = document.getElementById('psw2').value.trim();

    if (psw !== psw2) {
        return showErrorToast('A két jelszó nem egyezik!');
    }

    if (psw.length < 6) {
        return showErrorToast('A jelszónak legalább 6 karakterből kell állnia!');
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
            showSuccessToast(data.message || 'Jelszó frissítve');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            showErrorToast(data.error || 'Ismeretlen hiba történt');
        }
    } catch (error) {
        console.error('Hiba történt a jelszó frissítésekor:', error);
        showErrorToast('Hiba történt a jelszó frissítésekor. Kérlek próbáld újra később.');
    }
});

function resetInputs() {
    document.getElementById('psw').value = '';
    document.getElementById('psw2').value = '';
}

// Success Toast
function showSuccessToast(message) {
    showToast(message, '#28a745'); // Zöld
}

// Error Toast
function showErrorToast(message) {
    showToast(message, '#dc3545'); // Piros
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

    // Fade in
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Remove after 2.5s
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 1000);
    }, 1000);
}
