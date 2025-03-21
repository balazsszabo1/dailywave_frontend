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
          img.src = `https://nodejs.dszcbaross.edu.hu/server/7b76faf3/files#/dailywave_backend/uploads/${news.index_pic}`; // vagy a helyes kép elérési út
          img.alt = news.news_title;
  
          const title = document.createElement('p');
          title.textContent = news.news_title;
  
          newCard.appendChild(img);
          newCard.appendChild(title);
  
          hirGrid.appendChild(newCard);
        });
      })
      .catch(err => console.error('Hiba a hírek lekérésekor:', err));
  });
  