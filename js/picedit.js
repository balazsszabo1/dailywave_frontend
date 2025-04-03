function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            preview.src = reader.result;
            applyImageStyles(preview);
        };
        reader.readAsDataURL(file);
    } else {
        resetPreview();
    }
}

// Alapértelmezett kép beállítása
function resetPreview() {
    const preview = document.getElementById("preview");
    preview.src = "https://nodejs315.dszcbaross.edu.hu/uploads/default.png";
    applyImageStyles(preview);
}

// Stílusok alkalmazása
function applyImageStyles(image) {
    image.style.width = "356px";
    image.style.height = "190px";
    image.style.objectFit = "cover";
}





// Frontend: Profilkép mentése
async function saveProfilePic() {
    const fileInput = document.getElementById('profilePicInput');
    const file = fileInput.files[0];

    if (!file) {
        return alert('Kérlek válassz ki egy képet!');
    }

    const formData = new FormData();
    formData.append('profilePic', file);  // Ensure this matches the backend configuration

    document.getElementById('loading').style.display = 'block';

    try {
        const res = await fetch('/api/profile/editProfilePic', {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });

        document.getElementById('loading').style.display = 'none';

        if (res.ok) {
            const data = await res.json();
            const profilePicUrl = data.profilePicUrl;
            document.getElementById('preview').src = profilePicUrl;
            alert('Profilkép sikeresen frissítve!');
            window.location.href = 'profile.html'; // Vissza a profil oldalra
        } else {
            const data = await res.json();
            alert(data.error || 'Hiba történt a profilkép frissítésekor');
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert('Hiba történt a kapcsolatban. Kérlek próbáld újra!');
    }
}