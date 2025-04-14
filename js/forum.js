document.addEventListener("DOMContentLoaded", () => {
    const topicsList = document.getElementById("topics-list");
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
                const errorText = await response.text();
                console.error("Error body:", errorText);
                throw new Error('Hozzáférés megtagadva vagy hiba történt az adatok lekérésekor.');
            }

            const topics = await response.json();
            if (!Array.isArray(topics)) {
                throw new Error('Érvénytelen válaszformátum: tömböt vártunk.');
            }
            console.log(topics);

            topicsList.innerHTML = topics.map(topic => `
                <tr>
                    <td><a href="#" data-id="${topic.topic_id}" class="topic-link">${topic.topic_title}</a></td>
                    <td>${topic.username}</td>
                    <td>${topic.last_comment || "Nincsenek még hozzászólások."}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching topics:', error.message);
            showErrorToast('Hiba történt a témák betöltésekor. Kérlek próbáld újra!');
        }
    }

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
            setTimeout(() => toast.remove(), 1000);
        }, 2500);
    }

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
                    showSuccessToast("Téma sikeresen hozzáadva!");
                    fetchTopics();
                } else {
                    showErrorToast(`Hiba történt a téma hozzáadása közben: ${data.error || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                console.error("Error adding topic:", error);
                showErrorToast("Hiba történt a téma hozzáadása közben: Kérlek, próbáld újra később!");
            }
        }
    });

    topicsList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("topic-link")) {
            event.preventDefault();
            const topicId = event.target.dataset.id;

            chatSection.style.display = "block";
            chatTitle.textContent = event.target.textContent;

            try {
                const response = await fetch(`/api/topics/getComments/${topicId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const comments = await response.json();
                chatMessages.innerHTML = comments
                    .map((comment) => `<p><strong>${comment.username}</strong>: ${comment.comment}</p>`)
                    .join("");

                chatForm.dataset.topicId = topicId;
            } catch (error) {
                showErrorToast("Hiba történt a hozzászólások betöltésekor!");
            }
        }
    });

    chatForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const topicId = chatForm.dataset.topicId;
        const comment = chatInput.value;

        try {
            const response = await fetch('/api/topics/addComment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic_id: topicId, comment }),
            });

            const data = await response.json();

            if (response.ok) {
                chatInput.value = "";
                showSuccessToast("Komment sikeresen hozzáadva!");

                const commentsResponse = await fetch(`/api/topics/getComments/${topicId}`);
                const comments = await commentsResponse.json();

                chatMessages.innerHTML = comments
                    .map((comment) => `<p><strong>${comment.username}</strong>: ${comment.comment}</p>`)
                    .join("");
            } else {
                showErrorToast(`Hiba történt a komment hozzáadásakor: ${data.message}`);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            showErrorToast("Hiba történt a komment hozzáadása közben: Kérlek, próbáld újra később!");
        }
    });

    fetchTopics();
});
