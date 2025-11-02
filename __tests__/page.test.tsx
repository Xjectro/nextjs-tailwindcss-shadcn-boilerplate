import { render, screen } from '@testing-library/react';

import Page from '@/app/page';
import { Providers } from '@/components/providers';

describe('Create Turtle Form', () => {
  it('render form', () => {
    render(
      <Providers>
        <Page />
      </Providers>,
    );

    const form = screen.getByTestId('create-turtle-form');

    expect(form).toBeInTheDocument();
  });
});
