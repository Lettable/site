// Easter Eggs JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const eggCount = document.getElementById("eggCount")
  const totalEggs = document.getElementById("totalEggs")
  const easterEggSound = document.getElementById("easterEggSound")

  // Skip if not on a page with easter eggs
  if (!eggCount || !totalEggs) return

  // Set total eggs count
  const TOTAL_EGGS = 10
  totalEggs.textContent = TOTAL_EGGS

  // Load discovered eggs from localStorage
  const discoveredEggs = JSON.parse(localStorage.getItem("discovered_eggs") || "[]")
  eggCount.textContent = discoveredEggs.length

  // Function to record egg discovery
  function discoverEgg(eggName) {
    if (!discoveredEggs.includes(eggName)) {
      discoveredEggs.push(eggName)
      localStorage.setItem("discovered_eggs", JSON.stringify(discoveredEggs))

      eggCount.textContent = discoveredEggs.length

      if (easterEggSound) {
        easterEggSound.play().catch((e) => console.log("Audio play failed:", e))
      }

      // Check if all eggs are discovered
      if (discoveredEggs.length === TOTAL_EGGS) {
        setTimeout(() => {
          alert("Congratulations! You found all the Easter eggs!")

          // Add special effect to the page
          document.body.classList.add("all-eggs-found")
          setTimeout(() => {
            document.body.classList.remove("all-eggs-found")
          }, 5000)
        }, 500)
      }
    }
  }

  // Easter Egg: Click and drag
  let isDragging = false
  let dragPattern = ""

  document.addEventListener("mousedown", () => {
    isDragging = true
    dragPattern = ""
  })

  document.addEventListener("mouseup", () => {
    isDragging = false

    // Check if the drag pattern spells "egg"
    if (dragPattern === "egg") {
      fetch("/api/easter_egg/drag_egg", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Easter Egg Found: You spelled "egg" by dragging!')
            discoverEgg("drag_egg")
          }
        })
    }
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return

    // Simplified drag pattern detection
    // Divide the screen into a 3x3 grid and track movement between cells
    const gridX = Math.floor(e.clientX / (window.innerWidth / 3))
    const gridY = Math.floor(e.clientY / (window.innerHeight / 3))
    const gridPosition = `${gridX},${gridY}`

    // Add to pattern if position changed
    if (!dragPattern.endsWith(gridPosition)) {
      // Map grid positions to letters (very simplified)
      const letterMap = {
        "0,0": "a",
        "1,0": "b",
        "2,0": "c",
        "0,1": "d",
        "1,1": "e",
        "2,1": "f",
        "0,2": "g",
        "1,2": "h",
        "2,2": "i",
      }

      if (letterMap[gridPosition]) {
        dragPattern += letterMap[gridPosition]

        // Keep pattern at reasonable length
        if (dragPattern.length > 10) {
          dragPattern = dragPattern.substring(dragPattern.length - 10)
        }
      }
    }
  })

  // Easter Egg: Double-click background
  document.addEventListener("dblclick", (e) => {
    // Check if clicked on the background (not on any interactive element)
    if (e.target === document.body || e.target.classList.contains("rain-container")) {
      fetch("/api/easter_egg/double_click", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Easter Egg Found: You double-clicked the background!")
            discoverEgg("double_click")
          }
        })
    }
  })

  // Easter Egg: Press F12
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
      fetch("/api/easter_egg/developer_tools", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Don't alert for this one, as it might interfere with actual dev tools usage
            discoverEgg("developer_tools")

            // Add a console message instead
            console.log(
              "%c Easter Egg Found: Developer Tools! ",
              "background: #ffd700; color: #000; font-size: 20px; padding: 10px;",
            )
            console.log("%c You found a hidden message in the console. Nice job! ", "color: #ffd700; font-size: 16px;")
          }
        })
    }
  })

  // Easter Egg: Resize window to specific dimensions
  let resizeTimeout
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout)

    resizeTimeout = setTimeout(() => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Check if window is close to golden ratio (1.618)
      const ratio = width / height
      if (ratio > 1.61 && ratio < 1.63) {
        fetch("/api/easter_egg/golden_ratio", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert("Easter Egg Found: Your window is at the golden ratio!")
              discoverEgg("golden_ratio")
            }
          })
      }
    }, 500)
  })

  // Easter Egg: Visit all sections
  const sections = ["hero", "services", "skills", "portfolio", "shoutbox", "contact"]
  const visitedSections = new Set()

  // Intersection Observer to track visited sections
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id

          if (sections.includes(sectionId)) {
            visitedSections.add(sectionId)

            // Check if all sections have been visited
            if (visitedSections.size === sections.length) {
              fetch("/api/easter_egg/all_sections", {
                method: "POST",
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    alert("Easter Egg Found: You visited all sections of the site!")
                    discoverEgg("all_sections")
                  }
                })
            }
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  // Observe each section
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      observer.observe(section)
    }
  })
})
