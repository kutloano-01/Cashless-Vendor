// Voice Command Interface using Web Speech API

class VoiceCommands {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.isListening = false;
    this.isEnabled = false;
    this.currentContext = "dashboard";
    this.pushToTalkMode = false;
    this.statusTimeout = null;

    this.commands = {
      // Navigation commands
      navigation: {
        "go to dashboard": () => this.navigateTo("dashboard.html"),
        "open dashboard": () => this.navigateTo("dashboard.html"),
        "show analytics": () => this.navigateTo("analytics.html"),
        "open analytics": () => this.navigateTo("analytics.html"),
        "go to withdrawals": () => this.navigateTo("withdrawals.html"),
        "open withdrawals": () => this.navigateTo("withdrawals.html"),
        "show ussd": () => this.navigateTo("ussd.html"),
        "open demo": () => this.navigateTo("demo.html"),
        "go home": () => this.navigateTo("index.html"),
      },

      // QR Code commands
      qrcode: {
        "show qr code": () => this.executeCommand("showQRCode"),
        "generate qr code": () => this.executeCommand("showQRCode"),
        "display payment code": () => this.executeCommand("showQRCode"),
        "download qr code": () => this.executeCommand("downloadQR"),
        "print qr code": () => this.executeCommand("printQR"),
      },

      // Payment commands
      payment: {
        "start payment": () => this.executeCommand("startPayment"),
        "process payment": () => this.executeCommand("processPayment"),
        "cancel payment": () => this.executeCommand("cancelPayment"),
        "check balance": () => this.executeCommand("checkBalance"),
      },

      // Amount commands (dynamic)
      amounts: {
        pattern:
          /^(?:pay|charge|set amount|amount)\s+(?:r|rand|rands)?\s*(\d+(?:\.\d{2})?)/i,
        handler: (match) => this.setPaymentAmount(parseFloat(match[1])),
      },

      // System commands
      system: {
        help: () => this.showHelp(),
        "what can you do": () => this.showHelp(),
        "voice commands": () => this.showHelp(),
        "stop listening": () => this.stopListening(),
        "start listening": () => this.startListening(),
        "test voice": () => this.executeCommand("testVoiceCommand"),
        "test command": () => this.executeCommand("testVoiceCommand"),
        logout: () => this.executeCommand("logout"),
        "sign out": () => this.executeCommand("logout"),
      },
    };

    this.responses = {
      navigation: [
        "Navigating to {destination}",
        "Opening {destination}",
        "Taking you to {destination}",
      ],
      success: ["Done!", "Command executed successfully", "Task completed"],
      error: [
        "Sorry, I couldn't do that",
        "Command not recognized",
        "Please try again",
      ],
      listening: [
        "I'm listening...",
        "Go ahead, I'm listening",
        "What would you like me to do?",
      ],
    };

