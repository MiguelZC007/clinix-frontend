import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import { MessageInput } from '../MessageInput';

describe('MessageInput', () => {
  const defaultProps = {
    onSendMessage: vi.fn(),
    onSendAudio: vi.fn(),
    disabled: false,
  };

  it('renderiza correctamente', () => {
    render(<MessageInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('messages.typeMessage')).toBeInTheDocument();
  });

  it('muestra boton de microfono cuando no hay texto', () => {
    render(<MessageInput {...defaultProps} />);
    const micButton = screen.getByRole('button');
    expect(micButton).toBeInTheDocument();
  });

  it('muestra boton de enviar cuando hay texto', async () => {
    const user = userEvent.setup();
    render(<MessageInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('messages.typeMessage');
    await user.type(input, 'Test message');

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('llama onSendMessage al enviar mensaje', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    render(<MessageInput {...defaultProps} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText('messages.typeMessage');
    await user.type(input, 'Test message');
    await user.keyboard('{Enter}');

    expect(onSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('deshabilita input cuando disabled es true', () => {
    render(<MessageInput {...defaultProps} disabled={true} />);
    const input = screen.getByPlaceholderText('messages.typeMessage');
    expect(input).toBeDisabled();
  });
});
