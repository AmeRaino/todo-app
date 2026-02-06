export type FilterValue = "all" | "active" | "completed";

interface TodoFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  activeCount?: number;
  completedCount?: number;
}

export function TodoFilter({
  value,
  onChange,
  activeCount,
  completedCount,
}: TodoFilterProps) {
  const filters: { key: FilterValue; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div
      role="group"
      aria-label="Filter todos"
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px 16px",
        borderBottom: "1px solid #eee",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            background: value === key ? "#4444ff" : "transparent",
            color: value === key ? "white" : "#333",
            border: value === key ? "none" : "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
      {(activeCount !== undefined || completedCount !== undefined) && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: "14px",
            color: "#666",
          }}
        >
          {activeCount !== undefined && (
            <span style={{ marginRight: "12px" }}>{activeCount} active</span>
          )}
          {completedCount !== undefined && (
            <span>{completedCount} completed</span>
          )}
        </span>
      )}
    </div>
  );
}
