const copyWithLegacySelection = (text: string): boolean => {
  if (typeof document === 'undefined' || !document.body) {
    return false;
  }

  const textArea = document.createElement('textarea');
  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  textArea.value = text;
  textArea.setAttribute('readonly', '');
  Object.assign(textArea.style, {
    position: 'fixed',
    top: '0',
    left: '-9999px',
    width: '1px',
    height: '1px',
    padding: '0',
    border: '0',
    opacity: '0',
    fontSize: '16px',
    pointerEvents: 'none',
  });

  document.body.appendChild(textArea);

  try {
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    return document.execCommand('copy');
  } finally {
    textArea.remove();
    previouslyFocused?.focus();
  }
};

/**
 * Copies plain text from a direct user action.
 *
 * Safari requires clipboard access to happen within the original click/tap.
 * Call this function immediately from the event handler, before other awaits.
 */
export const copyTextToClipboard = async (text: string): Promise<void> => {
  let clipboardError: unknown;

  if (typeof navigator !== 'undefined' && globalThis.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  if (copyWithLegacySelection(text)) {
    return;
  }

  throw clipboardError instanceof Error ? clipboardError : new Error('Clipboard access is not available');
};
