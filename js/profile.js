const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener('click', logout);

async function getProfileName() {
    try {
        const res = await fetch('/api/profile/getProfileName', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Aktuális név:', data.name);

            const userNameElement = document.getElementById('user-name');
            userNameElement.textContent = data.name;
        } else {
            const data = await res.json();
            console.error('Hiba a név lekérésekor:', data.error);
            showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
        }
    } catch (error) {
        console.error('Hálózati hiba a név lekérésekor:', error);
        showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
    }
}


async function getProfilPic() {
    try {
        const res = await fetch('/api/profile/getProfilePic', {
            method: 'GET',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            console.log('Profilkép adatok:', data);

            if (data.profilePicUrl) {
                let imageUrl = data.profilePicUrl.trim();

                if (imageUrl.startsWith('/uploads/')) {
                    imageUrl = imageUrl.replace('/uploads/', '');
                }

                imageUrl = `https://nodejs315.dszcbaross.edu.hu/uploads/${imageUrl}`;

                const profilePic = document.getElementById('profilePic');
                profilePic.src = `${imageUrl}?t=${new Date().getTime()}`;

                console.log('Végleges kép URL:', profilePic.src);
            }
        } else {
            console.error('Nem sikerült lekérni a profilképet.');
            showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        showLoginPrompt('A profil megtekintéséhez jelentkezz be.');
    }
}


async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });

    if (res.ok) {
        showSuccessToast('Sikeres kijelentkezés!');

        setTimeout(() => {
            window.location.href = '../login.html';
        }, 1000);
    } else {
        let errorMessage = 'Hiba történt a kijelentkezés során.';
        try {
            const data = await res.json();
            errorMessage = data.error || errorMessage;
        } catch (jsonError) {
            console.error('Hibás szerver válasz:', jsonError);
        }
        showErrorToast(errorMessage);
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
    }, 2500);
}


document.addEventListener('DOMContentLoaded', () => {
    getProfileName();
    getProfilPic();
});


function showLoginPrompt(message = 'A profil megtekintéséhez jelentkezz be.') {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1000';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '30px';
    box.style.borderRadius = '12px';
    box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    box.style.textAlign = 'center';
    box.style.maxWidth = '400px';
    box.style.width = '80%';

    const msg = document.createElement('p');
    msg.textContent = message;
    msg.style.fontSize = '18px';
    msg.style.marginBottom = '20px';

    const button = document.createElement('button');
    button.textContent = 'Bejelentkezés';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';

    button.onclick = () => {
        window.location.href = '../login.html';
    };

    box.appendChild(msg);
    box.appendChild(button);
    container.appendChild(box);
    document.body.appendChild(container);
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
  