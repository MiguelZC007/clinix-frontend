import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import { MOCK_CONVERSATIONS } from '../../__mocks__/messages.mock';
import { ConversationItem } from '../ConversationItem';

describe('ConversationItem', () => {
  it('renderiza correctamente', () => {
    render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText(MOCK_CONVERSATIONS[0].participantName)).toBeInTheDocument();
  });

  it('muestra estado activo', () => {
    const { container } = render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={true}
        onClick={vi.fn()}
      />
    );
    expect(container.firstChild).toHaveClass('bg-muted');
  });

  it('muestra contador de no leidos', () => {
    const conversation = { ...MOCK_CONVERSATIONS[0], unreadCount: 5 };
    render(
      <ConversationItem
        conversation={conversation}
        isActive={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('llama onClick al hacer click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ConversationItem
        conversation={MOCK_CONVERSATIONS[0]}
        isActive={false}
        onClick={onClick}
      />
    );

    const item = screen.getByText(MOCK_CONVERSATIONS[0].participantName).closest('div');
    if (item) {
      await user.click(item);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });
});
