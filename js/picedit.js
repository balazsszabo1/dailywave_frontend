function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const preview = document.getElementById("preview");
            preview.src = reader.result;
            preview.onload = function () {
                const container = document.getElementById("preview-container");
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
                    preview.style.height = "190%";
                }
            };
        };
        reader.readAsDataURL(file);
    }
}
async function saveProfilePic() {
    const fileInput = document.getElementById('profilePicInput');
    const file = fileInput.files[0];
    if (!file) {
        return showErrorToast('Kérlek válassz ki egy képet!');
    }
    const formData = new FormData();
    formData.append('profilePic', file);
    document.getElementById('loading').style.display = 'block';
    try {
        const res = await fetch('/api/profile/editProfilePic', {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });
        document.getElementById('loading').style.display = 'none';
        const data = await res.json();
        if (res.ok) {
            const profilePicUrl = data.profilePicUrl;
            document.getElementById('preview').src = profilePicUrl;
            showSuccessToast('Profilkép sikeresen frissítve!');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            showErrorToast(data.error || 'Hiba történt a profilkép frissítésekor');
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        showErrorToast('Hiba történt a kapcsolatban. Kérlek próbáld újra!');
    }
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


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchQuery');
    const resultsContainer = document.getElementById('searchResults');
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
  
      if (query.length === 0) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }
  
      fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results;
          resultsContainer.innerHTML = '';
          resultsContainer.style.display = 'block';
  
          results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.textContent = item.news_title;
            resultItem.style.padding = '10px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #eee';
  
            // Kattintáskor átirányít a newsdetails.html oldalra
            resultItem.addEventListener('click', () => {
              // Az átirányítás az ID alapján történik
              window.location.href = `https://dailywave.netlify.app/newsdetails.html?news_id=${item.news_id}`;
            });
  
            resultsContainer.appendChild(resultItem);
          });
        })
        .catch(err => {
          resultsContainer.innerHTML = '<div style="padding: 10px; color: red;">Nincs találat</div>';
          resultsContainer.style.display = 'block';
        });
    });
  
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        resultsContainer.style.display = 'none';
      }, 200);
    });
  
    searchInput.addEventListener('focus', () => {
      if (resultsContainer.innerHTML.trim() !== '') {
        resultsContainer.style.display = 'block';
      }
    });
  });
  