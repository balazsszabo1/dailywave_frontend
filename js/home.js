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

document.getElementById('searchButton').addEventListener('click', async function () {
  const query = document.getElementById('searchQuery').value.trim();
  const resultsDiv = document.getElementById('searchResults');

  if (!query) {
    alert('Kérlek, add meg a keresési kifejezést!');
    return;
  }

  resultsDiv.innerHTML = '<p>Keresés folyamatban...</p>';

  try {
    const response = await fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Hiba történt a keresés során');
    }

    const data = await response.json();
    console.log(data);

    resultsDiv.innerHTML = '';

    if (data.results && data.results.length > 0) {
      const ul = document.createElement('ul');
      data.results.forEach(result => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.href = `newsdetails.html?news_id=${result.news_id}`;
        link.textContent = result.news_title;

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
      alert(data.message);
      modal.style.display = 'none';
    })
    .catch(error => {
      console.error('Hiba történt:', error);
      alert('Hiba történt a feliratkozás során.');
    });
};