function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const preview = document.getElementById("preview");
            preview.src = reader.result;

            // Várjuk meg, amíg a kép betöltődik
            preview.onload = function() {
                const container = document.getElementById("preview-container");

                // Kép és tároló arányainak kiszámítása
                const imgAspectRatio = preview.naturalWidth / preview.naturalHeight;
                const containerAspectRatio = container.offsetWidth / container.offsetHeight;

                // Ha a kép szélesebb, mint a tároló, akkor a szélességet állítjuk be
                if (imgAspectRatio > containerAspectRatio) {
                    preview.style.width = "100%";
                    preview.style.height = "auto";
                } else {
                    preview.style.width = "auto";
                    preview.style.height = "100%";
                }
            };
        };
        reader.readAsDataURL(file);
    }
}

const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

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
        const res = await fetch(`${BASE_URL}/api/profile/editProfilePic`, {
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
