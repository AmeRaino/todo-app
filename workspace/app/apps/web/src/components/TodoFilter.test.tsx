import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoFilter, type FilterValue } from "./TodoFilter";

describe("TodoFilter", () => {
  it("renders all filter buttons", () => {
    render(<TodoFilter value="all" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
  });

  it("highlights the current filter button", () => {
    render(<TodoFilter value="active" onChange={vi.fn()} />);

    const activeButton = screen.getByRole("button", { name: /active/i });
    expect(activeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("does not highlight non-selected filter buttons", () => {
    render(<TodoFilter value="active" onChange={vi.fn()} />);

    const allButton = screen.getByRole("button", { name: /all/i });
    const completedButton = screen.getByRole("button", { name: /completed/i });

    expect(allButton).toHaveAttribute("aria-pressed", "false");
    expect(completedButton).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with 'all' when All button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TodoFilter value="active" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /all/i }));
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("calls onChange with 'active' when Active button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TodoFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /active/i }));
    expect(onChange).toHaveBeenCalledWith("active");
  });

  it("calls onChange with 'completed' when Completed button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TodoFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /completed/i }));
    expect(onChange).toHaveBeenCalledWith("completed");
  });

  it("displays todo counts when provided", () => {
    render(
      <TodoFilter
        value="all"
        onChange={vi.fn()}
        activeCount={3}
        completedCount={5}
      />
    );

    expect(screen.getByText(/3 active/i)).toBeInTheDocument();
    expect(screen.getByText(/5 completed/i)).toBeInTheDocument();
  });

  it("has accessible group label", () => {
    render(<TodoFilter value="all" onChange={vi.fn()} />);

    expect(screen.getByRole("group", { name: /filter todos/i })).toBeInTheDocument();
  });
});
