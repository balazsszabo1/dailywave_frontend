window.addEventListener('DOMContentLoaded', () => {
    // Lekérjük az URL-ből a hír ID-ját
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id'); // Az URL-ből kivesszük az id paramétert (pl. ?id=1)
  
    // Ha nincs id paraméter, visszairányítjuk a felhasználót a főoldalra
    if (!newsId) {
      window.location.href = 'home.html'; // Ha nincs id, akkor a home.html oldalra irányítjuk
    }
  
    // API hívás a hír részleteinek lekérésére
    fetch(`/api/news/${newsId}`)  // Kérés az API-ra a hír ID alapján
      .then(response => response.json())
      .then(data => {
        // Ha hiba történt vagy nem található adat
        if (data.error) {
          alert('Hiba történt a hír betöltése közben.');
        } else {
          // Ha sikerült lekérni a hír adatait, megjelenítjük a megfelelő elemekben
          document.getElementById('hir-cim').textContent = data.news_title;  // A hír címének beállítása
          document.getElementById('hir-leiras').textContent = data.news;      // A hír leírásának beállítása
          document.getElementById('hir-reszletek').src = `/uploads/${data.index_pic}`; // A hír képének beállítása
        }
      })
      .catch(err => {
        console.error('Hiba a hír betöltése közben:', err); // Hibaüzenet a konzolon
        alert('Hiba történt a hír betöltése közben.');
      });
  });
  
 