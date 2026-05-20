import { useState, useEffect } from "react";
import "./App.css";

function getEmbedUrl(input) {
  const trimmedInput = input.trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmedInput)) {
    return `https://www.youtube-nocookie.com/embed/${trimmedInput}?rel=0&origin=${encodeURIComponent(window.location.origin)}`;
  }

  try {
    const url = new URL(trimmedInput);
    let videoId = null;

    const isYouTubeHost =
      url.hostname === "youtu.be" ||
      url.hostname.endsWith("youtube.com") ||
      url.hostname.endsWith("youtube-nocookie.com");

    if (!isYouTubeHost) {
      return null;
    }

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (
      url.pathname.startsWith("/shorts/") ||
      url.pathname.startsWith("/embed/") ||
      url.pathname.startsWith("/live/")
    ) {
      videoId = url.pathname.split("/")[2] || null;
    } else {
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

  useEffect(() => {
    // Parse URL parameters on load
    const params = new URLSearchParams(window.location.search);
    const youtubeUrl = params.get("youtube");
    if (youtubeUrl) {
      handleChange(youtubeUrl);
    }
  }, []);

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
      <div className="header-form-row">
        <h1>video</h1>
        <div className="url-form">
          <input
            type="text"
            className="url-input"
            placeholder="Enter YouTube URL"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button onClick={handlePaste}>Paste</button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {embedUrl && (
        <div className="embed-wrapper">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
