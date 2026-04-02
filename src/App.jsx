import { useState } from "react";
import "./App.css";

function getEmbedUrl(input) {
  try {
    const url = new URL(input);
    let videoId = null;
    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
    }
    if (videoId)
      return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&origin=${encodeURIComponent(window.location.origin)}`;
  } catch {
    // not a valid URL
  }
  return null;
}

function App() {
  const [input, setInput] = useState("");
  const [embedUrl, setEmbedUrl] = useState(null);
  const [error, setError] = useState("");

  function handleChange(value) {
    setInput(value);
    const url = getEmbedUrl(value.trim());
    if (url) {
      setEmbedUrl(url);
      setError("");
    } else {
      setEmbedUrl(null);
      setError(value.trim() ? "Please enter a valid YouTube URL" : "");
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      handleChange(text);
    } catch {
      setError("Clipboard access denied");
    }
  }

  return (
    <div className="container">
      <h1>YouTube Embed</h1>
      <div className="url-form">
        <input
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="url-input"
        />
        <button type="button" onClick={handlePaste}>
          Paste
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {embedUrl && (
        <div className="embed-wrapper">
          <iframe
            src={embedUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default App;
