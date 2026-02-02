import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { MOCK_CONVERSATIONS } from "../../__mocks__/messages.mock";
import { ConversationList } from "../ConversationList";

describe("ConversationList", () => {
  const defaultProps = {
    conversations: MOCK_CONVERSATIONS,
    activeConversationId: null,
    onSelectConversation: vi.fn(() => {}),
  };

  it("renderiza correctamente", () => {
    render(<ConversationList {...defaultProps} />);
    expect(screen.getByText("messages.title")).toBeInTheDocument();
  });

  it("muestra conversaciones", () => {
    render(<ConversationList {...defaultProps} />);
    const title =
      MOCK_CONVERSATIONS[0].title ?? MOCK_CONVERSATIONS[0].summary ?? "";
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("filtra conversaciones por busqueda", async () => {
    const user = userEvent.setup();
    render(<ConversationList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "messages.searchConversations"
    );
    const title =
      MOCK_CONVERSATIONS[0].title ?? MOCK_CONVERSATIONS[0].summary ?? "";
    await user.type(searchInput, title.slice(0, 5));

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("llama onSelectConversation al seleccionar", async () => {
    const user = userEvent.setup();
    const onSelectConversation = vi.fn(() => {});
    render(
      <ConversationList
        {...defaultProps}
        onSelectConversation={onSelectConversation}
      />
    );

    const title =
      MOCK_CONVERSATIONS[0].title ?? MOCK_CONVERSATIONS[0].summary ?? "";
    const conversation = screen.getByText(title);
    await user.click(conversation);

    expect(onSelectConversation).toHaveBeenCalledWith(MOCK_CONVERSATIONS[0]);
  });
});
