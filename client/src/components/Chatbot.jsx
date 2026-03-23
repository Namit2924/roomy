import { useState } from "react";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am Roomy Assistant. Ask me about booking, listings, owner dashboard, login, or facilities.",
    },
  ]);

  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("book") || q.includes("booking")) {
      return "To book a PG, open Listings, click View Details, choose check-in date and duration, then click Confirm Booking.";
    }

    if (q.includes("login")) {
      return "Go to the Login page from the navbar and enter your email and password.";
    }

    if (q.includes("register") || q.includes("signup") || q.includes("sign up")) {
      return "Go to the Register page, fill your details, choose role, and create your account.";
    }

    if (q.includes("owner") || q.includes("add pg")) {
      return "Owners can login and open the Owner Dashboard to add a new PG listing.";
    }

    if (q.includes("listing") || q.includes("pgs") || q.includes("pg")) {
      return "Go to the Listings page to browse all available PGs. You can also search by city and filter by gender or price.";
    }

    if (q.includes("facility") || q.includes("facilities")) {
      return "Facilities are shown on each PG Details page. Examples include WiFi, food, laundry, and more.";
    }

    if (q.includes("price") || q.includes("rent")) {
      return "You can check the rent on the Listings page and also use the max price filter to find PGs in your budget.";
    }

    if (q.includes("booking history") || q.includes("my bookings")) {
      return "After login, open the Bookings page from the navbar to see your booking history.";
    }

    if (q.includes("hello") || q.includes("hi")) {
      return "Hello! How can I help you with Roomy today?";
    }

    return "Sorry, I did not understand that. Try asking about booking, listings, login, register, owner dashboard, facilities, or price.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    const botMessage = {
      sender: "bot",
      text: getBotReply(input),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleQuickMessage = (text) => {
  setInput(text);
};

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
  <img
    src="data:image/jpeg;base64,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"
    alt="R"
    className="chatbot-avatar"
  />
  {/* <span className="chatbot-label">Roomy Assistant</span> */}
</button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
  <div className="chatbot-header-left">
    <img
      src="client\public\Assistant.jpg"
      alt="R"
      className="chatbot-header-avatar"
    />
    <div>
      <h4>Roomy Assistant</h4>
      <p>Online now</p>
    </div>
  </div>

  <button className="chatbot-close" onClick={() => setIsOpen(false)}>
    ×
  </button>
</div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "chatbot-message user-message"
                    : "chatbot-message bot-message"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-quick-actions">
  <button onClick={() => handleQuickMessage("Show PGs in Pune")}>
    Pune PGs
  </button>
  <button onClick={() => handleQuickMessage("Budget PGs under 5000")}>
    Budget PGs
  </button>
  <button onClick={() => handleQuickMessage("How to contact owner?")}>
    Contact Owner
  </button>
</div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button className="btn" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;