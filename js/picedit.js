function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById("preview");
    const container = document.getElementById("preview-container");

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            preview.src = reader.result;

            preview.onload = function () {
                const imgAspectRatio = preview.naturalWidth / preview.naturalHeight;
                const containerAspectRatio = container.offsetWidth / container.offsetHeight;

                preview.style.width = "356px";
                preview.style.height = "190px";
                preview.style.objectFit = "cover";

                if (imgAspectRatio > containerAspectRatio) {
                    preview.style.width = "356px";
                    preview.style.height = "190px";
                } else {
                    preview.style.width = "356px";
                    preview.style.height = "190px";
                }
            };
        };
        reader.readAsDataURL(file);
    } else {
        // Ha nincs kiválasztva fájl, akkor alapértelmezett kép
        preview.src = "https://nodejs315.dszcbaross.edu.hu/uploads/default.png";
        preview.style.width = "356px";
        preview.style.height = "190px";
        preview.style.objectFit = "cover";
    }
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