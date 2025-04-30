// Cursor Farm JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const cursorContainer = document.getElementById("cursorContainer")
  const showOwnCursor = document.getElementById("showOwnCursor")
  const showOtherCursors = document.getElementById("showOtherCursors")

  // Skip if cursor container doesn't exist
  if (!cursorContainer) return

  // Initialize Socket.IO connection
  const socket = io()

  // Generate a random username for this session
  const sessionUsername = "Nigger" + Math.floor(Math.random() * 1000)

  // Cat GIFs for cursors
  const catGifs = [
    "/static/img/cats/cat1.gif",
    "/static/img/cats/cat2.gif",
    "/static/img/cats/cat3.gif",
    "/static/img/cats/cat4.gif",
    "/static/img/cats/cat5.gif",
  ]

  // Randomly select a cat GIF for this user
  const userCatGif = catGifs[Math.floor(Math.random() * catGifs.length)]

  // Create own cursor element
  const ownCursor = document.createElement("div")
  ownCursor.className = "cursor own-cursor"
  ownCursor.style.backgroundImage = `url('${userCatGif}')`
  ownCursor.setAttribute("data-name", sessionUsername)
  cursorContainer.appendChild(ownCursor)

  // Track other cursors
  const otherCursors = {}

  // Mouse move event listener
  document.addEventListener("mousemove", (e) => {
    // Update own cursor position
    if (showOwnCursor && showOwnCursor.checked) {
      ownCursor.style.display = "block"
      ownCursor.style.left = e.clientX + "px"
      ownCursor.style.top = e.clientY + "px"
    } else {
      ownCursor.style.display = "none"
    }

    // Throttle emitting position to reduce network traffic
    if (!window.cursorThrottle) {
      window.cursorThrottle = true

      // Emit cursor position to server
      socket.emit("cursor_move", {
        x: e.clientX,
        y: e.clientY,
        username: sessionUsername,
        catGif: userCatGif,
      })

      // Reset throttle after 50ms
      setTimeout(() => {
        window.cursorThrottle = false
      }, 50)
    }
  })

  // Receive cursor updates from server
  socket.on("cursor_update", (data) => {
    // Skip if other cursors should not be shown
    if (showOtherCursors && !showOtherCursors.checked) {
      // Hide all other cursors
      Object.values(otherCursors).forEach((cursor) => {
        cursor.style.display = "none"
      })
      return
    }

    // Create or update cursor for this user
    if (!otherCursors[data.sid]) {
      // Create new cursor element
      const cursor = document.createElement("div")
      cursor.className = "cursor"
      cursor.style.backgroundImage = `url('${data.catGif}')`
      cursor.setAttribute("data-name", data.username)
      cursorContainer.appendChild(cursor)

      // Store reference to this cursor
      otherCursors[data.sid] = cursor
    }

    // Update cursor position
    const cursor = otherCursors[data.sid]
    cursor.style.display = "block"
    cursor.style.left = data.x + "px"
    cursor.style.top = data.y + "px"
  })

  // Remove cursor when user disconnects
  socket.on("disconnect", (sid) => {
    if (otherCursors[sid]) {
      cursorContainer.removeChild(otherCursors[sid])
      delete otherCursors[sid]
    }
  })

  // Settings change event listeners
  if (showOwnCursor) {
    showOwnCursor.addEventListener("change", function () {
      if (this.checked) {
        ownCursor.style.display = "block"
      } else {
        ownCursor.style.display = "none"
      }
    })
  }

  if (showOtherCursors) {
    showOtherCursors.addEventListener("change", function () {
      if (this.checked) {
        // Show all other cursors
        Object.values(otherCursors).forEach((cursor) => {
          cursor.style.display = "block"
        })
      } else {
        // Hide all other cursors
        Object.values(otherCursors).forEach((cursor) => {
          cursor.style.display = "none"
        })
      }
    })
  }
})
