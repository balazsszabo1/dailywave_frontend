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


//Feliratkozás a hírlevélre
document.addEventListener("DOMContentLoaded", () => {
    const newsletterButton = document.querySelector(".newsLetter");
  
    if (newsletterButton) {
      newsletterButton.addEventListener("click", feliratkozas);
    }
  });
  
  function feliratkozas() {
    const email = prompt("Kérjük, adja meg az e-mail címét a feliratkozáshoz:");
  
    if (email && validateEmail(email)) {
      alert("Köszönjük! Sikeresen feliratkozott a hírlevelünkre: " + email);
      // Esetleg elmentheted localStorage-be is:
      // localStorage.setItem('feliratkozott', email);
    } else if (email !== null) {
      alert("Helytelen e-mail cím! Próbálja újra.");
    }
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }






// 🌐 Állítsd be az API és a képek elérési útját!
const API_BASE_URL = 'https://dailywave.netlify.app/api'; // API endpointok alap URL-je
const IMAGE_BASE_URL = 'https://dailywave.netlify.app/api/uploads'; // Kép URL alapja

// 🔗 Kategória ID -> Szekció
const categoryIdToSection = {
  1: '#magyarorszag',
  2: '#altalanos',
  3: '#sport',
  4: '#politika',
  5: '#kiemelt'
};

// 🎨 Hírkártya generátor
function createNewsCard(news) {
  const card = document.createElement('div');
  card.classList.add('hír-kártya');

  // 📷 Kép elem
  const img = document.createElement('img');
  img.src = `${IMAGE_BASE_URL}/${news.index_pic}`;
  img.alt = news.news_title || 'Hír képe';
  
  // 🔧 Hiba esetén alapértelmezett kép
  img.onerror = () => {
    console.warn(`Nem található a kép: ${img.src}`);
    img.src = 'img/hirkephozzaadas.png'; // vagy bármilyen default placeholder képed
  };

  // 📝 Cím elem
  const title = document.createElement('p');
  title.textContent = news.news_title || 'Cím nélkül';

  // ➕ Összeállítás
  card.appendChild(img);
  card.appendChild(title);

  return card;
}

// 🚀 Hírek lekérése és megjelenítése
async function fetchAndDisplayNews() {
  try {
    const response = await fetch(`${API_BASE_URL}/news/getAllNews`);

    if (!response.ok) {
      throw new Error(`Hiba a hírek lekérésekor: ${response.status} ${response.statusText}`);
    }

    const newsList = await response.json();

    if (!Array.isArray(newsList)) {
      throw new Error('Nem tömböt kaptunk vissza az API-tól!');
    }

    newsList.forEach(news => {
      const sectionSelector = categoryIdToSection[news.cat_id];

      if (!sectionSelector) {
        console.warn(`Ismeretlen kategória ID (${news.cat_id})`);
        return;
      }

      const section = document.querySelector(sectionSelector);

      if (!section) {
        console.warn(`Nem található szekció: ${sectionSelector}`);
        return;
      }

      // Grid kiválasztása
      const grid = section.querySelector('.kiemelt-szurke-grid') || section.querySelector('.hír-grid');

      if (!grid) {
        console.warn(`Nem található grid a szekcióban: ${sectionSelector}`);
        return;
      }

      const newsCard = createNewsCard(news);
      grid.appendChild(newsCard);
    });

  } catch (error) {
    console.error('Hiba történt a hírek betöltése közben:', error.message);
  }
}

// ✅ Indítás a DOM betöltése után
document.addEventListener('DOMContentLoaded', fetchAndDisplayNews);

  