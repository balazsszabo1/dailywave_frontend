document.addEventListener("DOMContentLoaded", () => {
    const topicList = document.getElementById("topics-list");
    const chatSection = document.getElementById("chat-section");
    const chatTitle = document.getElementById("chat-title");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const addTopicBtn = document.getElementById("add-topic-btn");
  
    let selectedTopicId = null;
    const token = localStorage.getItem("token"); // assumed JWT
  
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/topics/getAlltopics", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const topics = await res.json();
  
        topicList.innerHTML = "";
        topics.forEach(topic => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td><a href="#" class="topic-link" data-id="${topic.topic_id}" data-title="${topic.topic_title}">${topic.topic_title}</a></td>
            <td>${topic.username}</td>
            <td>${new Date(topic.date).toLocaleString()}</td>
          `;
          topicList.appendChild(row);
        });
  
        document.querySelectorAll(".topic-link").forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const id = e.target.dataset.id;
            const title = e.target.dataset.title;
            selectedTopicId = id;
            showChatSection(title, id);
          });
        });
      } catch (error) {
        console.error("Témák betöltési hiba:", error);
      }
    };
  
    const showChatSection = async (title, topicId) => {
      chatTitle.textContent = title;
      chatSection.style.display = "block";
      chatMessages.innerHTML = "";
  
      try {
        const res = await fetch(`/api/topics/getComments/${topicId}`);
        const comments = await res.json();
        comments.forEach(c => {
          const msg = document.createElement("div");
          msg.classList.add("comment-message");
          msg.innerHTML = `<strong>${c.username}</strong>: ${c.comment}`;
          chatMessages.appendChild(msg);
        });
      } catch (error) {
        console.error("Hozzászólás betöltési hiba:", error);
      }
    };
  
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      if (!selectedTopicId) return;
  
      const commentText = chatInput.value.trim();
      if (!commentText) return;
  
      try {
        const userRes = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = await userRes.json();
  
        const res = await fetch("/api/topics/addComment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            topic_id: selectedTopicId,
            comment: commentText,
            user_id: user.id
          })
        });
  
        if (res.ok) {
          chatInput.value = "";
          showChatSection(chatTitle.textContent, selectedTopicId);
        }
      } catch (error) {
        console.error("Hozzászólás küldési hiba:", error);
      }
    });
  
    addTopicBtn.addEventListener("click", async () => {
      const title = prompt("Add meg az új téma címét:");
      if (!title || title.trim() === "") return;
  
      try {
        const res = await fetch("/api/topics/uploadTopic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ topic_title: title })
        });
  
        if (res.ok) {
          await fetchTopics();
        } else {
          alert("Hiba történt a téma hozzáadásakor.");
        }
      } catch (error) {
        console.error("Téma hozzáadási hiba:", error);
      }
    });
  
    fetchTopics();
  });
  