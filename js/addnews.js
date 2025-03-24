document.addEventListener('DOMContentLoaded', () => {
  // Kinyerjük a news_id-t az URL query paramétereiből
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get('news_id');
  
  console.log('news_id az URL-ből:', newsId);  // Debug log

  if (!newsId) {
    console.error('Nem található news_id az URL-ben');
    alert('Hiba: A hír azonosító nem található!');
    return;
  }

  // Lekérjük az összes hírt
  fetch(`/api/news/getAllNews`)
    .then(res => res.json())
    .then(newsList => {
      console.log('Válasz hírek listája:', newsList);  // Debug log

      // Kiválasztjuk a megfelelő hírt a news_id alapján
      const news = newsList.find(newsItem => String(newsItem.id) === String(newsId));

      if (news) {
        const newsTitle = document.querySelector('#hir-cim');
        const newsDescription = document.querySelector('#hir-leiras');
        const newsImage = document.querySelector('#hir-reszletek');

        newsTitle.textContent = news.news_title;
        newsDescription.textContent = news.news;
        newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${news.index_pic}`;
      } else {
        console.error('Nem található hír az adott ID-hoz');
        alert('Hiba: A keresett hír nem található.');
      }
    })
    .catch(err => {
      console.error('Hiba a hír részleteinek lekérésekor:', err);
      alert('Hiba történt a hír lekérése közben.');
    });
});
