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
            showLoginPrompt();
        }
    }
    
    function showLoginPrompt() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.zIndex = '1000';
    
        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '30px';
        box.style.borderRadius = '12px';
        box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        box.style.textAlign = 'center';
        box.style.maxWidth = '400px';
        box.style.width = '80%';
    
        const message = document.createElement('p');
        message.textContent = 'A fórum használatához jelentkezz be.';
        message.style.fontSize = '18px';
        message.style.marginBottom = '20px';
    
        const button = document.createElement('button');
        button.textContent = 'Bejelentkezés';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
    
        button.onclick = () => {
            window.location.href = 'login.html';
        };
    
        box.appendChild(message);
        box.appendChild(button);
        container.appendChild(box);
        document.body.appendChild(container);
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
                    alert("Téma sikeresen hozzáadva!");
                    fetchTopics();
                } else {
                    alert(`Failed to add topic: ${data.error || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Error adding topic:", error);
                alert("Hiba történt a téma hozzáadása közben: Kérlek, próbáld újra később!");
            }
        }
    });

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
                alert("Komment sikeresen hozzáadva!");

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
            alert("Hiba történt a komment hozzáadásakor: Kérlek, próbáld újra később!");
        }
    });

    fetchTopics();
});