// Animations JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated")
          entry.target.style.opacity = "1"
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  // Elements to animate on scroll
  const animateElements = [".service-card", ".skill-card", ".portfolio-item", ".contact-item", ".ad-card"]

  // Observe each element
  animateElements.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      // Add animation class based on element type
      if (selector === ".service-card") {
        element.style.animationDelay = `${index * 0.1}s`
        element.classList.add("fade-in-up")
      } else if (selector === ".skill-card") {
        element.style.animationDelay = `${index * 0.05}s`
        element.classList.add("fade-in")
      } else if (selector === ".portfolio-item") {
        element.style.animationDelay = `${index * 0.1}s`
        element.classList.add("fade-in-up")
      } else if (selector === ".contact-item") {
        element.style.animationDelay = `${index * 0.1}s`
        element.classList.add("fade-in-left")
      } else if (selector === ".ad-card") {
        element.style.animationDelay = `${index * 0.1}s`
        element.classList.add("fade-in-up")
      }

      // Initially hide element
      element.style.opacity = "0"

      // Observe element
      observer.observe(element)
    })
  })

  // Animate section headings
  document.querySelectorAll("section h2").forEach((heading) => {
    heading.classList.add("reveal-text")
    observer.observe(heading)
  })

  // Parallax effect for hero section
  const hero = document.querySelector(".hero")
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY
      hero.style.backgroundPositionY = scrollPosition * 0.5 + "px"
    })
  }

  // Animate skill progress bars when in view
  const skillBars = document.querySelectorAll(".skill-progress")
  skillBars.forEach((bar) => {
    // Initially set width to 0
    const originalWidth = bar.style.width
    bar.style.width = "0"

    // Create a separate observer for skill bars
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate to original width
            setTimeout(() => {
              bar.style.transition = "width 1s ease-in-out"
              bar.style.width = originalWidth
            }, 200)

            skillObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    skillObserver.observe(bar)
  })

  // Animate logo on hover
  const logo = document.querySelector(".logo")
  if (logo) {
    logo.addEventListener("mouseenter", function () {
      this.classList.add("pulse")
    })

    logo.addEventListener("mouseleave", function () {
      this.classList.remove("pulse")
    })
  }

  // Animate buttons on hover
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.classList.add("scale-in")
    })

    button.addEventListener("mouseleave", function () {
      this.classList.remove("scale-in")
    })
  })

  // Animate nav links on hover
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.classList.add("glow")
    })

    link.addEventListener("mouseleave", function () {
      this.classList.remove("glow")
    })
  })
})
