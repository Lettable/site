// Shoutbox JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const shoutboxMessages = document.getElementById("shoutboxMessages")
  const usernameInput = document.getElementById("usernameInput")
  const messageInput = document.getElementById("messageInput")
  const sendMessageBtn = document.getElementById("sendMessageBtn")

  // Skip if shoutbox doesn't exist
  if (!shoutboxMessages) return

  // Initialize Socket.IO connection
  const socket = io()

  // Join chat room
  socket.emit("join_chat", {
    username: localStorage.getItem("shoutbox_username") || "Anonymous",
  })

  // Load saved username from localStorage
  if (usernameInput && localStorage.getItem("shoutbox_username")) {
    usernameInput.value = localStorage.getItem("shoutbox_username")
  }

  // Load messages from API
  fetch("/api/shoutbox")
    .then((response) => response.json())
    .then((messages) => {
      // Clear loading message
      shoutboxMessages.innerHTML = ""

      // Add messages to the DOM
      messages.forEach((message) => {
        addMessageToDOM(message)
      })

      // Scroll to bottom
      shoutboxMessages.scrollTop = shoutboxMessages.scrollHeight
    })
    .catch((error) => {
      console.error("Error fetching messages:", error)
      shoutboxMessages.innerHTML = '<div class="error-message">Error loading messages. Please try again later.</div>'
    })

  // Send message function
  function sendMessage() {
    const username = usernameInput.value.trim() || "Anonymous"
    const message = messageInput.value.trim()

    if (!message) return

    // Save username to localStorage
    localStorage.setItem("shoutbox_username", username)

    // Send message to server
    fetch("/api/shoutbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        message: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          // Clear message input
          messageInput.value = ""
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error)
        alert("Error sending message. Please try again later.")
      })
  }

  // Add message to DOM
  function addMessageToDOM(message) {
    const messageElement = document.createElement("div")
    messageElement.className = "message-item"
    messageElement.setAttribute("data-id", message.id)

    const messageHeader = document.createElement("div")
    messageHeader.className = "message-header"

    const usernameElement = document.createElement("span")
    usernameElement.className = "message-username"
    usernameElement.textContent = message.username

    const timeElement = document.createElement("span")
    timeElement.className = "message-time"
    timeElement.textContent = formatTimestamp(message.timestamp)

    const contentElement = document.createElement("div")
    contentElement.className = "message-content"
    contentElement.textContent = message.message

    messageHeader.appendChild(usernameElement)
    messageHeader.appendChild(timeElement)

    messageElement.appendChild(messageHeader)
    messageElement.appendChild(contentElement)

    shoutboxMessages.appendChild(messageElement)

    // Scroll to bottom
    shoutboxMessages.scrollTop = shoutboxMessages.scrollHeight
  }

  // Format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  // Listen for new messages from server
  socket.on("new_message", (message) => {
    addMessageToDOM(message)
  })

  // Listen for chat status messages
  socket.on("chat_status", (data) => {
    const statusElement = document.createElement("div")
    statusElement.className = "message-status"
    statusElement.textContent = data.message

    shoutboxMessages.appendChild(statusElement)

    // Scroll to bottom
    shoutboxMessages.scrollTop = shoutboxMessages.scrollHeight
  })

  // Send message on button click
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", sendMessage)
  }

  // Send message on Enter key
  if (messageInput) {
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })
  }

  // Leave chat room when page is unloaded
  window.addEventListener("beforeunload", () => {
    socket.emit("leave_chat", {
      username: usernameInput ? usernameInput.value.trim() || "Anonymous" : "Anonymous",
    })
  })
})
