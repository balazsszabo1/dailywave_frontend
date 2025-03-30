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





// Keresési gomb eseménykezelője
document.getElementById('searchButton').addEventListener('click', async function() {
  // A keresési kifejezés megszerzése
  const query = document.getElementById('searchQuery').value.trim();

  // Ha nincs megadva keresési kifejezés
  if (!query) {
    alert('Kérlek, add meg a keresési kifejezést!');
    return;
  }

  // A backend hívása a keresési kifejezéssel
  try {
    const response = await fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${query}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Hiba történt a keresés során');
    }

    const data = await response.json();
    
    // Eredmények megjelenítése
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Előző eredmények törlése

    if (data.results.length > 0) {
      const ul = document.createElement('ul');
      data.results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result.news_title;
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    } else {
      resultsDiv.innerHTML = '<p>Nincs találat.</p>';
    }

  } catch (error) {
    console.error('Hiba a keresés során:', error);
    alert('Hiba történt a keresés során: ' + error.message);
  }
});









