document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('news_id'); // Lekérjük a news_id paramétert az URL-ből
  
    if (!newsId) {
      alert('Nincs megadva hír azonosító!');
      return;
    }
  
    fetch('/api/news/getAllNews') // Lekérjük az összes hírt
      .then(res => res.json())
      .then(newsList => {
        // Megkeressük az adott hírt a listában a news_id alapján
        const selectedNews = newsList.find(news => news.id === parseInt(newsId));
  
        if (!selectedNews) {
          alert('Nem található ilyen hír!');
          return;
        }
  
        // Beállítjuk a hír részleteit a HTML elemeken
        const newsTitle = document.getElementById('hir-cim');
        const newsDescription = document.getElementById('hir-leiras');
        const newsImage = document.getElementById('hir-kep');
  
        newsTitle.textContent = selectedNews.news_title;  // Hír címe
        newsDescription.textContent = selectedNews.news;  // Hír leírása
        newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${selectedNews.index_pic}`;  // Hír képe
  
        // Ha a hír kiemelt, akkor piros színű lesz a cím
        if (selectedNews.cat_id === 5) {
          newsTitle.style.color = 'red';
        }
      })
      .catch(err => {
        console.error('Hiba a hír részleteinek betöltésekor:', err);
        alert('Hiba történt a hír betöltése során.');
      });
  });
  