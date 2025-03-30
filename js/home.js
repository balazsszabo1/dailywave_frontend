/*
fetch('/api/user/check-admin')
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Nem admin jogosultság.');
    })
    .then(data => {
        if (data.isAdmin) {
            document.getElementById('adminButton').style.display = 'block';
        }
    })
    .catch(error => console.error('Hiba admin ellenőrzésekor:', error));
*/

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
  5: '#kiemelt' // Kiemelt hírek hozzáadása
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/news/getAllNews') // ez az endpoint, amit a backend ad vissza
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
        // Ha a kategória #kiemelt, akkor az 'kiemelt-szurke-grid' kell
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

        // Ha a hír kiemelt, piros színt adunk a címhez
        if (news.cat_id === 5) {
          title.style.color = 'red'; // Piros szín beállítása
        }

        // Add click event to navigate to newsdetails.html
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
  // Lekérjük a bejelentkezett felhasználó adatokat
  fetch("/api/admin/admin-only", {
    credentials: "include", // A cookie-k elküldéséhez szükséges
  })
    .then(res => {
      console.log(res); // Válasz objektum, ellenőrizd a státuszt és a válasz szöveget
      if (!res.ok) {
        throw new Error('Nem jogosult hozzáférés');
      }
      return res.json();
    })
    .then(data => {
      console.log(data); // Ellenőrizd, mit kapsz válaszként
      if (data.role === 1) {
        const adminPanel = document.getElementById("adminPanel");
        adminPanel.style.display = "block"; // Admin gomb megjelenítése
        console.log("Admin panel látható:", adminPanel.style.display);
      } else {
        const adminPanel = document.getElementById("adminPanel");
        adminPanel.style.display = "none"; // Átlag felhasználónál elrejtés
        console.log("Admin panel elrejtve:", adminPanel.style.display);
      }
    })
    .catch(err => {
      console.warn("Hiba történt:", err);
      const adminPanel = document.getElementById("adminPanel");
      adminPanel.style.display = "none"; // Ha nincs bejelentkezve, elrejtjük
    });
});




document.getElementById('searchButton').addEventListener('click', async function () {
  const query = document.getElementById('searchQuery').value.trim();
  const resultsDiv = document.getElementById('searchResults');

  // Ha nincs keresési kifejezés, figyelmeztetjük a felhasználót
  if (!query) {
    alert('Kérlek, add meg a keresési kifejezést!');
    return;
  }

  // Ideiglenes üzenet, amíg várunk a keresési eredményekre
  resultsDiv.innerHTML = '<p>Keresés folyamatban...</p>';

  try {
    // Keresési kifejezés küldése a backend API-hoz
    const response = await fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Hiba történt a keresés során');
    }

    // A válasz adatainak kinyerése
    const data = await response.json();
    console.log(data);  // Ellenőrizzük a válasz adatait a konzolban

    resultsDiv.innerHTML = ''; // Előző keresési eredmények törlése

    if (data.results && data.results.length > 0) {
      // A keresési eredmények listájának megjelenítése
      const ul = document.createElement('ul');
      data.results.forEach(result => {
        const li = document.createElement('li');

        // Link hozzáadása, amely a hír részletes oldalára navigál
        const link = document.createElement('a');
        link.href = `newsdetails.html?news_id=${result.news_id}`; // A hír ID-t paraméterként átadjuk
        link.textContent = result.news_title; // A hír címét jelenítjük meg

        li.appendChild(link);
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    } else {
      resultsDiv.innerHTML = '<p>Nincs találat.</p>';
    }
  } catch (error) {
    console.error('Hiba a keresés során:', error);
    resultsDiv.innerHTML = '<p>Hiba történt a keresés során.</p>';
  }
});






// A gomb, ami megnyitja a modális ablakot
const newsLetterButton = document.querySelector('.newsLetter');

// A modális ablak és a bezáró gomb
const modal = document.getElementById('newsletterModal');
const closeButton = document.querySelector('.close');

// A form és a beküldés kezelése
const newsletterForm = document.getElementById('newsletterForm');

// Amikor a felhasználó rákattint a gombra, a modális ablak megjelenik
newsLetterButton.onclick = () => {
  modal.style.display = 'block';
};

// Amikor a felhasználó rákattint a bezárás gombra, a modális ablak eltűnik
closeButton.onclick = () => {
  modal.style.display = 'none';
};

// Ha a felhasználó kívül kattint a modális ablakon, az is bezáródik
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Form beküldése
newsletterForm.onsubmit = (event) => {
  event.preventDefault(); // Megakadályozza a form alapértelmezett elküldését

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Post kérés küldése a backendre
  fetch('https://nodejs315.dszcbaross.edu.hu/api/news/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message); // Kiírjuk a választ
      modal.style.display = 'none'; // Bezárjuk a modális ablakot
    })
    .catch(error => {
      console.error('Hiba történt:', error);
      alert('Hiba történt a feliratkozás során.');
    });
};






