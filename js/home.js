async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  console.log(res);
  if (res.ok) {
    window.location.href = '../home.html';
  } else {
    alert(JSON.stringify(res));
  }
}

const categoryIdToSection = {
  1: '#magyarorszag',
  2: '#altalanos',
  3: '#sport',
  4: '#politika',
  5: '#kiemelt'
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/news/getAllNews')
    .then(res => res.json())
    .then(newsList => {
      newsList.forEach(news => {
        const sectionSelector = categoryIdToSection[news.cat_id];
        const section = document.querySelector(sectionSelector);

        if (!section) {
          console.error('Nem található a kategória szekció!', sectionSelector);
          return;
        }

        let hirGrid;
        if (news.cat_id === 5) {
          hirGrid = section.querySelector('.kiemelt-szurke-grid');
        } else {
          hirGrid = section.querySelector('.hír-grid');
        }

        const newCard = document.createElement('div');
        newCard.classList.add('hír-kártya');

        const img = document.createElement('img');
        img.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${news.index_pic}`;
        img.alt = news.news_title;

        const title = document.createElement('p');
        title.textContent = news.news_title;

        if (news.cat_id === 5) {
          title.style.color = 'red';
        }

        newCard.addEventListener('click', () => {
          window.location.href = `newsdetails.html?news_id=${news.news_id}`;
        });

        newCard.appendChild(img);
        newCard.appendChild(title);

        hirGrid.appendChild(newCard);
      });
    })
    .catch(err => console.error('Hiba a hírek lekérésekor:', err));
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/admin/admin-only", {
    credentials: "include",
  })
    .then(res => {
      console.log(res);
      if (!res.ok) {
        throw new Error('Nem jogosult hozzáférés');
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      if (data.role === 1) {
        const adminPanel = document.getElementById("adminPanel");
        adminPanel.style.display = "block";
        console.log("Admin panel látható:", adminPanel.style.display);
      } else {
        const adminPanel = document.getElementById("adminPanel");
        adminPanel.style.display = "none";
        console.log("Admin panel elrejtve:", adminPanel.style.display);
      }
    })
    .catch(err => {
      console.warn("Hiba történt:", err);
      const adminPanel = document.getElementById("adminPanel");
      adminPanel.style.display = "none";
    });
});




const newsLetterButton = document.querySelector('.newsLetter');

const modal = document.getElementById('newsletterModal');
const closeButton = document.getElementById('closeModal');

const newsletterForm = document.getElementById('newsletterForm');

newsLetterButton.onclick = () => {
  modal.style.display = 'block';
};

closeButton.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

newsletterForm.onsubmit = (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  fetch('https://nodejs315.dszcbaross.edu.hu/api/news/newsLetter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        showSuccessToast(data.message);
        
        // Redirect to home.html after the toast
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 1000);
      }
    })
    .catch(error => {
      console.error('Hiba történt:', error);
      showErrorToast('Hiba történt a feliratkozás során.');
    });
};

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






document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchQuery');
  const resultsDiv = document.getElementById('searchResults');

  // Keresés indítása
  searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    resultsDiv.innerHTML = '';

    if (!query) {
      resultsDiv.innerHTML = '<p class="text-danger mt-2">Adj meg egy keresési kifejezést!</p>';
      return;
    }

    fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          data.results.forEach(item => {
            const link = document.createElement('a');
            link.href = `home.html?highlight=${encodeURIComponent(item.news_title)}`;
            link.textContent = item.news_title;
            link.className = 'd-block mt-2 text-decoration-none';
            link.style.color = '#007bff';
            resultsDiv.appendChild(link);
          });
        } else if (data.message) {
          resultsDiv.innerHTML = `<p class="text-warning mt-2">${data.message}</p>`;
        } else {
          resultsDiv.innerHTML = '<p class="text-danger mt-2">Nem található eredmény.</p>';
        }
      })
      .catch(err => {
        console.error('Hiba a lekérdezés során:', err);
        resultsDiv.innerHTML = '<p class="text-danger mt-2">Hiba történt a keresés során.</p>';
      });
  });
});
