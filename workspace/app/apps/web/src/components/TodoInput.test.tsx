import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoInput } from "./TodoInput";

describe("TodoInput", () => {
  it("renders an input field", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("has placeholder text", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
  });

  it("calls onAdd with input value when button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "New todo item");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith("New todo item");
  });

  it("calls onAdd with input value when Enter is pressed", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "New todo item{enter}");

    expect(onAdd).toHaveBeenCalledWith("New todo item");
  });

  it("clears input after adding a todo", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "New todo item{enter}");

    expect(input).toHaveValue("");
  });

  it("does not call onAdd if input is empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd if input only has whitespace", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "   ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("trims whitespace from input value", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoInput onAdd={onAdd} />);

    await user.type(screen.getByRole("textbox"), "  New todo item  {enter}");

    expect(onAdd).toHaveBeenCalledWith("New todo item");
  });

  it("disables submit button when isSubmitting is true", () => {
    render(<TodoInput onAdd={vi.fn()} isSubmitting={true} />);

    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("disables input when isSubmitting is true", () => {
    render(<TodoInput onAdd={vi.fn()} isSubmitting={true} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows loading text on button when isSubmitting is true", () => {
    render(<TodoInput onAdd={vi.fn()} isSubmitting={true} />);

    expect(screen.getByRole("button")).toHaveTextContent(/adding/i);
  });

  it("has accessible labels", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAccessibleName(/add new todo/i);
  });
});
