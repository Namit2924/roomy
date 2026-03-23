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
    src="client\public\Assistant.jpg"
    alt="Assistant"
    className="chatbot-avatar"
  />
  {/* <span className="chatbot-label">Roomy Assistant</span> */}
</button>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
  <div className="chatbot-header-left">
    <img
      src="https://dummyimage.com/50x50/2563eb/ffffff&text=AI"
      alt="Assistant"
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