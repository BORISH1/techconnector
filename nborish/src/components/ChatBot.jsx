import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, Trash2 } from "lucide-react";

// ── Keyword match helpers ──────────────────────────────────────────────────
function matchesAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function getProjectByName(projects, text) {
  const lower = text.toLowerCase();
  return projects.find((p) => {
    const words = p.name.toLowerCase().split(/[\s—–\-]+/);
    return words.some((w) => w.length > 3 && lower.includes(w));
  });
}

// ── Quick reply suggestions ────────────────────────────────────────────────
const QUICK_REPLIES = {
  initial: ["Tell me about projects", "What are his skills?", "Work experience", "Fun facts"],
  projects: ["SafeSight details", "IIT Ropar project", "Skin Disease project", "TechConnector"],
  skills: ["AI/ML skills", "Web development", "Programming languages"],
  general: ["Education details", "Contact info", "Tell me a joke", "His personality"],
};

// ── Response engine ────────────────────────────────────────────────────────
function generateResponse(text, profile, lastTopic) {
  const lower = text.toLowerCase();
  let response = "";
  let topic = lastTopic;
  let quickReplies = QUICK_REPLIES.general;

  // Check for specific project deep-dive
  const matchedProject = getProjectByName(profile.projects, lower);
  if (matchedProject && !matchesAny(lower, ["all", "list", "every"])) {
    response = `**${matchedProject.name}**\n\n${matchedProject.description}\n\n🔧 Tech: ${matchedProject.tags.join(", ")}${matchedProject.link ? `\n🔗 Live: ${matchedProject.link}` : ""}`;
    topic = "project-detail";
    quickReplies = QUICK_REPLIES.projects;
  }
  // Projects overview
  else if (matchesAny(lower, ["project", "portfolio", "work", "built", "made", "created"])) {
    response = `He's built ${profile.projects.length} notable projects:\n\n${profile.projects.map((p, i) => `${i + 1}. **${p.name}** — ${p.class} (${(p.confidence * 100).toFixed(0)}% confidence)`).join("\n")}\n\nAsk about any specific project for details!`;
    topic = "projects";
    quickReplies = QUICK_REPLIES.projects;
  }
  // Skills
  else if (matchesAny(lower, ["skill", "tech", "stack", "language", "framework", "tool"])) {
    const categories = Object.entries(profile.skills)
      .map(([cat, list]) => `**${cat}:** ${list.join(", ")}`)
      .join("\n\n");
    response = `Here's a breakdown of his technical skills:\n\n${categories}`;
    topic = "skills";
    quickReplies = QUICK_REPLIES.skills;
  }
  // AI/ML specific
  else if (matchesAny(lower, ["ai", "ml", "machine learning", "artificial", "deep learning", "cnn", "yolo", "computer vision"])) {
    const aiSkills = profile.skills["AI/ML & Research"] || [];
    response = `He specializes in AI/ML with skills in: ${aiSkills.join(", ")}.\n\nHe's currently researching: "${profile.research.title}"\n\n${profile.research.description}`;
    topic = "ai";
    quickReplies = ["Research details", "SafeSight project", "Skin Disease project", "Skills overview"];
  }
  // Web dev
  else if (matchesAny(lower, ["web", "frontend", "backend", "react", "node", "next", "express", "full-stack", "fullstack"])) {
    const webSkills = profile.skills["Web Development"] || [];
    response = `His web dev toolkit includes: ${webSkills.join(", ")}.\n\nHe's built production apps at IIT Ropar, Anshos Technology, and personal projects like TechConnector and this portfolio.`;
    topic = "web";
    quickReplies = QUICK_REPLIES.skills;
  }
  // Experience
  else if (matchesAny(lower, ["experience", "intern", "job", "company", "iit", "infosys", "anshos", "young mind"])) {
    response = profile.experience
      .map((e) => `**${e.role}** at ${e.company}\n📍 ${e.location} · ${e.period}\n→ ${e.bullets[0]}`)
      .join("\n\n");
    topic = "experience";
    quickReplies = ["IIT Ropar details", "Infosys internship", "Skills", "Projects"];
  }
  // Education
  else if (matchesAny(lower, ["education", "degree", "study", "college", "university", "coursework", "course"])) {
    response = `🎓 **${profile.education.degree}** in ${profile.education.specialization}\n\n🏫 ${profile.education.institution}, ${profile.education.location}\n📅 Expected: ${profile.education.expected}\n\n📚 Coursework: ${profile.education.coursework.join(", ")}`;
    topic = "education";
    quickReplies = QUICK_REPLIES.general;
  }
  // Research
  else if (matchesAny(lower, ["research", "paper", "thesis", "hybrid cnn", "skin lesion", "explainable"])) {
    response = `📊 **Current Research** (${profile.research.status})\n\n"${profile.research.title}"\n\n${profile.research.description}`;
    topic = "research";
    quickReplies = ["AI/ML skills", "Education", "Projects"];
  }
  // Contact
  else if (matchesAny(lower, ["contact", "email", "phone", "hire", "reach", "connect"])) {
    response = `📧 Email: ${profile.contact.email}\n📱 Phone: ${profile.contact.phone}\n🔗 LinkedIn: ${profile.contact.linkedin}\n🌐 Website: ${profile.contact.website}\n📍 Location: ${profile.location}`;
    topic = "contact";
    quickReplies = QUICK_REPLIES.general;
  }
  // Honors
  else if (matchesAny(lower, ["honor", "award", "prize", "achievement", "competition", "won"])) {
    response = profile.honors
      .map((h) => `🏆 **${h.title}**${h.org ? `\n   ${h.org}` : ""}${h.note ? `\n   ${h.note}` : ""}`)
      .join("\n\n");
    topic = "honors";
    quickReplies = QUICK_REPLIES.general;
  }
  // Relationship / funny
  else if (matchesAny(lower, ["single", "dating", "girlfriend", "relationship", "love"])) {
    const rel = profile.life?.relationship;
    response = `💻 ${rel?.funny_note || "He's currently focused on code!"}\n\n📋 Dating requirements:\n${(rel?.requirements || []).map((r) => `• ${r}`).join("\n")}\n\n${rel?.dating_status || ""}`;
    topic = "relationship";
    quickReplies = ["Fun facts", "Personality", "Developer jokes"];
  }
  // Personality
  else if (matchesAny(lower, ["personality", "weakness", "strength", "who is", "about him", "borish"])) {
    const p = profile.life?.personality;
    response = `${p?.description || ""}\n\n💪 Strengths: ${(p?.strengths || []).join(", ")}\n\n😅 Weaknesses: ${(p?.weaknesses || []).join(", ")}`;
    topic = "personality";
    quickReplies = ["Fun facts", "Developer jokes", "Projects"];
  }
  // Humor / jokes
  else if (matchesAny(lower, ["humor", "excuse", "joke", "funny", "laugh", "roast"])) {
    const humor = profile.life?.developer_humor;
    const quote = profile.funny_quotes?.[Math.floor(Math.random() * profile.funny_quotes.length)];
    response = `😄 "${quote}"\n\n🎯 Current battle: ${humor?.current_battle || ""}\n\n💡 Philosophy: "${humor?.developer_philosophy || ""}"`;
    topic = "humor";
    quickReplies = ["More jokes", "Fun facts", "Personality", "Projects"];
  }
  // Fun facts
  else if (matchesAny(lower, ["fact", "fun", "random", "trivia"])) {
    const facts = profile.life?.fun_facts || [];
    const randomFacts = [...facts].sort(() => Math.random() - 0.5).slice(0, 3);
    response = `🎲 Fun facts about Borish:\n\n${randomFacts.map((f) => `• ${f}`).join("\n")}`;
    topic = "fun";
    quickReplies = ["More fun facts", "Developer jokes", "His daily schedule"];
  }
  // Daily status
  else if (matchesAny(lower, ["daily", "day", "routine", "schedule", "status"])) {
    const daily = profile.life?.developer_humor?.daily_status || [];
    response = `📊 Borish's typical day:\n\n${daily.map((d) => `• ${d}`).join("\n")}`;
    topic = "daily";
    quickReplies = QUICK_REPLIES.general;
  }
  // Family
  else if (matchesAny(lower, ["family", "parents", "sister", "home"])) {
    const fam = profile.life?.family;
    response = `👨‍👩‍👧 ${fam?.description || ""}\n\n${fam?.members || ""}\n\n😄 ${fam?.family_role || ""}`;
    topic = "family";
    quickReplies = QUICK_REPLIES.general;
  }
  // Greetings
  else if (matchesAny(lower, ["hi", "hello", "hey", "sup", "yo", "good morning", "good evening"])) {
    response = "Hey there! 👋 I'm Borish's portfolio assistant. I know everything about his projects, skills, experience, and even his developer humor! What would you like to know?";
    topic = "greeting";
    quickReplies = QUICK_REPLIES.initial;
  }
  // Thank you
  else if (matchesAny(lower, ["thank", "thanks", "thx", "awesome", "great", "nice", "cool"])) {
    response = "You're welcome! 😊 Feel free to ask anything else about Borish's work, skills, or just chat about tech!";
    topic = "thanks";
    quickReplies = QUICK_REPLIES.initial;
  }
  // Who are you
  else if (matchesAny(lower, ["who are you", "what are you", "your name", "bot"])) {
    response = "I'm a portfolio assistant trained on Borish's resume data, projects, and even his personality! I can tell you about his technical work, achievements, or share some developer humor. 🤖";
    topic = "meta";
    quickReplies = QUICK_REPLIES.initial;
  }
  // Follow-up on last topic
  else if (matchesAny(lower, ["more", "tell me more", "detail", "elaborate", "explain"])) {
    if (lastTopic === "projects") {
      response = "Which project interests you? Try asking about SafeSight, Campus Navigation, Skin Disease Prediction, or TechConnector!";
      quickReplies = QUICK_REPLIES.projects;
    } else if (lastTopic === "skills") {
      response = "Want to know about AI/ML skills, Web Development stack, or Programming languages?";
      quickReplies = QUICK_REPLIES.skills;
    } else {
      response = "Sure! What specifically would you like to know more about?";
      quickReplies = QUICK_REPLIES.general;
    }
  }
  // Fallback
  else {
    response = `I'm not sure about that one! 🤔 I can tell you about:\n\n• **Projects** — AI, full-stack, and research work\n• **Skills** — technical competencies\n• **Experience** — internships and roles\n• **Education** — degree and coursework\n• **Fun stuff** — jokes, personality, daily routine\n\nTry asking about any of these!`;
    topic = "fallback";
    quickReplies = QUICK_REPLIES.initial;
  }

  return { response, topic, quickReplies };
}

