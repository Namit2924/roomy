import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

function Inbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const fetchConversations = async () => {
    try {
      const res = await API.get("/chat");
      setConversations(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await API.get(`/chat/${conversationId}/messages`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchConversations();
    socket.emit("joinUserRoom", user._id);

    socket.on("newNotification", (data) => {
      setNotification(data.text);
      fetchConversations();
    });

    socket.on("newMessage", (newMessage) => {
      if (
        selectedConversation &&
        newMessage.conversation === selectedConversation._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("newNotification");
      socket.off("newMessage");
    };
  }, [user, selectedConversation]);

  const openConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
    socket.emit("joinConversation", conversation._id);
    setNotification("");
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      await API.post(`/chat/${selectedConversation._id}/reply`, {
        text: replyText,
      });
      setReplyText("");
      fetchConversations();
    } catch (error) {
      console.error("Reply failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2 className="page-title">Please login to view inbox</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <h2 className="page-title">Loading inbox...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Inbox</h2>

      {notification && <p className="success-message">{notification}</p>}

      <div className="inbox-layout">
        <div className="inbox-sidebar">
          {conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`inbox-conversation ${
                  selectedConversation?._id === conversation._id
                    ? "active-conversation"
                    : ""
                }`}
                onClick={() => openConversation(conversation)}
              >
                <h4>{conversation.pg?.title}</h4>
                <p>
                  {user.role === "owner"
                    ? conversation.user?.name
                    : conversation.owner?.name}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="inbox-chat-area">
          {!selectedConversation ? (
            <div className="detail-box empty-state">
              <p>Select a conversation to view messages.</p>
            </div>
          ) : (
            <>
              <div className="chat-message-list">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`chat-bubble ${
                      msg.sender?._id === user._id ? "my-bubble" : "other-bubble"
                    }`}
                  >
                    <p><strong>{msg.sender?.name}:</strong></p>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="chat-reply-box">
                <textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button className="btn" onClick={handleReply}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;