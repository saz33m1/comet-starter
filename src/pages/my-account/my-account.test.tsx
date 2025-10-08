import { act, render, screen } from '@testing-library/react';
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
  });
});