// ── Time formatter ─────────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ChatBot({ profile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm Borish's AI assistant. Ask me about his projects, skills, experience, or even developer humor!",
      time: new Date(),
      quickReplies: QUICK_REPLIES.initial,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTopic, setLastTopic] = useState("");
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback((text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg = { role: "user", content, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate response delay
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const { response, topic, quickReplies } = generateResponse(content, profile, lastTopic);
      setLastTopic(topic);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, time: new Date(), quickReplies },
      ]);
      setLoading(false);
      if (!open) setUnread((u) => u + 1);
    }, delay);
  }, [input, loading, profile, lastTopic, open]);

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! 🧹 How can I help you?",
      time: new Date(),
      quickReplies: QUICK_REPLIES.initial,
    }]);
    setLastTopic("");
  };

  return (
    <>
      {/* FAB */}
      <button className="chat-fab" onClick={() => setOpen((v) => !v)} aria-label="Toggle assistant">
        <span className="chat-fab-icon">
          {open ? <X size={20} /> : <MessageSquare size={20} />}
        </span>
        <span className="chat-fab-label">{open ? "CLOSE" : "ASK_BOT"}</span>
        {unread > 0 && !open && (
          <span className="chat-fab-badge">{unread}</span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-head">
            <div className="chat-head-left">
              <span className="chat-head-avatar">🤖</span>
              <div>
                <span className="chat-title">Borish's Assistant</span>
                <span className="chat-online mono">● online</span>
              </div>
            </div>
            <button className="chat-clear" onClick={clearChat} aria-label="Clear chat" title="Clear chat">
              <Trash2 size={14} />
            </button>
          </div>

          <div className="chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-bubble">
                  <p>{m.content}</p>
                  <span className="chat-time mono">{formatTime(m.time)}</span>
                </div>
                {/* Quick replies */}
                {m.role === "assistant" && m.quickReplies && i === messages.length - 1 && !loading && (
                  <div className="chat-quick-replies">
                    {m.quickReplies.map((qr) => (
                      <button key={qr} className="chat-quick-btn" onClick={() => sendMessage(qr)}>
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-bubble">
                  <p className="chat-typing">
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about projects, skills, jokes…"
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
