import { act, render, screen } from '@testing-library/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_PROFILE_DATA } from '@src/data/my-account';
import { Provider } from 'jotai';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyAccount } from './my-account';

const sectionHeadings = ['Name', 'Email', 'Phone', 'Residential Address'];

describe('MyAccount', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const view = render(
      <AuthProvider>
        <Provider>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <MyAccount />
            </QueryClientProvider>
          </BrowserRouter>
        </Provider>
      </AuthProvider>,
    );

    return { view, queryClient };
  };

  test('should render successfully', async () => {
    const {
      view: { baseElement },
    } = renderComponent();
    await act(async () => {
      expect(baseElement).toBeTruthy();
      expect(
        screen.getByRole('heading', { level: 1, name: 'My Account' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('navigation', { name: 'Account navigation' }),
      ).toBeInTheDocument();
      sectionHeadings.forEach((heading) => {
        expect(screen.getByRole('link', { name: heading })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: heading })).toBeInTheDocument();
      });
    });

    expect(baseElement.querySelectorAll('.usa-card')).toHaveLength(
      sectionHeadings.length,
    );

    expect(screen.getByLabelText('First Name')).toHaveValue(
      ACCOUNT_PROFILE_DATA.name.firstName,
    );
    expect(screen.getByLabelText('Primary Email')).toHaveValue(
      ACCOUNT_PROFILE_DATA.email.primaryEmail,
    );
    expect(screen.getByLabelText('Primary Phone')).toHaveValue(
      ACCOUNT_PROFILE_DATA.phone.primaryPhone,
    );
    expect(screen.getByLabelText('Address Line 1')).toHaveValue(
      ACCOUNT_PROFILE_DATA.address.addressLine1,
    );
  });

  test('should persist updates after saving section', async () => {
    render(componentWrapper);

    const firstNameInput = screen.getByLabelText('First Name');
    const nameForm = firstNameInput.closest('form');
    expect(nameForm).not.toBeNull();

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Taylor');

    const saveButton = within(nameForm as HTMLElement).getByRole('button', {
      name: 'Save changes',
    });
    await userEvent.click(saveButton);

    await screen.findByText('Changes saved successfully.');

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('Taylor');
    });

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jordan');

    const resetButton = within(nameForm as HTMLElement).getByRole('button', {
      name: 'Reset',
    });
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('Taylor');
    });
  });
});
