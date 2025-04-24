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

            topicsList.innerHTML = topics.map(topic => `
                <tr>
                    <td><a href="#" data-id="${topic.topic_id}" class="topic-link">${topic.topic_title}</a></td>
                    <td>${topic.username}</td>
                    <td>${topic.last_comment_date ? new Date(topic.last_comment_date).toLocaleString('hu-HU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : "Nincsenek még hozzászólások."}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching topics:', error.message);
            showErrorModal('A fórum használatához jelentkezz be!');
        }
    }

    function showSuccessToast(message) {
        showToast(message, '#28a745');
    }

    function showErrorToast(message) {
        showToast(message, '#dc3545');
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

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 1000);
        }, 2500);
    }

    function showErrorModal(message) {
        const modal = document.createElement("div");
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "2000";

        const modalContent = document.createElement("div");
        modalContent.style.backgroundColor = "#fff";
        modalContent.style.padding = "30px";
        modalContent.style.borderRadius = "12px";
        modalContent.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
        modalContent.style.textAlign = "center";
        modalContent.style.maxWidth = "400px";
        modalContent.style.fontSize = "18px";

        modalContent.innerHTML = `
            <p style="margin-bottom: 20px;">${message}</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="loginBtn" style="
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Bejelentkezés</button>
                <button id="closeModalBtn" style="
                    padding: 10px 20px;
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Bezárás</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        document.getElementById("closeModalBtn").addEventListener("click", () => {
            window.location.href = "home.html";
        });

        document.getElementById("loginBtn").addEventListener("click", () => {
            window.location.href = "login.html";
        });
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
