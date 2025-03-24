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

        // Hover event to change color
        title.addEventListener('mouseenter', () => {
          title.style.color = '#007bff'; // Kék színre változtatás
        });

        title.addEventListener('mouseleave', () => {
          if (news.cat_id === 5) {
            title.style.color = 'red'; // Ha kiemelt hír, marad piros
          } else {
            title.style.color = ''; // Alapértelmezett szín
          }
        });

        newCard.appendChild(img);
        newCard.appendChild(title);

        hirGrid.appendChild(newCard);
      });
    })
    .catch(err => console.error('Hiba a hírek lekérésekor:', err));
});
