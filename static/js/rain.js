// Rain Effect JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const rainContainer = document.getElementById("rainContainer")
  const rainSound = document.getElementById("rainSound")
  const playRainSound = document.getElementById("playRainSound")
  const showRainEffect = document.getElementById("showRainEffect")

  // Skip if rain container doesn't exist
  if (!rainContainer) return

  // Get settings from localStorage
  const settings = JSON.parse(localStorage.getItem("settings") || "{}")
  const shouldPlaySound = settings.playRainSound || false
  const shouldShowRain = settings.showRainEffect !== undefined ? settings.showRainEffect : true

  // Apply settings
  if (rainSound && shouldPlaySound) {
    rainSound.play().catch((e) => console.log("Audio play failed:", e))
  }

  if (!shouldShowRain) {
    rainContainer.style.display = "none"
    return
  }

  // Rain properties
  const raindropsCount = 100
  const minSpeed = 2
  const maxSpeed = 10
  const minSize = 10
  const maxSize = 30
  const raindrops = []

  // Create raindrops
  for (let i = 0; i < raindropsCount; i++) {
    createRaindrop()
  }

  // Animation loop
  function animate() {
    // Update raindrop positions
    for (let i = 0; i < raindrops.length; i++) {
      const raindrop = raindrops[i]

      // Move raindrop down
      raindrop.y += raindrop.speed

      // Reset if off screen
      if (raindrop.y > window.innerHeight) {
        resetRaindrop(raindrop)
      }

      // Update DOM element
      raindrop.element.style.top = raindrop.y + "px"
    }

    // Continue animation
    requestAnimationFrame(animate)
  }

  // Start animation
  animate()

  // Create a new raindrop
  function createRaindrop() {
    // Create DOM element
    const element = document.createElement("div")
    element.className = "raindrop"
    rainContainer.appendChild(element)

    // Create raindrop object
    const raindrop = {
      element: element,
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      size: minSize + Math.random() * (maxSize - minSize),
    }

    // Apply initial styles
    element.style.left = raindrop.x + "px"
    element.style.top = raindrop.y + "px"
    element.style.height = raindrop.size + "px"
    element.style.opacity = 0.1 + Math.random() * 0.3

    // Add to array
    raindrops.push(raindrop)
  }

  // Reset a raindrop to the top
  function resetRaindrop(raindrop) {
    raindrop.x = Math.random() * window.innerWidth
    raindrop.y = Math.random() * -500
    raindrop.speed = minSpeed + Math.random() * (maxSpeed - minSpeed)

    raindrop.element.style.left = raindrop.x + "px"
    raindrop.element.style.top = raindrop.y + "px"
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    // Check if any raindrops are now off-screen horizontally
    for (let i = 0; i < raindrops.length; i++) {
      const raindrop = raindrops[i]

      if (raindrop.x > window.innerWidth) {
        raindrop.x = Math.random() * window.innerWidth
        raindrop.element.style.left = raindrop.x + "px"
      }
    }
  })
})
