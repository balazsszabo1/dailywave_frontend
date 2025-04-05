document.addEventListener("DOMContentLoaded", () => {
    const topicsList = document.getElementById("topics-list")
    const addTopicBtn = document.getElementById("add-topic-btn");
    const chatSection = document.getElementById("chat-section");
    const chatTitle = document.getElementById("chat-title");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    async function fetchTopics() {
        try {
            const response = await fetch('/api/topics/getAlltopics', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error("HTTP status:", response.status);
                const errorText = await response.text(); // backend hibaüzenet, ha van
                console.error("Error body:", errorText);
                throw new Error('Hozzáférés megtagadva vagy hiba történt az adatok lekérésekor.');
            }

            const topics = await response.json();
            if (!Array.isArray(topics)) {
                throw new Error('Érvénytelen válaszformátum: tömböt vártunk.');
            }
            console.log(topics);

            // Témák kirajzolása
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

    // Add a new topic
    addTopicBtn.addEventListener("click", async () => {
        const title = prompt("Enter the topic title:");
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
                    alert("Topic successfully added!");
                    // Az új téma hozzáadása után frissítjük a témák listáját
                    fetchTopics();  // Frissítjük a témák listáját, hogy az új téma azonnal megjelenjen
                } else {
                    alert(`Failed to add topic: ${data.error || "Unknown error"}`);
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

    // Post a comment
    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const topicId = chatForm.dataset.topicId;
        const comment = chatInput.value;
        const userId = 11; // Replace with the actual user ID logic
    
        try {
            const response = await fetch('/api/topics/addComment', {
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
    
                // Az új komment hozzáadása után frissítjük a kommentek listáját
                const commentsResponse = await fetch(`/api/topics/getComments/${topicId}`);
                const comments = await commentsResponse.json();
    
                chatMessages.innerHTML = comments
                    .map((comment) => `<p><strong>${comment.username}</strong>: ${comment.comment}</p>`)
                    .join("");
            } else {
                alert(`Failed to post comment: ${data.message}`);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again later.");
        }
    });
    

    fetchTopics();
});
