document.addEventListener("DOMContentLoaded", async () => {
    let selectedCategoryId = null;

    // Kategória kiválasztása
    document.querySelectorAll(".kategoriavalaszto").forEach(span => {
        span.addEventListener("click", function () {
            selectedCategoryId = getCategoryID(this.getAttribute("data-kategoria"));

            document.querySelectorAll(".kategoriavalaszto").forEach(s => s.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Kép előnézet beállítása
    document.getElementById("newsImage").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("previewImage").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Hír feltöltése
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        const categoryInput = document.getElementById('category');
        const newsTitle = document.getElementById('new-name').value.trim();
        const newsContent = document.getElementById('news-content').value.trim();
        const newsImage = document.getElementById('newsImage').files.length;
      
        if (!categoryInput.value) {
          alert('Válassz egy kategóriát!');
          event.preventDefault();
          return;
        }
      
        if (!newsTitle || !newsContent || newsImage === 0) {
          alert('Minden mezőt ki kell tölteni!');
          event.preventDefault();
        }
      });
      
        const formData = new FormData();
        formData.append("cat_id", selectedCategoryId);
        formData.append("news_title", newsTitle);
        formData.append("news", newsContent);
        formData.append("image", imageFile);

        try {
            const response = await fetch("/api/news/uploadNews", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Ha van hitelesítés
                },
                body: formData
            });

            const data = await response.json();
            if (data.message) {
                alert("Hír sikeresen feltöltve!");
                location.reload();
            } else {
                alert("Hiba történt a feltöltés során.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Hálózati hiba történt.");
        }
    });

    function getCategoryID(categoryName) {
        const categories = {
            "magyarorszag": 1,
            "hirek": 2,
            "sport": 3,
            "politika": 4
        };
        return categories[categoryName] || null;
    }

