document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('news_id');
  
    if (!newsId) {
      alert('Nincs megadva hír azonosító!');
      return;
    }
  
    fetch('/api/news/getAllNews') // Az összes hír lekérése
      .then(res => res.json())
      .then(newsList => {
        // Keresés az összes hír között az id alapján
        const selectedNews = newsList.find(news => news.id === parseInt(newsId));
  
        if (!selectedNews) {
          alert('Nem található ilyen hír!');
          return;
        }
  
        const newsTitle = document.getElementById('hir-cim');
        const newsDescription = document.getElementById('hir-leiras');
        const newsImage = document.getElementById('hir-kep');
  
        // Beállítjuk a hír címét, leírását és képét
        newsTitle.textContent = selectedNews.news_title;
        newsDescription.textContent = selectedNews.news;
        newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${selectedNews.index_pic}`;
  
        // Ha a hír kiemelt, akkor egy speciális stílust alkalmazhatunk
        if (selectedNews.cat_id === 5) {
          newsTitle.style.color = 'red'; // Kiemelt hírek piros színű címe
        }
      })
      .catch(err => {
        console.error('Hiba a hír részleteinek betöltésekor:', err);
        alert('Hiba történt a hír betöltése során.');
      });
  });
  
  