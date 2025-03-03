document.addEventListener("DOMContentLoaded", () => {
    const kategoriak = document.querySelectorAll(".kategoriavalaszto");
    let selectedCategory = ""; // Tárolja a kiválasztott kategóriát

    kategoriak.forEach(kategoria => {
        kategoria.addEventListener("click", () => {
            // Minden kategóriáról levesszük az aktív jelölést
            kategoriak.forEach(k => k.classList.remove("aktiv"));

            // Az aktuálisra rárakjuk az aktív osztályt
            kategoria.classList.add("aktiv");

            // Elmentjük a kiválasztott kategóriát
            selectedCategory = kategoria.dataset.kategoria;
            console.log("Kiválasztott kategória:", selectedCategory);
        });
    });

    document.getElementById("mentesGomb").addEventListener("click", () => {
        const headline = document.getElementById("new-name").value;
        const fullTitle = document.getElementById("new-name").value;
        const description = document.querySelector(".hírleírás textarea").value;

        if (!headline || !fullTitle || !description || !selectedCategory) {
            alert("Minden mezőt ki kell tölteni, és ki kell választani egy kategóriát!");
            return;
        }

        const newPost = {
            headline,
            fullTitle,
            description,
            category: selectedCategory
        };

        console.log("Elküldendő adatok:", newPost);
        // Itt lehetne fetch-el beküldeni az adatokat a backendnek
    });
});
