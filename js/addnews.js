const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get('news_id');

// Fetch news details using the newsId
fetch(`/api/news/${newsId}`)
  .then(res => res.json())
  .then(newsDetails => {
    // Display the news details on the page
    document.getElementById('news-title').textContent = newsDetails.news_title;
    document.getElementById('news-content').textContent = newsDetails.news_content;
    // Add other details as needed
  })
  .catch(err => console.error('Hiba a hír részleteinek lekérésekor:', err));
