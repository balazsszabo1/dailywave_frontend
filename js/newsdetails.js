document.addEventListener('DOMContentLoaded', () => {
  // Kinyerjük a news_id-t az URL query paramétereiből
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get('news_id');

  if (!newsId) {
    console.error('Nem található news_id az URL-ben');
    return;
  }

  // Lekérjük az összes hírt
  fetch('/api/news/getAllNews')
    .then(res => res.json())
    .then(newsList => {
      // Kiválasztjuk a megfelelő hírt a news_id alapján
      const news = newsList.find(newsItem => newsItem.id == newsId);

      if (news) {
        // Feltételezve, hogy a válasz tartalmazza a hír részleteit
        const newsTitle = document.querySelector('#hir-cim');
        const newsDescription = document.querySelector('#hir-leiras');
        const newsImage = document.querySelector('#hir-reszletek');

        // Beállítjuk a hír címét, leírását és képeit
        newsTitle.textContent = news.news_title;  // A hír címe
        newsDescription.textContent = news.news;  // A hír szöveges leírása
        newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${news.index_pic}`; // Index kép
      } else {
        console.error('Nem található hír az adott ID-hoz');
      }
    })
    .catch(err => console.error('Hiba a hírek lekérésekor:', err));
});
