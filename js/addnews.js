let selectedCategoryId = null;
const categoryElements = document.querySelectorAll('.kategoriavalaszto');
const fileInput = document.getElementById('fileInput');
const kepHely = document.querySelector('.kephozzaadas img');  // Az a <img>, amit frissítünk majd

// Kategória választás eseménykezelő
categoryElements.forEach(elem => {
  elem.addEventListener('click', () => {
    categoryElements.forEach(el => el.classList.remove('kivalasztva')); // törli az előzőt
    elem.classList.add('kivalasztva'); // kijelöli az aktuálisat
    selectedCategoryId = elem.getAttribute('data-kategoria');
    console.log('Kiválasztott kategória:', selectedCategoryId);
  });
});

// Kép kiválasztás és előnézet megjelenítés
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      kepHely.src = e.target.result;  // Frissíti a kép src-jét a betöltött fájl adatával
    };

    reader.readAsDataURL(file);
  }
});

document.getElementById('mentesGomb').addEventListener('click', () => {
  const titleInput = document.getElementById('new-name');
  const descriptionInput = document.getElementById('new-description');

  const news_title = titleInput.value.trim();
  const news = descriptionInput.value.trim();
  const cat_id = selectedCategoryId;
  const index_pic = fileInput.files[0];

  if (!cat_id || !news_title || !news || !index_pic) {
    alert('Minden mező kitöltése kötelező!');
    return;
  }

  const formData = new FormData();
  formData.append('cat_id', cat_id);
  formData.append('news_title', news_title);
  formData.append('news', news);
  formData.append('index_pic', index_pic);

  fetch('/api/news/uploadNews', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert('Hiba: ' + data.error);
    } else {
      alert('Sikeres feltöltés!');

      // Űrlap alaphelyzetbe állítása
      titleInput.value = '';
      descriptionInput.value = '';
      fileInput.value = '';
      kepHely.src = 'img/beszúrás.png';  // Reset az eredeti képre
      categoryElements.forEach(el => el.classList.remove('kivalasztva'));
      selectedCategoryId = null;
    }
  })
  .catch(error => {
    console.error('Hiba a feltöltés során:', error);
    alert('Hiba történt a feltöltés közben.');
  });
});
