const { useState, useEffect, useRef } = dc;

function WorldView({ folderPath, dc, IframePlayer }) {
  const { View, getIframesGuidelines, getGuidelinesForUrl } = IframePlayer;
  
  const presets = [
    {
      name: "YouTube Video",
      url: "https://www.youtube.com/watch?v=bsL7ZnKIAhs",
      icon: "🎥"
    },
    {
      name: "YouTube Shorts",
      url: "https://www.youtube.com/shorts/3fMee4Doz4k",
      icon: "📱"
    },
    {
      name: "Instagram Reel",
      url: "https://www.instagram.com/reel/C8C8X4aI9zX/embed",
      icon: "📸"
    },
    {
      name: "Instagram Post",
      url: "https://www.instagram.com/p/C-VfP94oAef/embed",
      icon: "🖼️"
    },
    {
      name: "TikTok Video",
      url: "https://www.tiktok.com/@beto.group/video/737890123456",
      icon: "🎵"
    },
    {
      name: "X (Twitter) Embed",
      url: "https://x.com/beto_group/status/178910111213",
      icon: "🐦"
    },
    {
      name: "Snapchat Story",
      url: "https://www.snapchat.com/add/beto.group",
      icon: "👻"
    },
    {
      name: "Warpcast Cast",
      url: "https://warpcast.com/beto/0x123456",
      icon: "🔮"
    },
    {
      name: "Standard Vimeo",
      url: "https://vimeo.com/333965228",
      icon: "🌐"
    }
  ];

  const [inputUrl, setInputUrl] = useState(presets[0].url);
  const [activeUrl, setActiveUrl] = useState(presets[0].url);
  const [viewportPreset, setViewportPreset] = useState("desktop"); // mobile, tablet, desktop
  const [customWidth, setCustomWidth] = useState(800);

  const activeGuidelines = getGuidelinesForUrl(activeUrl, getIframesGuidelines) || {
    containerWidth: 640,
    containerHeight: 600,
    iframeWidth: 640,
    iframeHeight: 640,
    iframeScale: 1,
    iframeLeft: 0,
    iframeTop: 0
  };

  const handlePresetSelect = (url) => {
    setInputUrl(url);
    setActiveUrl(url);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    setActiveUrl(inputUrl);
  };

  const getViewportWidth = () => {
    if (viewportPreset === "mobile") return 360;
    if (viewportPreset === "tablet") return 580;
    return customWidth;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        backgroundColor: "#0a0a0c",
        color: "#f4f4f5",
        fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
        overflowX: "hidden",
        padding: "24px"
      }}
    >
      {/* Dashboard Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: "18px",
          marginBottom: "24px"
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              margin: 0,
              background: "linear-gradient(to right, #a855f7, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            IFRAME PLAYER
          </h1>
          <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
            Advanced multi-platform sandbox for responsive embeds and layout testing
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <span
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              color: "#c084fc",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "600",
              border: "1px solid rgba(168, 85, 247, 0.3)"
            }}
          >
            v2.0.2
          </span>
          <span
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "600",
              border: "1px solid rgba(34, 197, 94, 0.3)"
            }}
          >
            Stable
          </span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: "24px",
          flex: "1"
        }}
      >
        {/* Left Side: Control Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >
          {/* Custom URL Form */}
          <div
            style={{
              backgroundColor: "#131316",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#e4e4e7" }}>
              🌐 Load Media URL
            </h3>
            <form onSubmit={handleApplyUrl} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter YouTube, Instagram, TikTok URL..."
                style={{
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "12px",
                  color: "#fff",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#a855f7"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#4f46e5"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#6366f1"}
              >
                Apply URL
              </button>
            </form>
          </div>

          {/* Preset Buttons */}
          <div
            style={{
              backgroundColor: "#131316",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#e4e4e7" }}>
              ⚡ Pre-configured Presets
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset.url)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    backgroundColor: activeUrl === preset.url ? "rgba(99, 102, 241, 0.15)" : "#18181b",
                    border: activeUrl === preset.url ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid rgba(255,255,255,0.04)",
                    borderRadius: "6px",
                    padding: "10px",
                    textAlign: "left",
                    color: activeUrl === preset.url ? "#818cf8" : "#d4d4d8",
                    fontSize: "12px",
                    fontWeight: activeUrl === preset.url ? "600" : "400",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (activeUrl !== preset.url) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeUrl !== preset.url) e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{preset.icon}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Guidelines Metadata */}
          <div
            style={{
              backgroundColor: "#131316",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)",
              fontSize: "12px"
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#e4e4e7" }}>
              📊 Target Layout Metrics
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a1a1aa" }}>Default Container Size:</span>
                <span style={{ fontFamily: "monospace", color: "#f4f4f5" }}>
                  {activeGuidelines.containerWidth}px × {activeGuidelines.containerHeight}px
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a1a1aa" }}>Unscaled Iframe Size:</span>
                <span style={{ fontFamily: "monospace", color: "#f4f4f5" }}>
                  {activeGuidelines.iframeWidth}px × {activeGuidelines.iframeHeight}px
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a1a1aa" }}>Intrinsic Scale Ratio:</span>
                <span style={{ fontFamily: "monospace", color: "#c084fc" }}>
                  {activeGuidelines.iframeScale}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#a1a1aa" }}>Coordinate Offset (L/T):</span>
                <span style={{ fontFamily: "monospace", color: "#f4f4f5" }}>
                  {activeGuidelines.iframeLeft}px, {activeGuidelines.iframeTop}px
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Responsive Viewport Testing */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#131316",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "20px",
            gap: "20px",
            overflow: "hidden"
          }}
        >
          {/* Viewport controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: "14px"
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#a1a1aa" }}>Viewport Simulator:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {["mobile", "tablet", "desktop"].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setViewportPreset(preset)}
                    style={{
                      backgroundColor: viewportPreset === preset ? "#818cf8" : "#1e1e24",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "background-color 0.2s"
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {viewportPreset === "desktop" && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "11px", color: "#71717a" }}>Container Width:</span>
                <input
                  type="range"
                  min="400"
                  max="1200"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                  style={{ width: "120px", accentColor: "#818cf8" }}
                />
                <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#d4d4d8" }}>
                  {customWidth}px
                </span>
              </div>
            )}
          </div>

          {/* Sandbox Wrapper */}
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0d0d10",
              borderRadius: "8px",
              padding: "20px",
              overflow: "auto",
              minHeight: "450px"
            }}
          >
            <div
              style={{
                width: getViewportWidth() + "px",
                transition: "width 0.3s ease-in-out",
                border: "1px dashed rgba(255,255,255,0.15)",
                padding: "8px",
                borderRadius: "10px",
                backgroundColor: "#08080a"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#52525b", marginBottom: "6px" }}>
                <span>[ Simulated Obsidian Note Container ]</span>
                <span>Width: {getViewportWidth()}px</span>
              </div>
              <View initialUrl={activeUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

return { WorldView };