    this.init();
  }

  init() {
    // Check for Web Speech API support
    if (!this.checkSupport()) {
      console.warn("Voice commands not supported in this browser");
      return;
    }

    // Initialize speech recognition
    this.initializeSpeechRecognition();

    // Initialize speech synthesis
    this.initializeSpeechSynthesis();

    // Setup UI controls
    this.setupVoiceControls();

    // Add keyboard shortcut (Ctrl+Shift+V)
    this.setupKeyboardShortcuts();
  }

  checkSupport() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    return !!(SpeechRecognition && SpeechSynthesis);
  }

  initializeSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.maxAlternatives = 3;

    // Give more time for speech
    if (this.recognition.serviceURI) {
      this.recognition.serviceURI =
        "wss://www.google.com/speech-api/v2/recognize";
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      this.updateVoiceUI("listening");
      console.log("🎤 Voice recognition started");
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.handleSpeechError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceUI("idle");

      // Auto-restart if still enabled (with longer delay)
      if (this.isEnabled) {
        setTimeout(() => {
          if (this.isEnabled && !this.isListening) {
            console.log("🎤 Restarting voice recognition...");
            this.startListening();
          }
        }, 2000); // Longer delay to prevent rapid restarts
      }
    };
  }

  initializeSpeechSynthesis() {
    this.synthesis = window.speechSynthesis;

    // Get available voices
    this.voices = [];
    this.loadVoices();

    // Load voices when they become available
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();

    // Prefer English voices
    this.preferredVoice =
      this.voices.find(
        (voice) => voice.lang.startsWith("en") && voice.name.includes("Female")
      ) ||
      this.voices.find((voice) => voice.lang.startsWith("en")) ||
      this.voices[0];
  }

  setupVoiceControls() {
    // Add voice control button to pages
    this.addVoiceControlButton();

    // Add voice status indicator
    this.addVoiceStatusIndicator();
  }

  addVoiceControlButton() {
    // Check if button already exists
    if (document.getElementById("voice-control-btn")) return;

    const button = document.createElement("button");
    button.id = "voice-control-btn";
    button.className = "voice-control-btn";
    button.innerHTML = "🎤";
    button.title = "Toggle Voice Commands (Ctrl+Shift+V)";

    button.addEventListener("click", () => this.toggleVoiceCommands());

    // Add to page
    document.body.appendChild(button);

    // Add CSS styles
    this.addVoiceControlStyles();
  }

  addVoiceStatusIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "voice-status";
    indicator.className = "voice-status";
    indicator.style.display = "none";

    document.body.appendChild(indicator);
  }

  addVoiceControlStyles() {
    const styles = `
            .voice-control-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #c19a6b 0%, #d4a574 100%);
                color: #fefcf9;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(193, 154, 107, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .voice-control-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(193, 154, 107, 0.4);
            }
            
            .voice-control-btn.listening {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                animation: pulse 1.5s infinite;
                box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
            }

            .voice-control-btn.listening::after {
                content: '';
                position: absolute;
                top: -5px;
                left: -5px;
                right: -5px;
                bottom: -5px;
                border: 2px solid #4CAF50;
                border-radius: 50%;
                animation: ripple 2s infinite;
            }
            
            .voice-status {
                position: fixed;
                bottom: 90px;
                right: 20px;
                background: rgba(139, 111, 71, 0.9);
                color: #fefcf9;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.875rem;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            @keyframes ripple {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(1.5);
                    opacity: 0;
                }
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      // Ctrl+Shift+V to toggle voice commands
      if (event.ctrlKey && event.shiftKey && event.key === "V") {
        event.preventDefault();
        this.toggleVoiceCommands();
      }
    });
  }

  toggleVoiceCommands() {
    if (this.isEnabled) {
      this.disableVoiceCommands();
    } else {
      this.enableVoiceCommands();
    }
  }

  enableVoiceCommands() {
    if (!this.recognition) {
      this.speak("Voice commands are not supported in this browser");
      CashlessVendor.showToast(
        "Voice commands not supported in this browser",
        "error"
      );
      return;
    }

    this.isEnabled = true;
    this.startListening();
    this.speak("Voice commands enabled. I'm listening for your commands.");

    CashlessVendor.showToast(
      '🎤 Voice commands active! Say: "test voice", "help", "show QR code"',
      "success"
    );

    // Show persistent status
    this.updateVoiceStatus("Voice commands active - speak now!");
  }

  disableVoiceCommands() {
    this.isEnabled = false;
    this.stopListening();
    this.speak("Voice commands disabled");

    CashlessVendor.showToast("Voice commands disabled", "info");
  }

  startListening() {
    if (!this.recognition || this.isListening) return;

    try {
      this.recognition.start();
    } catch (error) {
      console.error("Failed to start voice recognition:", error);
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop();
  }

  handleSpeechResult(event) {
    let finalTranscript = "";
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Update status with interim results (show what's being heard)
    if (interimTranscript.trim()) {
      this.updateVoiceStatus(`Hearing: "${interimTranscript.trim()}"`);
    }

    // Process final transcript only if it's substantial
    if (finalTranscript.trim() && finalTranscript.trim().length > 2) {
      console.log("🎤 Final transcript received:", finalTranscript.trim());

      // Add a small delay to ensure complete speech capture
      setTimeout(() => {
        this.processVoiceCommand(finalTranscript.trim().toLowerCase());
      }, 300);
    }
  }

  processVoiceCommand(command) {
    console.log("🎤 Voice command:", command);
    this.updateVoiceStatus(`Processing: "${command}"`);

    // Check for exact matches first
    const exactMatch = this.findExactMatch(command);
    if (exactMatch) {
      this.executeVoiceCommand(exactMatch, command);
      return;
    }

    // Check for pattern matches (like amounts)
    const patternMatch = this.findPatternMatch(command);
    if (patternMatch) {
      this.executeVoiceCommand(patternMatch, command);
      return;
    }

    // Check for partial matches
    const partialMatch = this.findPartialMatch(command);
    if (partialMatch) {
      this.executeVoiceCommand(partialMatch, command);
      return;
    }

    // Check for common variations
    const variationMatch = this.findVariationMatch(command);
    if (variationMatch) {
      this.executeVoiceCommand(variationMatch, command);
      return;
    }

    // No match found
    this.handleUnknownCommand(command);
  }

  findExactMatch(command) {
    for (const category of Object.values(this.commands)) {
      if (typeof category === "object" && !category.pattern) {
        if (category[command]) {
          return category[command];
        }
      }
    }
    return null;
  }

  findPatternMatch(command) {
    for (const category of Object.values(this.commands)) {
      if (category.pattern) {
        const match = command.match(category.pattern);
        if (match) {
          return () => category.handler(match);
        }
      }
    }
    return null;
  }

  findPartialMatch(command) {
    for (const category of Object.values(this.commands)) {
      if (typeof category === "object" && !category.pattern) {
        for (const [key, handler] of Object.entries(category)) {
          if (command.includes(key) || key.includes(command)) {
            return handler;
          }
        }
      }
    }
    return null;
  }

  findVariationMatch(command) {
    // Common variations and synonyms
    const variations = {
      "show qr": () => this.executeCommand("showQRCode"),
      "display qr": () => this.executeCommand("showQRCode"),
      "qr code": () => this.executeCommand("showQRCode"),
      "show code": () => this.executeCommand("showQRCode"),
      "payment code": () => this.executeCommand("showQRCode"),
      dashboard: () => this.navigateTo("dashboard.html"),
      home: () => this.navigateTo("dashboard.html"),
      analytics: () => this.navigateTo("analytics.html"),
      stats: () => this.navigateTo("analytics.html"),
      reports: () => this.navigateTo("analytics.html"),
      withdrawals: () => this.navigateTo("withdrawals.html"),
      withdraw: () => this.navigateTo("withdrawals.html"),
      money: () => this.navigateTo("withdrawals.html"),
      ussd: () => this.navigateTo("ussd.html"),
      demo: () => this.navigateTo("demo.html"),
      "help me": () => this.showHelp(),
      commands: () => this.showHelp(),
      "what can i say": () => this.showHelp(),
    };

    // Check for variations
    for (const [variation, handler] of Object.entries(variations)) {
      if (command.includes(variation) || variation.includes(command)) {
        return handler;
      }
    }

    return null;
  }

  executeVoiceCommand(commandHandler, originalCommand) {
    try {
      commandHandler();
      this.speak(this.getRandomResponse("success"));
      this.updateVoiceStatus("Command executed");
    } catch (error) {
      console.error("Voice command execution error:", error);
      this.speak(this.getRandomResponse("error"));
      this.updateVoiceStatus("Command failed");
    }
  }

  handleUnknownCommand(command) {
    console.log("Unknown voice command:", command);
    this.speak(
      "Sorry, I didn't understand that command. Say 'help' for available commands."
    );
    this.updateVoiceStatus("Command not recognized");
  }

  navigateTo(page) {
    const pageName = page.replace(".html", "").replace("-", " ");
    this.speak(
      this.getRandomResponse("navigation").replace("{destination}", pageName)
    );

    setTimeout(() => {
      CashlessVendor.navigateTo(page);
    }, 1000);
  }

  executeCommand(commandName) {
    console.log("🎤 Executing command:", commandName);

    // Execute commands based on current page context
    try {
      if (typeof window[commandName] === "function") {
        window[commandName]();
        return true;
      }

      // Try alternative command names
      const alternatives = {
        showQRCode: ["showQRCode", "showQR", "generateQRCode"],
        downloadQR: ["downloadQR", "downloadQRCode"],
        printQR: ["printQR", "printQRCode"],
        logout: ["logout", "signOut"],
      };

      for (const [primary, alts] of Object.entries(alternatives)) {
        if (alts.includes(commandName)) {
          if (typeof window[primary] === "function") {
            window[primary]();
            return true;
          }
        }
      }

      // Try to find the function in different contexts
      const contexts = [window, document];
      for (const context of contexts) {
        if (
          context[commandName] &&
          typeof context[commandName] === "function"
        ) {
          context[commandName]();
          return true;
        }
      }

      console.warn("Command not available:", commandName);
      this.speak(
        `Sorry, the command ${commandName} is not available on this page`
      );
      return false;
    } catch (error) {
      console.error("Error executing command:", error);
      this.speak("Sorry, there was an error executing that command");
      return false;
    }
  }

  setPaymentAmount(amount) {
    this.speak(`Setting payment amount to ${amount} rand`);

    // Try to set amount in payment forms
    const amountInputs = document.querySelectorAll(
      'input[type="number"][name*="amount"], #amount, #demo-amount'
    );
    amountInputs.forEach((input) => {
      input.value = amount.toFixed(2);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  showHelp() {
    const helpText = `
            Available voice commands:
            Navigation: "go to dashboard", "show analytics", "open withdrawals"
            QR Code: "show qr code", "download qr code", "print qr code"
            Payments: "pay 25 rand", "set amount 50", "check balance"
            System: "help", "logout", "stop listening"
        `;

    this.speak("Here are the available voice commands");
    CashlessVendor.showToast(helpText, "info");
  }

  speak(text) {
    if (!this.synthesis || !text) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.preferredVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    this.synthesis.speak(utterance);
  }

  updateVoiceUI(state) {
    const button = document.getElementById("voice-control-btn");
    if (button) {
      button.classList.toggle("listening", state === "listening");
    }
  }

  updateVoiceStatus(message) {
    const status = document.getElementById("voice-status");
    if (status) {
      status.textContent = message;
      status.style.display = "block";

      // Clear any existing timeout
      if (this.statusTimeout) {
        clearTimeout(this.statusTimeout);
      }

      // Hide after longer delay, or keep visible if listening
      const hideDelay = this.isListening ? 10000 : 5000; // 10s if listening, 5s otherwise
      this.statusTimeout = setTimeout(() => {
        if (!this.isListening) {
          status.style.display = "none";
        }
      }, hideDelay);
    }
  }

  getRandomResponse(category) {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  handleSpeechError(error) {
    console.error("Speech recognition error:", error);

    const errorMessages = {
      "no-speech": "No speech detected. Please try again.",
      "audio-capture":
        "Microphone not available. Please check your microphone.",
      "not-allowed":
        "Microphone access denied. Please allow microphone access.",
      network: "Network error occurred. Please check your connection.",
      "service-not-allowed": "Speech service not allowed.",
      "bad-grammar": "Speech recognition grammar error.",
    };

    const message = errorMessages[error] || `Voice recognition error: ${error}`;
    this.updateVoiceStatus(message);

    // Show user-friendly toast message
    CashlessVendor.showToast(`🎤 ${message}`, "error");

    if (error === "not-allowed" || error === "service-not-allowed") {
      this.disableVoiceCommands();
      CashlessVendor.showToast(
        "Voice commands disabled due to permission error",
        "warning"
      );
    } else {
      // Try to restart recognition after a brief delay
      setTimeout(() => {
        if (this.isEnabled && !this.isListening) {
          console.log("🎤 Attempting to restart voice recognition...");
          this.startListening();
        }
      }, 2000);
    }
  }
}

// Initialize voice commands when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize on pages that support voice commands
  if (document.body) {
    window.voiceCommands = new VoiceCommands();
  }
});

// Export for global use
window.VoiceCommands = VoiceCommands;
