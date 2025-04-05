let selectedCategory = null;
const categoryElements = document.querySelectorAll('.kategoriavalaszto');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('hirkephozzaadas');

categoryElements.forEach(elem => {
  elem.addEventListener('click', () => {
    if (selectedCategory) {
      selectedCategory.classList.remove('kivalasztva');
    }

    elem.classList.add('kivalasztva');
    selectedCategory = elem;
    console.log('Kiválasztott kategória:', selectedCategory.getAttribute('data-kategoria'));
  });
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.objectFit = 'cover';
    };

    reader.readAsDataURL(file);
  }
});

document.getElementById('mentesGomb').addEventListener('click', () => {
  const titleInput = document.getElementById('new-name');
  const descriptionInput = document.getElementById('new-description');

  const news_title = titleInput.value.trim();
  const news = descriptionInput.value.trim();
  const cat_id = selectedCategory ? selectedCategory.getAttribute('data-kategoria') : null;
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

        titleInput.value = '';
        descriptionInput.value = '';

        const newFileInput = fileInput.cloneNode(true);
        fileInput.replaceWith(newFileInput);

        newFileInput.addEventListener('change', () => {
          const file = newFileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });

        previewImage.src = 'img/hirkephozzaadas.png';

        console.log('Kategória megmaradt:', selectedCategory.getAttribute('data-kategoria'));
      }
    })
    .catch(error => {
      console.error('Hiba a feltöltés során:', error);
      alert('Hiba történt a feltöltés közben.');
    });
});