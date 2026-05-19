const { useState, useEffect, useRef, useMemo } = dc;

/**
 * editFileSegment
 *
 * Updates a segment of a file by replacing the original text with the new text.
 */
async function editFileSegment(filePath, originalSegment, newSegment) {
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!file) {
    throw new Error("File not found: " + filePath);
  }
  const fileContent = await app.vault.read(file);
  const index = fileContent.indexOf(originalSegment);
  if (index === -1) {
    throw new Error("Original segment not found in the file content.");
  }
  const updatedContent =
    fileContent.substring(0, index) +
    newSegment +
    fileContent.substring(index + originalSegment.length);
  await app.vault.modify(file, updatedContent);
  return updatedContent;
}

/**
 * EditableSectionUI Component
 *
 * Renders a single section with inline editing functionality.
 */
function EditableSectionUI({ sectionText, filePath, onSectionUpdate }) {
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef(null);

  const boxStyle = {
    width: "100%",
    height: "544px",
    fontFamily: "monospace",
    fontSize: "1.1em",
    lineHeight: "1.5",
    background: "none",
    padding: "0.5rem",
    boxSizing: "border-box",
    overflow: "auto",
    border: "none",
  };

  useEffect(() => {
    if (!editing) {
      const handleGlobalKeyDown = (e) => {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        if (e.key === "Enter" || e.key === "Return") {
          e.preventDefault();
          setEditing(true);
          setTimeout(() => {
            textareaRef.current && textareaRef.current.focus();
          }, 0);
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown);
      return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [editing]);

  const handleTextareaKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
      e.preventDefault();
      const originalSegment = sectionText;
      const newText = textareaRef.current.value;
      editFileSegment(filePath, originalSegment, newText)
        .then(() => {
          onSectionUpdate(newText);
          setEditing(false);
        })
        .catch((error) => console.error("Error updating file:", error));
    }
  };

  return (
    <div style={{ padding: "0.5rem", marginBottom: "10px", background: "none" }}>
      {editing ? (
        <>
          <textarea
            defaultValue={sectionText}
            ref={textareaRef}
            onKeyDown={handleTextareaKeyDown}
            style={{
              ...boxStyle,
              resize: "vertical",
            }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button
              style={{ marginRight: "0.5rem" }}
              onClick={async () => {
                const originalSegment = sectionText;
                const newText = textareaRef.current.value;
                try {
                  await editFileSegment(filePath, originalSegment, newText);
                  onSectionUpdate(newText);
                  setEditing(false);
                } catch (error) {
                  console.error("Error updating file:", error);
                }
              }}
            >
              Save
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <pre style={{ ...boxStyle, whiteSpace: "pre-wrap" }}>
            {sectionText}
          </pre>
          <button style={{ marginTop: "0.5rem" }} onClick={() => setEditing(true)}>
            Edit Section
          </button>
        </>
      )}
    </div>
  );
}

/**
 * FileSectionsProvider
 *
 * Loads a file specified by fileName, splits its content into sections, and if
 * the "editable" prop is true, renders an inline editing UI for the current section.
 */
function FileSectionsProvider({
  fileName,
  onSectionsLoaded,
  editable = false,
  currentSectionIndex = 0,
  onSectionUpdate,
}) {
  const queryString = useMemo(
    () => `@page and endswith($path, "${fileName}")`,
    [fileName]
  );
  const pages = dc.useQuery(queryString);

  const targetPage = useMemo(() => {
    if (!pages || pages.length === 0) return null;
    const exactMatch = pages.find((page) => {
      const segments = page.$path.split("/");
      const currentFileName = segments[segments.length - 1];
      return currentFileName === fileName;
    });
    return exactMatch || pages[0];
  }, [pages, fileName]);

  const [filePath, setFilePath] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (targetPage) {
      setFilePath(targetPage.$path);
      const file = app.vault.getAbstractFileByPath(targetPage.$path);
      if (file) {
        app.vault.read(file).then((content) => {
          let fullText = content || "";

          const headerMarker = "#### [[ENIGMAS]]";
          const markerIndex = fullText.indexOf(headerMarker);
          if (markerIndex !== -1) {
            fullText = fullText.substring(markerIndex + headerMarker.length);
          }

          const rawSections = fullText
            .split(/^\s*-{3,}\s*$/m)
            .filter((section) => section.replace(/\s+/g, "") !== "");

          function cleanLines(text) {
            const lines = text.split(/\r?\n/);
            while (lines.length && /^\s*$/.test(lines[0])) {
              lines.shift();
            }
            while (lines.length && /^\s*$/.test(lines[lines.length - 1])) {
              lines.pop();
            }
            return lines.map((line) => line.replace(/^\s+/, "")).join("\n");
          }

          const sectionsData = rawSections.map((originalSection) => {
            const finalText = cleanLines(originalSection);

            const iframeTagRegex = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/i;
            const srcRegex = /<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i;
            let iframeTag = "";
            let iframeSrc = "";

            const iframeTagMatch = originalSection.match(iframeTagRegex);
            if (iframeTagMatch) {
                iframeTag = iframeTagMatch[0];
                const srcMatch = iframeTag.match(srcRegex);
                if (srcMatch) {
                iframeSrc = srcMatch[1];
                }
            } else {
                const urlRegex = /(https:\/\/[^\s]+)/;
                const urlMatch = finalText.match(urlRegex);
                if (urlMatch) {
                iframeSrc = urlMatch[1];
                }
            }

            if (iframeSrc && iframeSrc.includes("youtube.com/embed/")) {
                const youtubeUrlRegex = /(https:\/\/(?:www\.)?youtube\.com\/(?!embed)[^"'\s]+)/;
                const youtubeMatch = finalText.match(youtubeUrlRegex);
                if (youtubeMatch) {
                iframeSrc = youtubeMatch[1];
                }
            }

            if (iframeSrc && iframeSrc.includes("instagram.com")) {
                iframeSrc = iframeSrc.replace(/\/embed\/?$/, '');
            }

            return {
                text: finalText,
                iframeTag,
                iframeSrc,
            };
          });

          setSections(sectionsData);
          if (onSectionsLoaded) onSectionsLoaded(sectionsData);
        });
      } else {
        console.error("File not found at path:", targetPage.$path);
      }
    } else {
      console.error("No target page found for file:", fileName);
    }
  }, [targetPage, fileName, onSectionsLoaded]);

  if (editable && sections.length > 0) {
    const currentSection = sections[currentSectionIndex];
    return (
      <EditableSectionUI
        sectionText={currentSection.text}
        filePath={filePath}
        onSectionUpdate={(newText) => {
          const newSections = [...sections];
          newSections[currentSectionIndex].text = newText;
          setSections(newSections);
          if (onSectionUpdate) onSectionUpdate(newText);
        }}
      />
    );
  }
  return null;
}

return { EditableSectionUI, FileSectionsProvider };
