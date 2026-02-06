import { useState, type FormEvent, type KeyboardEvent } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
  isSubmitting?: boolean;
}

export function TodoInput({ onAdd, isSubmitting }: TodoInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmedText = text.trim();
    if (trimmedText && !isSubmitting) {
      onAdd(trimmedText);
      setText("");
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{
        display: "flex",
        gap: "8px",
        padding: "16px",
        borderBottom: "1px solid #eee",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        disabled={isSubmitting}
        aria-label="Add new todo"
        style={{
          flex: 1,
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          background: isSubmitting ? "#999" : "#4444ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
