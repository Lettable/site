// Gallery JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const galleryItems = document.querySelectorAll(".gallery-item")
  const galleryModal = document.getElementById("galleryModal")
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")
  const closeModal = document.getElementById("closeModal")
  const prevImage = document.getElementById("prevImage")
  const nextImage = document.getElementById("nextImage")

  // Skip if gallery doesn't exist
  if (galleryItems.length === 0 || !galleryModal) return

  // Current image index
  let currentIndex = 0

  // Open modal when clicking on a gallery item
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      currentIndex = index
      openModal(this)
    })
  })

  // Close modal when clicking on close button
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      galleryModal.style.display = "none"
    })
  }

  // Close modal when clicking outside the content
  galleryModal.addEventListener("click", (e) => {
    if (e.target === galleryModal) {
      galleryModal.style.display = "none"
    }
  })

  // Navigate to previous image
  if (prevImage) {
    prevImage.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length
      openModal(galleryItems[currentIndex])
    })
  }

  // Navigate to next image
  if (nextImage) {
    nextImage.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % galleryItems.length
      openModal(galleryItems[currentIndex])
    })
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (galleryModal.style.display === "block") {
      if (e.key === "Escape") {
        galleryModal.style.display = "none"
      } else if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length
        openModal(galleryItems[currentIndex])
      } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % galleryItems.length
        openModal(galleryItems[currentIndex])
      }
    }
  })

  // Open modal with gallery item
  function openModal(item) {
    const img = item.querySelector("img")
    const title = item.querySelector("h3")
    const description = item.querySelector("p")

    modalImage.src = img.src
    modalTitle.textContent = title ? title.textContent : ""
    modalDescription.textContent = description ? description.textContent : ""

    galleryModal.style.display = "block"
  }
})
