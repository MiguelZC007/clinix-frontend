import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { MOCK_CONVERSATIONS } from "../../__mocks__/messages.mock";
import { ConversationItem } from "../ConversationItem";

describe("ConversationItem", () => {
  it("renderiza correctamente", () => {
    render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={false}
        onClick={vi.fn()}
      />
    );
    const title =
      MOCK_CONVERSATIONS[0].title ?? MOCK_CONVERSATIONS[0].summary ?? "";
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("muestra estado activo", () => {
    const { container } = render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={true}
        onClick={vi.fn()}
      />
    );
    expect(container.firstChild).toHaveClass("bg-muted");
  });

  it("llama onClick al hacer click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={false}
        onClick={onClick}
      />
    );

    const title =
      MOCK_CONVERSATIONS[0].title ?? MOCK_CONVERSATIONS[0].summary ?? "";
    const item = screen.getByText(title).closest("div");
    if (item) {
      await user.click(item);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });
});
