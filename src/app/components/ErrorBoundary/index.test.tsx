import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '.';

describe('ErrorBoundary', () => {
  const fallbackText = `I didn't work on this feature!`;

  it('Catches error and shows fallbackUI when error is thrown', () => {
    const ThrowError = () => {
      throw new Error(`Keh k lenge!`);
    };

    console.error = jest.fn(); // Suppress console.error logs from showing in test case

    render(
      <ErrorBoundary fallbackUI={<div>{fallbackText}</div>}>
        <ThrowError />
      </ErrorBoundary>
    );

    screen.getByText(fallbackText);
  });

  it('Renders the UI when error is not thrown', () => {
    const uiText = 'Kabhi kabhi lagta apun hi bhagwan hai!';

    const { getByText, unmount } = render(
      <ErrorBoundary fallbackUI={<div>{fallbackText}</div>}>
        <div>{uiText}</div>
      </ErrorBoundary>
    );

    getByText(uiText);
    unmount();
  });
});
