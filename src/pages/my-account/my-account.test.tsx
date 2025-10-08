import { act, render, screen } from '@testing-library/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_PROFILE_DATA } from '@src/data/my-account';
import { Provider } from 'jotai';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { MyAccount } from './my-account';

const sectionHeadings = ['Name', 'Email', 'Phone', 'Residential Address'];
describe('MyAccount', () => {
  const componentWrapper = (
    <AuthProvider>
      <Provider>
        <BrowserRouter>
          <MyAccount />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );

  test('should render successfully', async () => {
    const { baseElement } = render(componentWrapper);
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
});
