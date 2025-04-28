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

    // Felugró ablak létrehozása
function createTopicModal() {
    if (document.getElementById('topicModal')) return;

    const modal = document.createElement('div');
    modal.id = 'topicModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        ">
            <h2 style="margin-bottom: 15px;">Új téma hozzáadása</h2>
            <input type="text" id="topicInput" placeholder="Téma címe" style="
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
            ">
            <div style="display: flex; justify-content: space-between;">
                <button id="cancelTopicBtn" style="
                    padding: 8px 12px;
                    background: #ccc;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Mégse</button>
                <button id="submitTopicBtn" style="
                    padding: 8px 12px;
                    background: #007BFF;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Hozzáadás</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('cancelTopicBtn').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('submitTopicBtn').addEventListener('click', async () => {
        const title = document.getElementById('topicInput').value.trim();
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
                    modal.remove();
                } else {
                    showErrorToast(`Hiba történt a téma hozzáadása közben: ${data.error || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                console.error("Error adding topic:", error);
                showErrorToast("Hiba történt a téma hozzáadása közben: Kérlek, próbáld újra később!");
            }
        } else {
            showErrorToast("A téma címe nem lehet üres!");
        }
    });
}

// Gomb esemény módosítása
addTopicBtn.addEventListener("click", () => {
    createTopicModal();
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





document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchQuery');
    const resultsContainer = document.getElementById('searchResults');
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
  
      if (query.length === 0) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }
  
      fetch(`https://nodejs315.dszcbaross.edu.hu/api/news/search?query=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results;
          resultsContainer.innerHTML = '';
          resultsContainer.style.display = 'block';
  
          results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.textContent = item.news_title;
            resultItem.style.padding = '10px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #eee';
  
            // Kattintáskor átirányít a newsdetails.html oldalra
            resultItem.addEventListener('click', () => {
              // Az átirányítás az ID alapján történik
              window.location.href = `https://dailywave.netlify.app/newsdetails.html?news_id=${item.news_id}`;
            });
  
            resultsContainer.appendChild(resultItem);
          });
        })
        .catch(err => {
          resultsContainer.innerHTML = '<div style="padding: 10px; color: red;">Nincs találat</div>';
          resultsContainer.style.display = 'block';
        });
    });
  
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        resultsContainer.style.display = 'none';
      }, 200);
    });
  
    searchInput.addEventListener('focus', () => {
      if (resultsContainer.innerHTML.trim() !== '') {
        resultsContainer.style.display = 'block';
      }
    });
  });
  