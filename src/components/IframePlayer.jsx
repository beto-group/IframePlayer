const { useState, useEffect, useRef, useCallback } = dc;

/**
 * Platform Specific Iframe Guidelines
 */
function getIframesGuidelines() {
  return {
    WEBSITES: {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 640,
      iframeScale: 1,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    FACEBOOK: {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 666,
      iframeScale: 1,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "FACEBOOK.reel": {
      containerWidth: 339,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1137,
      iframeScale: 0.526,
      iframeLeft: 1,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "FACEBOOK.plugins": {
      containerWidth: 629,
      containerHeight: 355,
      iframeWidth: 888,
      iframeHeight: 766,
      iframeScale: 0.705,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "FACEBOOK.watch": {
      containerWidth: 629,
      containerHeight: 355,
      iframeWidth: 888,
      iframeHeight: 766,
      iframeScale: 0.793,
      iframeLeft: 0,
      iframeTop: -90,
      disableIframeInteraction: false
    },
    WARPCAST: {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 666,
      iframeScale: 1,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    SNAPCHAT: {
      containerWidth: 396,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1111,
      iframeScale: 0.615,
      iframeLeft: 0,
      iframeTop: 44,
      disableIframeInteraction: false
    },
    YOUTUBE: {
      containerWidth: 640,
      containerHeight: 367,
      iframeWidth: 1270,
      iframeHeight: 730,
      iframeScale: 0.5,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    TIKTOK: {
      containerWidth: 340,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 666,
      iframeScale: 0.92,
      iframeLeft: -124,
      iframeTop: -8,
      disableIframeInteraction: false
    },
    REDDIT: {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 600,
      iframeScale: 1,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    LINKEDIN: {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 600,
      iframeScale: 1,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "YOUTUBE.shorts": {
      containerWidth: 333,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 666,
      iframeScale: 1.04,
      iframeLeft: -155,
      iframeTop: -42,
      disableIframeInteraction: false
    },
    INSTAGRAM: {
      containerWidth: 338,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1333,
      iframeScale: 0.528,
      iframeLeft: 0,
      iframeTop: -70,
      disableIframeInteraction: false
    },
    "INSTAGRAM.embed": {
      containerWidth: 340,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1333,
      iframeScale: 0.75,
      iframeLeft: -71,
      iframeTop: -41,
      disableIframeInteraction: false
    },
    "TIKTOK.embed": {
      containerWidth: 303,
      containerHeight: 600,
      iframeWidth: 333,
      iframeHeight: 666,
      iframeScale: 0.92,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "INSTAGRAM.p.embed": {
      containerWidth: 503,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1333,
      iframeScale: 0.782,
      iframeLeft: 0,
      iframeTop: -69,
      disableIframeInteraction: false
    },
    "INSTAGRAM.p": {
      containerWidth: 479,
      containerHeight: 600,
      iframeWidth: 640,
      iframeHeight: 1333,
      iframeScale: 0.745,
      iframeLeft: 0,
      iframeTop: -87,
      disableIframeInteraction: false
    },
    "X.platform.embed": {
      containerWidth: 514,
      containerHeight: 600,
      iframeWidth: 550,
      iframeHeight: 640,
      iframeScale: 0.935,
      iframeLeft: 0,
      iframeTop: 0,
      disableIframeInteraction: false
    },
    "X": {
      containerWidth: 640,
      containerHeight: 600,
      iframeWidth: 744,
      iframeHeight: 640,
      iframeScale: 1.054,
      iframeLeft: -105,
      iframeTop: 0,
      disableIframeInteraction: false
    }
  };
}

/**
 * URL transformer for embedding compatibility
 */
function transformUrl(url) {
  if (!url) return "";
  
  const lower = url.toLowerCase();
  
  // For YouTube URLs, convert to youtube-nocookie.com embed format
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    try {
      let videoId = null;
      
      if (lower.includes("youtube.com/watch")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } else if (lower.includes("youtu.be/")) {
        const parts = url.split("/");
        videoId = parts[parts.length - 1].split("?")[0];
      } else if (lower.includes("youtube.com/shorts/")) {
        const parts = url.split("/shorts/");
        if (parts[1]) {
          videoId = parts[1].split("?")[0];
        }
      } else if (lower.includes("youtube.com/embed/")) {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        videoId = pathParts[pathParts.length - 1];
      }
      
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    } catch (e) {
      console.error("[IframePlayer] URL transformation error:", e);
    }
  }
  
  return url;
}

/**
 * Resolve guidelines depending on source URL
 */
function getGuidelinesForUrl(url, guidelinesGetter) {
  const guidelines = guidelinesGetter();
  const lowerUrl = url.toLowerCase();
  let key = "WEBSITES";

  if (lowerUrl.includes("facebook.com/reel") || lowerUrl.includes("facebook.com/plugins/vid")) key = "FACEBOOK.reel";
  else if (lowerUrl.includes("facebook.com/watch?v=")) key = "FACEBOOK.video";
  else if (lowerUrl.includes("facebook.com")) key = "FACEBOOK";
  else if (lowerUrl.includes("warpcast")) key = "WARPCAST";
  else if (lowerUrl.includes("snapchat.com")) key = "SNAPCHAT";
  else if ((lowerUrl.includes("youtube.com") && lowerUrl.includes("/shorts")) || (lowerUrl.includes("youtu.be") && lowerUrl.includes("shorts"))) key = "YOUTUBE.shorts";
  else if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) key = "YOUTUBE";
  else if (lowerUrl.includes("tiktok.com/embed")) key = "TIKTOK.embed";
  else if (lowerUrl.includes("tiktok.com")) key = "TIKTOK";
  else if (lowerUrl.includes("reddit.com")) key = "REDDIT";
  else if (lowerUrl.includes("linkedin.com")) key = "LINKEDIN";
  else if (lowerUrl.includes("instagram.com/reel") && lowerUrl.endsWith("/embed")) key = "INSTAGRAM.embed";
  else if (lowerUrl.includes("instagram.com/p") && lowerUrl.endsWith("/embed")) key = "INSTAGRAM.p.embed";
  else if (lowerUrl.includes("instagram.com/p")) key = "INSTAGRAM.p";
  else if (lowerUrl.includes("instagram.com")) key = "INSTAGRAM";
  else if (lowerUrl.includes("platform.twitter.com/embed") || lowerUrl.includes("platform.x.com/embed")) key = "X.platform.embed";
  else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) key = "X";
  
  return guidelines[key];
}

/** Custom Hooks **/
function useResizeObserver(containerRef, updateDimensions) {
  const observerInstanceRef = useRef(null); 

  useEffect(() => {
    if (typeof updateDimensions !== 'function') return;

    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.contentRect.width > 0) {
            updateDimensions(entry.contentRect.width);
          }
        }
      });
      observer.observe(containerRef.current);
      observerInstanceRef.current = observer;
      return () => {
        observer.disconnect();
        observerInstanceRef.current = null;
      };
    }
  }, [containerRef, updateDimensions]);
}

function useWindowResize(updateDimensions) {
  useEffect(() => {
    if (typeof updateDimensions !== 'function') return;

    const handleResize = () => {
      const newWidth = document.documentElement.clientWidth || window.innerWidth;
      if (newWidth > 0) {
        updateDimensions(newWidth);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions]);
}

/** Sub‑Component: Iframe Container **/
function IframeContainer({
  width, height, iframeSrc, iframeWidth, iframeHeight,
  iframeScale, iframeLeft, iframeTop, iframeWrapperRef
}) {
  const [showFallback, setShowFallback] = useState(false);
  
  const isYouTube = iframeSrc && (
    iframeSrc.toLowerCase().includes("youtube.com") || 
    iframeSrc.toLowerCase().includes("youtu.be")
  );
  
  const openExternal = () => {
    if (iframeSrc) {
      if (typeof app !== 'undefined' && app.openExternal) {
        app.openExternal(iframeSrc);
      } else {
        window.open(iframeSrc, '_blank');
      }
    }
  };
  
  useEffect(() => {
    if (isYouTube) {
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isYouTube, iframeSrc]);
  
  return (
    <div
      style={{
        position: "relative",
        width: width + "px",
        height: height + "px",
        border: "1px solid var(--background-modifier-border, rgba(140, 140, 140, 0.2))",
        backgroundColor: "var(--background-primary, #090909)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        margin: "0 auto",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}
    >
      {showFallback && isYouTube && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 1000,
            backgroundColor: "rgba(15, 15, 15, 0.95)",
            border: "1px solid rgba(139, 92, 246, 0.4)",
            color: "#e2e8f0",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
          onClick={openExternal}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.25)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(15, 15, 15, 0.95)";
            e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
          }}
          title="Open in external browser to bypass Obsidian protocol blocks"
        >
          <span>🚀</span>
          <span>Open in Browser</span>
        </div>
      )}
      
      <div
        ref={iframeWrapperRef}
        style={{
          position: "absolute",
          left: iframeLeft + "px",
          top: iframeTop + "px",
          width: iframeWidth + "px",
          height: iframeHeight + "px",
          pointerEvents: "auto",
          transform: `scale(${iframeScale})`,
          transformOrigin: "top left",
        }}
      >
        {transformUrl(iframeSrc) ? (
          <iframe
            src={transformUrl(iframeSrc)}
            title="Embedded Media Player"
            width={iframeWidth} 
            height={iframeHeight}
            frameBorder="0"
            loading="lazy"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            style={{
              border: "none",
              display: "block",
              width: "100%", 
              height: "100%",
            }}
          ></iframe>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Main Player View Component
 */
function View({ initialUrl = "https://vimeo.com/333965228" }) {
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(600);
  const [iframeSrc, setIframeSrc] = useState("");
  const [iframeIntrinsicWidth, setIframeIntrinsicWidth] = useState(800);
  const [iframeIntrinsicHeight, setIframeIntrinsicHeight] = useState(600);
  const [iframeScale, setIframeScale] = useState(1);
  const [iframeLeft, setIframeLeft] = useState(0);
  const [iframeTop, setIframeTop] = useState(0);

  const viewContainerRef = useRef(null);
  const iframeWrapperRef = useRef(null);
  const originalGuidelineValuesRef = useRef(null);
  const guidelinesAppliedRef = useRef(false);
  const isMountedRef = useRef(false);

  const updateDimensions = useCallback((newObservedContainerWidth) => {
    if (!isMountedRef.current || newObservedContainerWidth <= 0) return;

    if (guidelinesAppliedRef.current && originalGuidelineValuesRef.current) {
      const {
        containerWidth: origCW, containerHeight: origCH,
        iframeWidth: origIW, iframeHeight: origIH,
        iframeScale: origIS, iframeLeft: origIL, iframeTop: origIT,
      } = originalGuidelineValuesRef.current;

      if (origCW <= 0) {
        guidelinesAppliedRef.current = false;
        originalGuidelineValuesRef.current = null;
        updateDimensions(newObservedContainerWidth);
        return;
      }

      const widthRatio = newObservedContainerWidth / origCW;
      setContainerWidth(newObservedContainerWidth);
      setContainerHeight(Math.round(origCH * widthRatio));
      setIframeIntrinsicWidth(origIW);
      setIframeIntrinsicHeight(origIH);
      setIframeScale(parseFloat((origIS * widthRatio).toFixed(3)));
      setIframeLeft(Math.round(origIL * widthRatio));
      setIframeTop(Math.round(origIT * widthRatio));
    } else {
      const defaultAspectRatio = 9 / 16;
      const newContainerH = Math.round(newObservedContainerWidth * defaultAspectRatio);
      setContainerWidth(newObservedContainerWidth);
      setContainerHeight(newContainerH);
      setIframeIntrinsicWidth(newObservedContainerWidth);
      setIframeIntrinsicHeight(newContainerH);
      setIframeScale(1);
      setIframeLeft(0);
      setIframeTop(0);
    }
  }, []);

  const applyGuidelines = useCallback((urlToLoad) => {
    const guidelines = getGuidelinesForUrl(urlToLoad, getIframesGuidelines);

    if (guidelines) {
      originalGuidelineValuesRef.current = { ...guidelines };
      guidelinesAppliedRef.current = true;
      setContainerWidth(guidelines.containerWidth);
      setContainerHeight(guidelines.containerHeight);
      setIframeIntrinsicWidth(guidelines.iframeWidth);
      setIframeIntrinsicHeight(guidelines.iframeHeight);
      setIframeScale(guidelines.iframeScale);
      setIframeLeft(guidelines.iframeLeft);
      setIframeTop(guidelines.iframeTop);

      const currentObservedWidth = viewContainerRef.current?.offsetWidth;
      if (isMountedRef.current && currentObservedWidth && currentObservedWidth > 0) {
          updateDimensions(currentObservedWidth);
      } else if (isMountedRef.current) {
          updateDimensions(document.documentElement.clientWidth || window.innerWidth || guidelines.containerWidth);
      }
    } else {
      guidelinesAppliedRef.current = false;
      originalGuidelineValuesRef.current = null;
      if (isMountedRef.current) {
        const currentObservedWidth = viewContainerRef.current?.offsetWidth;
        if (currentObservedWidth && currentObservedWidth > 0) {
          updateDimensions(currentObservedWidth);
        } else {
          updateDimensions(document.documentElement.clientWidth || window.innerWidth || 800);
        }
      }
    }
  }, [updateDimensions]);

  useEffect(() => {
    isMountedRef.current = true;

    if (initialUrl) {
      setIframeSrc(initialUrl);
      applyGuidelines(initialUrl);
    } else {
      setIframeSrc("");
      guidelinesAppliedRef.current = false;
      originalGuidelineValuesRef.current = null;
      const currentObservedWidth = viewContainerRef.current?.offsetWidth;
      if (currentObservedWidth && currentObservedWidth > 0) {
        updateDimensions(currentObservedWidth);
      } else {
        updateDimensions(document.documentElement.clientWidth || window.innerWidth || 800);
      }
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [initialUrl, applyGuidelines, updateDimensions]);

  useResizeObserver(viewContainerRef, updateDimensions);
  useWindowResize(updateDimensions);

  return (
    <div
      ref={viewContainerRef}
      style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}
    >
      <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "10px 0" }}>
        {iframeSrc && (
          <IframeContainer
            width={containerWidth} height={containerHeight}
            iframeSrc={iframeSrc}
            iframeWidth={iframeIntrinsicWidth} iframeHeight={iframeIntrinsicHeight}
            iframeScale={iframeScale} iframeLeft={iframeLeft} iframeTop={iframeTop}
            iframeWrapperRef={iframeWrapperRef}
          />
        )}
      </div>
    </div>
  );
}

return { 
  View, 
  transformUrl, 
  getGuidelinesForUrl, 
  useResizeObserver, 
  useWindowResize, 
  IframeContainer,
  getIframesGuidelines
};
