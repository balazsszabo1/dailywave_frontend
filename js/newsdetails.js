document.addEventListener('DOMContentLoaded', () => {
    // Lekérjük az URL paramétereket
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id'); // A hír ID, amit az URL-ben kaptunk

    // Ha nincs hír ID, hibaüzenet
    if (!newsId) {
        alert("Hiba! Nincs megadva hír ID.");
        return;
    }

    // API hívás a hír részleteinek lekérésére
    fetch(`/api/news/${newsId}`)
        .then(response => response.json())
        .then(data => {
            // Ha hiba történik az API válaszában
            if (data.error) {
                alert(data.error);
            } else {
                // A hír adatainak megjelenítése
                document.getElementById('hir-cim').innerText = data.news_title; // Hír cím
                document.getElementById('hir-leiras').innerText = data.news; // Hír leírás
                const imageElement = document.getElementById('hir-reszletek');
                
                // A kép URL-je, amit a backend visszaadott
                imageElement.src = `https://nodejs.dszcbaross.edu.hu/uploads/${data.index_pic}`; 
            }
        })
        .catch(error => {
            console.error('Hiba történt a hír lekérésekor:', error);
            alert('Hiba történt a hír lekérése közben.');
        });
});
 