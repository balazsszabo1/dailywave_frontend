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



document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchQuery');
    const resultsContainer = document.getElementById('searchResults');
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
  
      if (query.length === 0) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }
  
      fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results;
          resultsContainer.innerHTML = '';
          resultsContainer.style.display = 'block';
  
          results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.textContent = item.news_title;
            resultItem.style.padding = '10px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #eee';
  
            // Kattintáskor átirányít a newsdetails.html oldalra
            resultItem.addEventListener('click', () => {
              // Az átirányítás az ID alapján történik
              window.location.href = `https://dailywave.netlify.app/newsdetails.html?news_id=${item.news_id}`;
            });
  
            resultsContainer.appendChild(resultItem);
          });
        })
        .catch(err => {
          resultsContainer.innerHTML = '<div style="padding: 10px; color: red;">Nincs találat</div>';
          resultsContainer.style.display = 'block';
        });
    });
  
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        resultsContainer.style.display = 'none';
      }, 200);
    });
  
    searchInput.addEventListener('focus', () => {
      if (resultsContainer.innerHTML.trim() !== '') {
        resultsContainer.style.display = 'block';
      }
    });
  });
  