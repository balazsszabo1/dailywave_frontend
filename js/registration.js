const btnReg = document.getElementById('btnReg');
btnReg.addEventListener('click', register);

async function register() {
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const psw = document.getElementById('psw').value.trim();
    const psw2 = document.getElementById('psw2').value.trim();

    if (psw !== psw2) {
        return showErrorToast('A két jelszó nem egyezik!');
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password: psw }),
            credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
            resetInputs();
            showSuccessToast(data.message || 'Sikeres regisztráció!');
            setTimeout(() => window.location.href = '../login.html', 1000);
        } else {
            handleErrors(data);
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        showErrorToast('Hiba történt a szerverrel való kommunikáció során. Próbáld újra később.');
    }
}

function handleErrors(data) {
    if (data.errors && Array.isArray(data.errors)) {
        const errorMessage = data.errors.map(err => err.error).join('\n');
        showErrorToast(errorMessage || 'Hiba történt.');
    } else if (data.error) {
        showErrorToast(data.error || 'Ismeretlen hiba történt.');
    } else {
        showErrorToast('Ismeretlen hiba történt.');
    }
}

function resetInputs() {
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';
    document.getElementById('psw').value = '';
    document.getElementById('psw2').value = '';
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
    }, 1000);

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
  