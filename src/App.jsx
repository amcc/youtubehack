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

  function handleSubmit(e) {
    e.preventDefault();
    const url = getEmbedUrl(input.trim());
    if (url) {
      setEmbedUrl(url);
      setError("");
    } else {
      setError("Please enter a valid YouTube URL");
    }
  }

  return (
    <div className="container">
      <h1>YouTube Embed</h1>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="url-input"
        />
        <button type="submit">Embed</button>
      </form>
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
