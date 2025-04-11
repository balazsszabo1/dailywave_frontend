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
    showErrorToast('Minden mező kitöltése kötelező!');
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
        showErrorToast('Hiba: ' + data.error);
      } else {
        showSuccessToast('Sikeres feltöltés!');
        
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

        // Redirect to home.html after 2.5 seconds
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 500);

        console.log('Kategória megmaradt:', selectedCategory.getAttribute('data-kategoria'));
      }
    })
    .catch(error => {
      console.error('Hiba a feltöltés során:', error);
      showErrorToast('Hiba történt a feltöltés közben.');
    });
});

// Success Toast
function showSuccessToast(message) {
  showToast(message, '#28a745'); // Zöld
}

// Error Toast
function showErrorToast(message) {
  showToast(message, '#dc3545'); // Piros
}

function showToast(message, bgColor) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = bgColor;
  toast.style.color = '#fff';
  toast.style.padding = '14px 24px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  toast.style.fontSize = '16px';
  toast.style.zIndex = '1000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);

  // Remove after 2.5s
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
