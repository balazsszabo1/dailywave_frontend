document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('news_id'); // Retrieve the news_id from the URL

    if (!newsId) {
        alert('Nincs megadva hír azonosító!');
        return;
    }

    // Fetch the news details using the news_id
    fetch(`/api/news/getNewsById?news_id=${newsId}`)
        .then(res => res.json())
        .then(news => {
            if (news.error) {
                alert('Nem található ilyen hír!');
                return;
            }

            // Populate the page with the fetched news details
            const newsTitle = document.getElementById('hir-cim');
            const newsDescription = document.getElementById('hir-leiras');
            const newsImage = document.getElementById('hir-kep');

            newsTitle.textContent = news.news_title; // Set news title
            newsDescription.textContent = news.news; // Set news description
            newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${news.index_pic}`; // Set news image

            if (news.cat_id === 5) {
                newsTitle.style.color = 'red'; // If it's a highlighted news, change the title color
            }
        })
        .catch(err => {
            console.error('Hiba a hír betöltésekor:', err);
            alert('Hiba történt a hír betöltése során.');
        });
});
