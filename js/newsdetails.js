document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('news_id');

    if (!newsId) {
        alert('Nincs megadva hír azonosító!');
        return;
    }

    fetch(`/api/news/getNewsById?news_id=${newsId}`)
        .then(res => res.json())
        .then(news => {
            if (news.error) {
                alert('Nem található ilyen hír!');
                return;
            }

            const newsTitle = document.getElementById('hir-cim');
            const newsDescription = document.getElementById('hir-leiras');
            const newsImage = document.getElementById('hir-kep');

            newsTitle.textContent = news.news_title;
            newsDescription.textContent = news.news;
            newsImage.src = `https://nodejs315.dszcbaross.edu.hu/uploads/${news.index_pic}`;

            if (news.cat_id === 5) {
                newsTitle.style.color = 'red';
            }
        })
        .catch(err => {
            console.error('Hiba a hír betöltésekor:', err);
            alert('Hiba történt a hír betöltése során.');
        });
});