// Main JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const menuToggle = document.getElementById("menuToggle")
  const nav = document.querySelector("nav")
  const settingsToggle = document.getElementById("settingsToggle")
  const settingsPanel = document.getElementById("settingsPanel")
  const currentYearElements = document.querySelectorAll("#currentYear")

  // Set current year in footer
  const currentYear = new Date().getFullYear()
  currentYearElements.forEach((element) => {
    element.textContent = currentYear
  })

  // Mobile menu toggle
  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    nav.classList.toggle("active")
  })

  // Settings panel toggle
  settingsToggle.addEventListener("click", (e) => {
    e.preventDefault()
    settingsPanel.classList.toggle("active")
  })

  // Close settings panel when clicking outside
  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
      settingsPanel.classList.remove("active")
    }
  })

  // Header scroll effect
  const header = document.querySelector("header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Typing effect for hero section
  const typingText = document.getElementById("typingText")
  if (typingText) {
    const phrases = ["Coding", "Automation", "DevOps", "Networking"]
    let currentPhraseIndex = 0
    let currentCharIndex = 0
    let isDeleting = false
    let typingSpeed = 100

    function typeEffect() {
      const currentPhrase = phrases[currentPhraseIndex]

      if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1)
        currentCharIndex--
        typingSpeed = 50
      } else {
        typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1)
        currentCharIndex++
        typingSpeed = 100
      }

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true
        typingSpeed = 1000 // Pause at the end
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length
        typingSpeed = 500 // Pause before typing next phrase
      }

      setTimeout(typeEffect, typingSpeed)
    }

    setTimeout(typeEffect, 1000)
  }

  // Mood emoji mapping
  const moodEmoji = document.getElementById("moodEmoji")
  const moodText = document.getElementById("moodText")
  if (moodEmoji && moodText) {
    const mood = moodEmoji.parentElement.getAttribute("data-mood")
    const emojiMap = {
      happy: "😊",
      neutral: "😐",
      focused: "🧐",
      tired: "😴",
      excited: "🤩",
      sad: "😫",
      angry: "😾"      
    }

    moodEmoji.textContent = emojiMap[mood] || "😊"
  }

  // Settings functionality
  const showOwnCursor = document.getElementById("showOwnCursor")
  const showOtherCursors = document.getElementById("showOtherCursors")
  const playRainSound = document.getElementById("playRainSound")
  const showRainEffect = document.getElementById("showRainEffect")
  const darkMode = document.getElementById("darkMode")
  const rainSound = document.getElementById("rainSound")
  const rainContainer = document.getElementById("rainContainer")

  // Load settings from localStorage
  if (localStorage.getItem("settings")) {
    const settings = JSON.parse(localStorage.getItem("settings"))

    if (showOwnCursor) showOwnCursor.checked = settings.showOwnCursor
    if (showOtherCursors) showOtherCursors.checked = settings.showOtherCursors
    if (playRainSound) playRainSound.checked = settings.playRainSound
    if (showRainEffect) showRainEffect.checked = settings.showRainEffect
    if (darkMode) darkMode.checked = settings.darkMode

    // Apply settings
    if (rainContainer) {
      rainContainer.style.display = settings.showRainEffect ? "block" : "none"
    }

    if (rainSound) {
      if (settings.playRainSound) {
        rainSound.play().catch((e) => console.log("Audio play failed:", e))
      } else {
        rainSound.pause()
      }
    }

    if (!settings.darkMode) {
      document.documentElement.style.setProperty("--bg-color", "#f5f5f5")
      document.documentElement.style.setProperty("--bg-light", "#e5e5e5")
      document.documentElement.style.setProperty("--bg-lighter", "#d5d5d5")
      document.documentElement.style.setProperty("--text-color", "#333333")
      document.documentElement.style.setProperty("--text-muted", "#666666")
      document.documentElement.style.setProperty("--border-color", "#cccccc")
    }
  }

  // Save settings to localStorage
  function saveSettings() {
    const settings = {
      showOwnCursor: showOwnCursor ? showOwnCursor.checked : true,
      showOtherCursors: showOtherCursors ? showOtherCursors.checked : true,
      playRainSound: playRainSound ? playRainSound.checked : false,
      showRainEffect: showRainEffect ? showRainEffect.checked : true,
      darkMode: darkMode ? darkMode.checked : true,
    }

    localStorage.setItem("settings", JSON.stringify(settings))

    // Apply settings
    if (rainContainer) {
      rainContainer.style.display = settings.showRainEffect ? "block" : "none"
    }

    if (rainSound) {
      if (settings.playRainSound) {
        rainSound.play().catch((e) => console.log("Audio play failed:", e))
      } else {
        rainSound.pause()
      }
    }

    if (settings.darkMode) {
      document.documentElement.style.setProperty("--bg-color", "#000000")
      document.documentElement.style.setProperty("--bg-light", "#111111")
      document.documentElement.style.setProperty("--bg-lighter", "#222222")
      document.documentElement.style.setProperty("--text-color", "#ffffff")
      document.documentElement.style.setProperty("--text-muted", "#aaaaaa")
      document.documentElement.style.setProperty("--border-color", "#333333")
    } else {
      document.documentElement.style.setProperty("--bg-color", "#f5f5f5")
      document.documentElement.style.setProperty("--bg-light", "#e5e5e5")
      document.documentElement.style.setProperty("--bg-lighter", "#d5d5d5")
      document.documentElement.style.setProperty("--text-color", "#333333")
      document.documentElement.style.setProperty("--text-muted", "#666666")
      document.documentElement.style.setProperty("--border-color", "#cccccc")
    }
  }

  // Add event listeners to settings toggles
  if (showOwnCursor) showOwnCursor.addEventListener("change", saveSettings)
  if (showOtherCursors) showOtherCursors.addEventListener("change", saveSettings)
  if (playRainSound) playRainSound.addEventListener("change", saveSettings)
  if (showRainEffect) showRainEffect.addEventListener("change", saveSettings)
  if (darkMode) darkMode.addEventListener("change", saveSettings)

  // Contact form submission
  const sendContactBtn = document.getElementById("sendContactBtn")
  if (sendContactBtn) {
    sendContactBtn.addEventListener("click", (e) => {
      e.preventDefault()

      const nameInput = document.getElementById("nameInput")
      const emailInput = document.getElementById("emailInput")
      const subjectInput = document.getElementById("subjectInput")
      const messageTextarea = document.getElementById("messageTextarea")

      if (!nameInput.value || !emailInput.value || !messageTextarea.value) {
        alert("Please fill in all required fields.")
        return
      }

      // Simulate form submission
      sendContactBtn.textContent = "Sending..."
      sendContactBtn.disabled = true

      setTimeout(() => {
        alert("Nigger contact me on Telegram.")
        nameInput.value = ""
        emailInput.value = ""
        subjectInput.value = ""
        messageTextarea.value = ""
        sendContactBtn.textContent = "Send Message"
        sendContactBtn.disabled = false
      }, 2000)
    })
  }

  // Initialize Socket.IO connection
  let socket
  if (typeof io !== "undefined") {
    socket = io()
  } else {
    console.error("Socket.IO library not found. Ensure it is included in your HTML.")
  }

  // Update visitor count when received from server
  if (socket) {
    socket.on("visitor_update", (data) => {
      const totalVisitors = document.getElementById("totalVisitors")
      const activeVisitors = document.getElementById("activeVisitors")

      if (totalVisitors) totalVisitors.textContent = data.total
      if (activeVisitors) activeVisitors.textContent = data.active
    })

    // Update status when received from server
    socket.on("status_update", (data) => {
      const statusIndicator = document.querySelector(".status-indicator")
      const statusText = document.querySelector(".status-text")
      const moodIndicator = document.querySelector(".mood-indicator")
      const moodEmoji = document.getElementById("moodEmoji")
      const moodText = document.getElementById("moodText")

      if (statusIndicator) {
        statusIndicator.setAttribute("data-status", data.status)
        if (statusText) statusText.textContent = data.status
      }

      if (moodIndicator) {
        moodIndicator.setAttribute("data-mood", data.mood)

        const emojiMap = 
          happy: "😊",
          neutral: "😐",
          focused: "🧐",
          tired: "😴",
          excited: "🤩",
          sad: "😫",
          angry: "😾" 
        }

        if (moodEmoji) moodEmoji.textContent = emojiMap[data.mood] || "😊"
        if (moodText) moodText.textContent = data.mood
      }
    })
  }

  // Logo click counter for easter egg
  const logo = document.getElementById("logo")
  if (logo) {
    let logoClickCount = 0

    logo.addEventListener("click", () => {
      logoClickCount++

      if (logoClickCount === 10) {
        fetch("/api/easter_egg/logo_click", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const easterEggSound = document.getElementById("easterEggSound")
              if (easterEggSound) easterEggSound.play().catch((e) => console.log("Audio play failed:", e))

              alert("Easter Egg Found: You clicked the logo 10 times!")

              const eggCount = document.getElementById("eggCount")
              if (eggCount) {
                eggCount.textContent = Number.parseInt(eggCount.textContent) + 1
              }
            }
          })

        logoClickCount = 0
      }
    })
  }

  // Secret button easter egg
  const secretBtn = document.getElementById("secretBtn")
  const secretEasterEgg = document.getElementById("secretEasterEgg")

  if (secretBtn) {
    secretBtn.addEventListener("click", (e) => {
      e.preventDefault()

      alert("Hint: Look for a hidden button somewhere on the page...")
    })
  }

  if (secretEasterEgg) {
    secretEasterEgg.addEventListener("click", () => {
      fetch("/api/easter_egg/secret_button", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const easterEggSound = document.getElementById("easterEggSound")
            if (easterEggSound) easterEggSound.play().catch((e) => console.log("Audio play failed:", e))

            alert("Easter Egg Found: You discovered the secret button!")

            const eggCount = document.getElementById("eggCount")
            if (eggCount) {
              eggCount.textContent = Number.parseInt(eggCount.textContent) + 1
            }
          }
        })
    })
  }

  // Konami code easter egg
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ]
  let konamiCodePosition = 0

  document.addEventListener("keydown", (e) => {
    // Get the key pressed
    const key = e.key

    // Get the expected key
    const expectedKey = konamiCode[konamiCodePosition]

    // Check if the key is correct
    if (key === expectedKey) {
      // Move to the next key in the sequence
      konamiCodePosition++

      // If the entire sequence is complete
      if (konamiCodePosition === konamiCode.length) {
        // Reset the position
        konamiCodePosition = 0

        // Trigger the easter egg
        fetch("/api/easter_egg/konami", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              const easterEggSound = document.getElementById("easterEggSound")
              if (easterEggSound) easterEggSound.play().catch((e) => console.log("Audio play failed:", e))

              alert("Easter Egg Found: Konami Code Activated! You now have 30 lives.")

              const eggCount = document.getElementById("eggCount")
              if (eggCount) {
                eggCount.textContent = Number.parseInt(eggCount.textContent) + 1
              }

              // Add some visual effect
              document.body.classList.add("konami-activated")
              setTimeout(() => {
                document.body.classList.remove("konami-activated")
              }, 3000)
            }
          })
      }
    } else {
      // Reset the position if the key is incorrect
      konamiCodePosition = 0
    }
  })

  // Check for Last.fm updates
  function updateLastFmData() {
    fetch("/api/lastfm")
      .then((response) => response.json())
      .then((data) => {
        const trackTitle = document.getElementById("trackTitle")
        const artistName = document.getElementById("artistName")
        const albumName = document.getElementById("albumName")
        const albumCover = document.getElementById("albumCover")
        const musicStatus = document.querySelector(".music-status span")

        if (trackTitle) trackTitle.textContent = data.title
        if (artistName) artistName.textContent = data.artist
        if (albumName) albumName.textContent = data.album
        if (albumCover) albumCover.style.backgroundImage = `url('${data.image}')`

        if (musicStatus) {
          if (data.now_playing) {
            musicStatus.className = "now-playing"
            musicStatus.textContent = "Now Playing"
          } else {
            musicStatus.className = "last-played"
            musicStatus.textContent = "Last Played"
          }
        }
      })
      .catch((error) => console.log("Error fetching Last.fm data:", error))
  }

  // Update Last.fm data every 30 seconds
  if (document.getElementById("musicContainer")) {
    setInterval(updateLastFmData, 30000)
  }

  // Cursor demo button
  const cursorDemoBtn = document.getElementById("cursorDemoBtn")
  if (cursorDemoBtn) {
    cursorDemoBtn.addEventListener("click", (e) => {
      e.preventDefault()

      alert("Move your mouse around to see the cursor farm in action! Other visitors will see your cursor too.")

      // Scroll to top to give more space for cursor movement
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }
})
