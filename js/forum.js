document.addEventListener("DOMContentLoaded", () => {
    const topicsList = document.getElementById("topics-list");
    const addTopicBtn = document.getElementById("add-topic-btn");
    const chatSection = document.getElementById("chat-section");
    const chatTitle = document.getElementById("chat-title");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    let currentUser = null;  // A bejelentkezett felhasználó adatainak tárolása

    // Bejelentkezett felhasználó adatainak lekérése
    async function fetchCurrentUser() {
        try {
            const response = await fetch('/api/users/getCurrentUser', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                currentUser = await response.json();
                console.log("Bejelentkezett felhasználó:", currentUser);
            } else {
                console.error("Nem sikerült lekérni a felhasználó adatokat.");
            }
        } catch (error) {
            console.error("Hiba történt a felhasználó adatainak lekérésekor:", error);
        }
    }

    // Fórum témák lekérése
    async function fetchTopics() {
        try {
            const response = await fetch('/api/topics/getAlltopics', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error("HTTP status:", response.status);
                const errorText = await response.text();
                console.error("Error body:", errorText);
                throw new Error('Hozzáférés megtagadva vagy hiba történt az adatok lekérésekor.');
            }

            const topics = await response.json();
            if (!Array.isArray(topics)) {
                throw new Error('Érvénytelen válaszformátum: tömböt vártunk.');
            }

            topicsList.innerHTML = topics.map(topic => `
                <tr>
                    <td><a href="#" data-id="${topic.topic_id}" class="topic-link">${topic.topic_title}</a></td>
                    <td>${topic.username}</td>
                    <td>${topic.last_comment || "Nincsenek még hozzászólások."}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching topics:', error.message);
            alert('Nem sikerült betölteni a fórum témákat. Kérlek, jelentkezz be újra!');
        }
    }

    // Téma hozzáadása
    addTopicBtn.addEventListener("click", async () => {
        const title = prompt("Írd be a téma címét");
        if (title) {
            try {
                const response = await fetch('/api/topics/uploadTopic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ topic_title: title })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Téma sikeresen hozzáadva!");
                    fetchTopics();
                } else {
                    alert(`Téma hozzáadása sikertelen: ${data.error || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                console.error("Error adding topic:", error);
                alert("Hiba történt a téma hozzáadása közben: Kérlek, próbáld újra később!");
            }
        }
    });

    // Kattintás esemény a témákra (hozzászólások megjelenítése)
    topicsList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("topic-link")) {
            event.preventDefault();
            const topicId = event.target.dataset.id;

            chatSection.style.display = "block";
            chatTitle.textContent = event.target.textContent;

            const response = await fetch(`/api/topics/getComments/${topicId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const comments = await response.json();
            chatMessages.innerHTML = comments
                .map((comment) => `<p><strong>${comment.username}</strong>: ${comment.comment}</p>`)
                .join("");

            chatForm.dataset.topicId = topicId;
        }
    });

    // Hozzászólás hozzáadása
    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!currentUser) {
            alert("Kérlek, jelentkezz be a hozzászóláshoz!");
            return;
        }

        const topicId = chatForm.dataset.topicId;
        const comment = chatInput.value;

        try {
            const response = await fetch('/api/topics/addComment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    topic_id: topicId,
                    comment: comment,
                    user_id: currentUser.user_id  // Bejelentkezett felhasználó ID-ja
                }),
            });

            const data = await response.json();

            if (response.ok) {
                chatInput.value = "";
                alert("Komment sikeresen hozzáadva!");

                const commentsResponse = await fetch(`/api/topics/getComments/${topicId}`);
                const comments = await commentsResponse.json();

                chatMessages.innerHTML = comments
                    .map((comment) => `<p><strong>${comment.username}</strong>: ${comment.comment}</p>`)
                    .join("");
            } else {
                alert(`Komment hozzáadása sikertelen: ${data.message}`);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Hiba történt a komment hozzáadásakor: Kérlek, próbáld újra később!");
        }
    });

    // Kérjük le a bejelentkezett felhasználót
    fetchCurrentUser();

    // Kérjük le a témákat
    fetchTopics();
});
