document.addEventListener("DOMContentLoaded", () => {
    const topicsList = document.getElementById("topics-list");
    const addTopicBtn = document.getElementById("add-topic-btn");
    const chatSection = document.getElementById("chat-section");
    const chatTitle = document.getElementById("chat-title");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    const BASE_URL = "https://nodejs315.dszcbaross.edu.hu"; // Backend base URL

    async function fetchTopics() {
        try {
            const response = await fetch(`${BASE_URL}/api/topics/getAlltopics`, {
                method: 'GET',
                credentials: 'include', // Sütik küldése
            });

            if (!response.ok) {
                throw new Error('Hozzáférés megtagadva vagy hiba történt az adatok lekérésekor.');
            }

            const topics = await response.json();
            if (!Array.isArray(topics)) {
                throw new Error('Érvénytelen válaszformátum: tömböt vártunk.');
            }

            // Témák kirajzolása
            topicsList.innerHTML = topics.map(topic => `
                <tr>
                    <td><a href="#" data-id="${topic.topic_id}" class="topic-link">${topic.topic_title}</a></td>
                    <td>${topic.username}</td>
                    <td>${topic.last_comment || "No comments yet"}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching topics:', error.message);
            alert('Nem sikerült betölteni a fórum témákat. Kérlek, jelentkezz be újra!');
        }
    }

    // Bejelentkezési ellenőrzés minden oldalon
    async function checkLoginStatus() {
        try {
            // Ellenőrizni, hogy a felhasználó be van-e jelentkezve
            const res = await fetch('http://127.0.0.1:3000/api/auth/checkAuth', {
                method: 'GET',
                credentials: 'include', // Az authentikációs süti elküldése
            });

            // Ha a válasz nem OK, irányítsuk át a bejelentkezési oldalra
            if (!res.ok) {
                alert('Kérlek, jelentkezz be!');
                window.location.href = 'login.html'; // Átirányítás a login oldalra
            }
        } catch (error) {
            console.error('Hiba történt a hitelesítés ellenőrzésekor:', error);
            alert('Nem sikerült ellenőrizni a bejelentkezési állapotot.');
            window.location.href = 'login.html'; // Ha hiba történt, irányítás a login oldalra
        }
    }

    // Hívjuk meg ezt a funkciót minden oldalon, ahol szükséges a bejelentkezés ellenőrzése
    document.addEventListener('DOMContentLoaded', checkLoginStatus);


    // Add a new topic
    addTopicBtn.addEventListener("click", async () => {
        const title = prompt("Enter the topic title:");
        if (title) {
            try {
                const response = await fetch('http://localhost:3000/api/topics/uploadTopic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        // A cookie automatikusan elküldésre kerül, ha a credentials be van állítva
                    },
                    credentials: 'include',  // Ez biztosítja, hogy a cookie átkerüljön
                    body: JSON.stringify({ topic_title: title })
                });
    
                const data = await response.json();
                console.log("Response Data:", data); // Hozzáadott naplózás
    
                if (response.ok) {
                    alert("Topic successfully added!");
                    // Frissítheted a topic listát, ha szükséges
                } else {
                    alert(`Failed to add topic: ${data.message || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Error adding topic:", error);
                alert("Failed to add topic. Please try again later.");
            }
        }
    });



    // Handle topic selection
    topicsList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("topic-link")) {
            event.preventDefault();
            const topicId = event.target.dataset.id;

            // Show chat section
            chatSection.style.display = "block";
            chatTitle.textContent = event.target.textContent;

            // Fetch and display comments for the topic
            const response = await fetch(`${BASE_URL}/api/topics/getComments/${topicId}`, {
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

    // Post a comment
    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const topicId = chatForm.dataset.topicId;
        const comment = chatInput.value;
        const userId = 11; // Replace with the actual user ID logic

        try {
            const response = await fetch(`${BASE_URL}/api/topics/addComment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic_id: topicId, comment, user_id: userId }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successfully added the comment
                chatInput.value = "";
                alert("Comment added successfully!");
                // Optionally refresh comments here
            } else {
                // Display the error message from the backend
                alert(`Failed to post comment: ${data.message}`);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again later.");
        }
    });

    fetchTopics();
});
