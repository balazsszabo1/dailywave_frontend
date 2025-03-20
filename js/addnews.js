let selectedCategoryId = null;
const categoryElements = document.querySelectorAll('.kategoriavalaszto');

// Kategória választás eseménykezelő
categoryElements.forEach(elem => {
  elem.addEventListener('click', () => {
    if (elem.classList.contains('kivalasztva')) {
      return; // Ha már ki van választva, ne csináljon semmit
    }

    categoryElements.forEach(el => el.classList.remove('kivalasztva')); // Eltávolítja az előző kijelölést
    elem.classList.add('kivalasztva'); // Kijelöli az új kategóriát
    selectedCategoryId = elem.getAttribute('data-kategoria');
    console.log('Kiválasztott kategória:', selectedCategoryId);
  });
});

document.getElementById('mentesGomb').addEventListener('click', () => {
  const titleInput = document.getElementById('new-name');
  const descriptionInput = document.getElementById('new-description');
  const fileInput = document.getElementById('fileInput');

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

      // Csak a szövegmezőket és a fájlinputot töröljük, de a kategóriát megtartjuk
      titleInput.value = '';
      descriptionInput.value = '';

      // Fájl input törlése
      const newFileInput = fileInput.cloneNode(true);
      fileInput.replaceWith(newFileInput);

      // Kategória KIJELÖLVE MARAD feltöltés után is!
    }
  })
  .catch(error => {
    console.error('Hiba a feltöltés során:', error);
    alert('Hiba történt a feltöltés közben.');
  });
});
