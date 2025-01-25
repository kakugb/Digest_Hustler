import React, { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const AddBlogs = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    blocks: [{ type: "text", content: "" }],
  });

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeBlockIndex, setActiveBlockIndex] = useState(null);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  
  const selectionOptions = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      ),
      label: "Bold",
      action: () => handleFormat("bold"),
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      ),
      label: "Italic",
      action: () => handleFormat("italic"),
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      ),
      label: "Link",
      action: () => handleFormat("link"),
    },
  ];

  const handleFormat = (type) => {
    const textarea = document.activeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = "";
    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        }
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);
    const blockIndex = parseInt(textarea.dataset.index);

    const newBlocks = [...blogData.blocks];
    newBlocks[blockIndex] = { ...newBlocks[blockIndex], content: newContent };
    setBlogData((prev) => ({ ...prev, blocks: newBlocks }));

    setShowSelectionMenu(false);
  };

  const handleSelection = (e, index) => {
    const textarea = e.target;
    if (textarea.selectionStart !== textarea.selectionEnd) {
      const text = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Create a temporary div to measure the text position
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.visibility = "hidden";
      div.style.whiteSpace = "pre-wrap";
      div.style.font = window.getComputedStyle(textarea).font;
      div.textContent = text.substring(0, start);

      document.body.appendChild(div);
      const rect = textarea.getBoundingClientRect();
      const textHeight = div.offsetHeight;
      document.body.removeChild(div);

      // Calculate position
      const selectedText = text.substring(start, end);
      const lines = selectedText.split("\n");
      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);

      setSelectionPosition({
        x: rect.left + textarea.offsetWidth / 2,
        y: rect.top + textHeight - lines.length * lineHeight - 10,
      });
      setShowSelectionMenu(true);
    } else {
      setShowSelectionMenu(false);
    }
  };
  const menuOptions = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-600"
        >
          <path
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Picture",
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-600"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
      label: "Unsplash",
      action: () => handleUnsplashClick(),
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-600"
        >
          <path
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Link",
      action: () => handleLinkClick(),
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-600"
        >
          <path
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Code",
      action: () => insertBlock("code"),
    },
    {
      icon: "H1",
      label: "Heading",
      action: () => insertBlock("heading"),
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-600"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
        </svg>
      ),
      label: "Quote",
      action: () => insertBlock("quote"),
    },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);

      setBlogData((prev) => ({
        ...prev,
        blocks: [
          ...prev.blocks,
          { type: "image", content: imageUrl, alt: file.name },
          { type: "text", content: "" }, 
        ],
      }));

      setShowMenu(false);
    } catch (error) {
      console.error("Error handling image:", error);
    }
  };

  const handleUnsplashClick = () => {
    // Implement Unsplash modal here
    console.log("Opening Unsplash modal...");
    setShowMenu(false);
  };

  const handleLinkClick = () => {
    const url = prompt("Enter the URL:");
    if (!url) return;

    const text = prompt("Enter the link text:", url);
    if (!text) return;

    insertBlock("link", `[${text}](${url})`);
    setShowMenu(false);
  };

  const insertBlock = (type, content = "") => {
    let blockContent = content;

    switch (type) {
      case "code":
        blockContent = "\n```\nEnter code here\n```\n";
        break;
      case "heading":
        blockContent = "# ";
        break;
      case "quote":
        blockContent = "> ";
        break;
    }

    setBlogData((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { type: "text", content: blockContent },
        { type: "text", content: "" },
      ],
    }));

    setShowMenu(false);
  };

  const handleKeyUp = (e, index) => {
    const textarea = e.target;
    const rect = textarea.getBoundingClientRect();

    // Get cursor position
    const cursorIndex = textarea.selectionStart;
    const text = textarea.value;
    const lines = text.slice(0, cursorIndex).split("\n");
    const currentLineNumber = lines.length - 1;
    const lineHeight = 28; // Adjust this value based on your font size

    // Calculate cursor Y position
    const cursorY = rect.top + currentLineNumber * lineHeight;

    setCursorPosition({
      x: rect.left,
      y: cursorY,
    });
    setActiveBlockIndex(index);

    // Show menu on Enter if line is empty
    if (e.key === "Enter" && !blogData.blocks[index].content.trim()) {
      setMenuPosition({
        x: rect.left - 40,
        y: cursorY,
      });
      setShowMenu(true);
    }
  };

  const renderPlusButton = () => {
    if (activeBlockIndex === null) return null;
    const block = blogData.blocks[activeBlockIndex];
    if (!block || block.type !== "text") return null;

    return (
      <button
        className="fixed p-2 rounded-full hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
        style={{
          left: `${cursorPosition.x - 40}px`,
          top: `${cursorPosition.y}px`,
          transform: "translateY(-50%)",
        }}
        onClick={(e) => {
          e.preventDefault();
          setMenuPosition({
            x: cursorPosition.x - 40,
            y: cursorPosition.y,
          });
          setShowMenu(!showMenu);
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-gray-400 hover:text-gray-600"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    );
  };

  return (
    <div className="max-w-[800px] mx-auto px-12 pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-gray-500">Draft</div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-1.5 text-sm rounded-full bg-green-600 text-white hover:bg-green-700">
            Publish
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <span className="text-2xl">⋮</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={blogData.title}
        onChange={(e) =>
          setBlogData((prev) => ({ ...prev, title: e.target.value }))
        }
        className="w-full text-4xl font-bold mb-8 focus:outline-none placeholder-gray-300"
      />

      {/* Content Blocks */}
      <div className="relative group">
        {renderPlusButton()}

        <div className="w-full min-h-[calc(100vh-200px)]">
          {blogData.blocks.map((block, index) => (
            <div key={index}>
              {block.type === "image" ? (
                <div className="my-4 relative group">
                  <img
                    src={block.content}
                    alt={block.alt}
                    className="max-w-full h-auto rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newBlocks = blogData.blocks.filter(
                        (_, i) => i !== index
                      );
                      setBlogData((prev) => ({ ...prev, blocks: newBlocks }));
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <textarea
                  value={block.content}
                  onChange={(e) => {
                    const newBlocks = [...blogData.blocks];
                    newBlocks[index] = { ...block, content: e.target.value };
                    setBlogData((prev) => ({ ...prev, blocks: newBlocks }));
                  }}
                  onKeyUp={(e) => handleKeyUp(e, index)}
                  onMouseUp={(e) => handleSelection(e, index)} // Add this
                  onSelect={(e) => handleSelection(e, index)} // Add this
                  onBlur={() =>
                    setTimeout(() => setShowSelectionMenu(false), 200)
                  } // Hide menu when focus is lost
                  placeholder={index === 0 ? "Tell your story..." : ""}
                  className="w-full resize-none focus:outline-none text-xl font-serif"
                  rows={Math.max(block.content?.split("\n").length || 1, 1)}
                />
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {showSelectionMenu && (
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 flex gap-1 p-1 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${selectionPosition.x}px`,
              top: `${selectionPosition.y}px`,
              pointerEvents: "auto",
            }}
          >
            {selectionOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={option.label}
              >
                <span className="text-gray-600">{option.icon}</span>
              </button>
            ))}
          </div>
        )}
        {/* Menu */}
        {showMenu && (
          <div
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200"
            style={{
              left: `${menuPosition.x}px+20`,
              top: `${menuPosition.y}px`,
            }}
          >
            {menuOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-left"
              >
                <span className="text-gray-600">{option.icon}</span>
                <span className="text-sm text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlogs;
