document.addEventListener("DOMContentLoaded", () => {
    let selectedCategoryId = null;

    // Kategóriák eseményfigyelői
    document.querySelectorAll(".kategoriavalaszto").forEach(span => {
        span.addEventListener("click", function () {
            // Kijelölt kategória frissítése
            selectedCategoryId = getCategoryID(this.getAttribute("data-kategoria"));

            // Az aktív stílus beállítása
            document.querySelectorAll(".kategoriavalaszto").forEach(s => s.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Hír feltöltés a "Mentés" gombra kattintva
    document.getElementById("mentesGomb").addEventListener("click", () => {
        const newsTitle = document.querySelectorAll("#new-name")[0].value.trim();
        //const newsIndexTitle = document.querySelectorAll("#new-name")[1].value.trim();
        const newsContent = document.querySelector(".hírleírás textarea").value.trim();
        const indexPic = "asd23.jpg"; // Kép URL helyettesítő

        if (!selectedCategoryId || !newsTitle || !newsContent) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        const newsData = {
            cat_id: selectedCategoryId,
            news_title: newsTitle,
            news: newsContent,
            index_pic: indexPic
        };

        // Adatok elküldése a backendnek
        fetch("/api/news/uploadNews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newsData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Hír sikeresen feltöltve!");
                location.reload();
            } else {
                alert("Hiba történt a feltöltés során.");
            }
        })
        .catch(error => {
            console.error("Hálózati hiba:", error);
            alert("Hálózati hiba történt.");
        });
    });

    // Kategória azonosítók lekérése
    function getCategoryID(categoryName) {
        const categories = {
            "magyarorszag": 1,
            "hirek": 2,
            "sport": 3,
            "politika": 4
        };
        return categories[categoryName] || null;
    }
});
