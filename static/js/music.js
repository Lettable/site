// Music Player JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const musicContainer = document.getElementById("musicContainer")
  const trackTitle = document.getElementById("trackTitle")
  const artistName = document.getElementById("artistName")
  const albumName = document.getElementById("albumName")
  const albumCover = document.getElementById("albumCover")

  // Skip if music player doesn't exist
  if (!musicContainer) return

  // Function to update music data
  function updateMusicData() {
    fetch("/api/lastfm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching Last.fm data:", data.error)
          return
        }

        // Update track info
        if (trackTitle) trackTitle.textContent = data.title
        if (artistName) artistName.textContent = data.artist
        if (albumName) albumName.textContent = data.album

        // Update album cover with fade effect
        if (albumCover) {
          // Create new image to preload
          const img = new Image()
          img.onload = () => {
            // Fade out
            albumCover.style.opacity = "0"

            // Change image after fade out
            setTimeout(() => {
              albumCover.style.backgroundImage = `url('${data.image}')`

              // Fade in
              albumCover.style.opacity = "1"
            }, 300)
          }
          img.src = data.image
        }

        // Update now playing status
        const musicStatus = document.querySelector(".music-status span")
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
      .catch((error) => {
        console.error("Error fetching Last.fm data:", error)
      })
  }

  // Update music data initially
  updateMusicData()

  // Update music data every 30 seconds
  setInterval(updateMusicData, 30000)

  // Add click animation to music container
  if (musicContainer) {
    musicContainer.addEventListener("click", function () {
      this.classList.add("pulse")

      setTimeout(() => {
        this.classList.remove("pulse")
      }, 1000)

      // Force update music data
      updateMusicData()
    })
  }
})
