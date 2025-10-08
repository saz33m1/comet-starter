import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PROFILE_SECTIONS } from '../../profile-sections';
import { AccountSidenav } from './account-sidenav';

describe('AccountSidenav', () => {
  test('renders My Account sublinks with section anchors on My Account page', () => {
    render(
      <MemoryRouter initialEntries={['/my-account']}>
        <AccountSidenav sections={PROFILE_SECTIONS} />
      </MemoryRouter>,
    );

    const myAccountLink = screen.getByRole('link', { name: 'My Account' });
    expect(myAccountLink).toHaveClass('usa-current');

    PROFILE_SECTIONS.forEach((section) => {
      const sectionLink = screen.getByRole('link', { name: section.heading });
      expect(sectionLink).toHaveAttribute('href', `#${section.id}`);
    });
  });

  test('renders section links pointing to My Account path when on Business Entities page', () => {
    render(
      <MemoryRouter initialEntries={['/my-account/business-entities']}>
        <AccountSidenav sections={PROFILE_SECTIONS} />
      </MemoryRouter>,
    );

    const businessEntitiesLink = screen.getByRole('link', { name: 'Business Entities' });
    expect(businessEntitiesLink).toHaveClass('usa-current');

    PROFILE_SECTIONS.forEach((section) => {
      const sectionLink = screen.getByRole('link', { name: section.heading });
      expect(sectionLink).toHaveAttribute('href', `/my-account#${section.id}`);
    });
  });
});
