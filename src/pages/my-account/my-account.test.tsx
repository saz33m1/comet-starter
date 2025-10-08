import { Provider } from 'jotai';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router-dom';
import { MyAccount } from './my-account';

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
      expect(baseElement.querySelector('h1')?.textContent).toEqual('My Account');
    });
  });
});
