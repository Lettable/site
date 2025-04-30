// Terminal JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize variables
  const terminalBody = document.getElementById("terminalBody")
  const terminalInput = document.getElementById("terminalInput")

  // Skip if terminal doesn't exist
  if (!terminalBody || !terminalInput) return

  // Focus on input
  terminalInput.focus()

  // Command history
  const commandHistory = []
  let historyIndex = -1

  // Available commands
  const commands = {
    help: {
      description: "Show available commands",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"

        const commandList = document.createElement("div")
        commandList.className = "command-list"

        for (const cmd in commands) {
          const commandItem = document.createElement("div")
          commandItem.className = "command-item"

          const commandName = document.createElement("div")
          commandName.className = "command-name"
          commandName.textContent = cmd

          const commandDesc = document.createElement("div")
          commandDesc.className = "command-description"
          commandDesc.textContent = commands[cmd].description

          commandItem.appendChild(commandName)
          commandItem.appendChild(commandDesc)
          commandList.appendChild(commandItem)
        }

        output.appendChild(commandList)
        return output
      },
    },
    clear: {
      description: "Clear the terminal",
      execute: () => {
        terminalBody.innerHTML = ""
        return null
      },
    },
    whoami: {
      description: "Display user information",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"
        output.innerHTML = `
                    <p>User: Portfolio Visitor</p>
                    <p>Role: Explorer</p>
                    <p>Status: Discovering awesome content</p>
                    <p>Mission: Find all the Easter eggs!</p>
                `
        return output
      },
    },
    date: {
      description: "Display current date and time",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"
        output.textContent = new Date().toString()
        return output
      },
    },
    echo: {
      description: "Echo a message",
      execute: (args) => {
        const output = document.createElement("div")
        output.className = "command-output"
        output.textContent = args.join(" ")
        return output
      },
    },
    ls: {
      description: "List directory contents",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"
        output.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                        <div style="color: #4caf50;">projects/</div>
                        <div style="color: #4caf50;">skills/</div>
                        <div style="color: #4caf50;">services/</div>
                        <div style="color: #4caf50;">contact/</div>
                        <div style="color: #ffd700;">resume.pdf</div>
                        <div style="color: #ffd700;">portfolio.json</div>
                        <div style="color: #ffd700;">secrets.txt</div>
                        <div style="color: #ffd700;">README.md</div>
                    </div>
                `
        return output
      },
    },
    cat: {
      description: "Display file contents",
      execute: (args) => {
        const output = document.createElement("div")
        output.className = "command-output"

        if (!args.length) {
          output.className += " error-output"
          output.textContent = "Error: No file specified"
          return output
        }

        const filename = args[0]

        switch (filename) {
          case "README.md":
            output.innerHTML = `
                            <h3 style="color: #ffd700;">Portfolio README</h3>
                            <p>Welcome to my portfolio project!</p>
                            <p>This site showcases my skills in coding, automation, DevOps, and networking.</p>
                            <p>Feel free to explore and discover all the hidden features.</p>
                            <p>Contact me for any professional inquiries.</p>
                        `
            break
          case "portfolio.json":
            output.innerHTML = `
                            <pre style="color: #2196f3;">{
  "name": "Your Name",
  "title": "Full Stack Developer",
  "skills": [
    "JavaScript", "PHP", "Python", "C#", 
    "Go", "Rust", "React", "Express", 
    "MongoDB", "MySQL", "Docker", "NGINX"
  ],
  "experience": [
    {
      "company": "Tech Solutions Inc.",
      "role": "Senior Developer",
      "period": "2020-Present"
    },
    {
      "company": "Web Innovations",
      "role": "Full Stack Developer",
      "period": "2018-2020"
    }
  ],
  "contact": {
    "email": "your.email@example.com",
    "location": "Your City, Country"
  }
}</pre>
                        `
            break
          case "secrets.txt":
            output.innerHTML = `
                            <p style="color: #ff9800;">This file contains secrets...</p>
                            <p>Did you know there are multiple Easter eggs hidden throughout this site?</p>
                            <p>One of them is triggered by a famous cheat code from the 80s...</p>
                            <p>Another requires clicking something 10 times...</p>
                            <p>And there's a hidden button somewhere on the page...</p>
                            <p style="color: #ff9800;">Good luck finding them all!</p>
                        `

            // Record easter egg discovery
            fetch("/api/easter_egg/terminal", {
              method: "POST",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  const eggCount = document.getElementById("eggCount")
                  if (eggCount) {
                    eggCount.textContent = Number.parseInt(eggCount.textContent) + 1
                  }
                }
              })
            break
          case "resume.pdf":
            output.innerHTML = `
                            <p style="color: #f44336;">Error: Cannot display binary file</p>
                            <p>Try downloading it instead.</p>
                        `
            break
          default:
            output.className += " error-output"
            output.textContent = `Error: File '${filename}' not found`
        }

        return output
      },
    },
    cd: {
      description: "Change directory",
      execute: (args) => {
        const output = document.createElement("div")
        output.className = "command-output"

        if (!args.length) {
          output.textContent = "Current directory: /home/portfolio"
          return output
        }

        const dir = args[0]

        if (dir === "..") {
          output.textContent = "Changed to parent directory: /home"
        } else if (dir.endsWith("/")) {
          output.textContent = `Changed to directory: /home/portfolio/${dir}`
        } else {
          output.className += " error-output"
          output.textContent = `Error: '${dir}' is not a directory`
        }

        return output
      },
    },
    skills: {
      description: "List my skills",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"

        const skills = [
          { name: "JavaScript", level: 95 },
          { name: "PHP", level: 90 },
          { name: "Python", level: 92 },
          { name: "C#", level: 85 },
          { name: "Go", level: 80 },
          { name: "Rust", level: 75 },
          { name: "React", level: 90 },
          { name: "Express", level: 88 },
          { name: "MongoDB", level: 85 },
          { name: "MySQL", level: 92 },
          { name: "Docker", level: 88 },
          { name: "NGINX", level: 90 },
        ]

        let html = '<h3 style="color: #ffd700;">Skills</h3>'

        skills.forEach((skill) => {
          const barWidth = skill.level
          html += `
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>${skill.name}</span>
                                <span>${skill.level}%</span>
                            </div>
                            <div style="width: 100%; background-color: #333; height: 10px; border-radius: 5px;">
                                <div style="width: ${barWidth}%; background-color: #ffd700; height: 10px; border-radius: 5px;"></div>
                            </div>
                        </div>
                    `
        })

        output.innerHTML = html
        return output
      },
    },
    services: {
      description: "List my services",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"

        output.innerHTML = `
                    <h3 style="color: #ffd700;">Services</h3>
                    
                    <h4 style="color: #4caf50; margin-top: 15px;">Coding</h4>
                    <p>Expert development in multiple languages and frameworks with a focus on clean, efficient code.</p>
                    <ul style="padding-left: 20px; margin-top: 5px;">
                        <li>JavaScript & TypeScript</li>
                        <li>PHP & Python</li>
                        <li>C# & Go</li>
                        <li>Rust & More</li>
                    </ul>
                    
                    <h4 style="color: #4caf50; margin-top: 15px;">Automation</h4>
                    <p>Streamline your workflows with custom automation solutions for browsers and desktops.</p>
                    <ul style="padding-left: 20px; margin-top: 5px;">
                        <li>Browser Automation</li>
                        <li>Desktop Automation</li>
                        <li>Workflow Optimization</li>
                        <li>Task Scheduling</li>
                    </ul>
                    
                    <h4 style="color: #4caf50; margin-top: 15px;">DevOps</h4>
                    <p>Comprehensive DevOps solutions to optimize your development and deployment processes.</p>
                    <ul style="padding-left: 20px; margin-top: 5px;">
                        <li>NGINX Reverse Proxies</li>
                        <li>IPv4/IPv6 Hardening</li>
                        <li>CI/CD Pipelines</li>
                        <li>Docker & Kubernetes</li>
                    </ul>
                    
                    <h4 style="color: #4caf50; margin-top: 15px;">Linux Administration</h4>
                    <p>Expert management and optimization of Linux systems for maximum performance and security.</p>
                    <ul style="padding-left: 20px; margin-top: 5px;">
                        <li>Debian & Ubuntu</li>
                        <li>CentOS & RHEL</li>
                        <li>Arch Linux</li>
                        <li>Server Optimization</li>
                    </ul>
                `

        return output
      },
    },
    contact: {
      description: "Display contact information",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"

        output.innerHTML = `
                    <h3 style="color: #ffd700;">Contact Information</h3>
                    <p><strong>Email:</strong> your.email@example.com</p>
                    <p><strong>Location:</strong> Your City, Country</p>
                    <p><strong>GitHub:</strong> github.com/yourusername</p>
                    <p><strong>LinkedIn:</strong> linkedin.com/in/yourusername</p>
                    <p><strong>Twitter:</strong> twitter.com/yourusername</p>
                `

        return output
      },
    },
    ascii: {
      description: "Display ASCII art",
      execute: () => {
        const output = document.createElement("div")
        output.className = "command-output"

        const art = `
  _____           _    __       _ _       
 |  __ \\         | |  / _|     | (_)      
 | |__) |__  _ __| |_| |_ _   _| |_  ___  
 |  ___/ _ \\| '__| __|  _| | | | | |/ _ \\ 
 | |  | (_) | |  | |_| | | |_| | | | (_) |
 |_|   \\___/|_|   \\__|_|  \\__,_|_|_|\\___/ 
                                          
                                          `

        const asciiArt = document.createElement("pre")
        asciiArt.className = "ascii-art"
        asciiArt.textContent = art

        output.appendChild(asciiArt)
        return output
      },
    },
    exit: {
      description: "Exit terminal and return to portfolio",
      execute: () => {
        window.location.href = "/"
        return null
      },
    },
  }

  // Process command
  function processCommand(commandText) {
    const args = commandText.trim().split(" ")
    const cmd = args.shift().toLowerCase()

    if (cmd === "") return null

    // Add to command history
    commandHistory.push(commandText)
    historyIndex = commandHistory.length

    // Create command line element
    const commandLine = document.createElement("div")
    commandLine.className = "terminal-line"
    commandLine.innerHTML = `<span class="terminal-prompt">portfolio@terminal:~$</span> ${commandText}`
    terminalBody.appendChild(commandLine)

    // Execute command
    if (commands[cmd]) {
      const output = commands[cmd].execute(args)
      if (output) {
        terminalBody.appendChild(output)
      }
    } else {
      const output = document.createElement("div")
      output.className = "command-output error-output"
      output.textContent = `Command not found: ${cmd}. Type 'help' to see available commands.`
      terminalBody.appendChild(output)
    }

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight
  }

  // Handle input
  terminalInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const commandText = this.value
      this.value = ""

      processCommand(commandText)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()

      if (historyIndex > 0) {
        historyIndex--
        this.value = commandHistory[historyIndex]
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()

      if (historyIndex < commandHistory.length - 1) {
        historyIndex++
        this.value = commandHistory[historyIndex]
      } else if (historyIndex === commandHistory.length - 1) {
        historyIndex = commandHistory.length
        this.value = ""
      }
    }
  })

  // Handle terminal button clicks
  const closeButton = document.querySelector(".terminal-button.close")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      window.location.href = "/"
    })
  }

  const minimizeButton = document.querySelector(".terminal-button.minimize")
  if (minimizeButton) {
    minimizeButton.addEventListener("click", () => {
      const terminalContainer = document.querySelector(".terminal-container")
      terminalContainer.style.opacity = "0.5"

      setTimeout(() => {
        terminalContainer.style.opacity = "1"
      }, 2000)
    })
  }

  const maximizeButton = document.querySelector(".terminal-button.maximize")
  if (maximizeButton) {
    maximizeButton.addEventListener("click", () => {
      const terminalContainer = document.querySelector(".terminal-container")

      if (terminalContainer.style.width === "100%" && terminalContainer.style.height === "100vh") {
        terminalContainer.style.width = "900px"
        terminalContainer.style.height = "80vh"
        terminalContainer.style.margin = "auto"
      } else {
        terminalContainer.style.width = "100%"
        terminalContainer.style.height = "100vh"
        terminalContainer.style.margin = "0"
      }
    })
  }

  // Record terminal easter egg discovery
  fetch("/api/easter_egg/terminal", {
    method: "POST",
  })
})
