import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { PROFILE_SECTIONS, ProfileSectionConfig } from '../../profile-sections';

const MY_ACCOUNT_PATH = '/my-account';
const BUSINESS_ENTITIES_PATH = '/my-account/business-entities';

export interface AccountSidenavProps {
  sections?: ProfileSectionConfig[];
}

const resolveSections = (sections?: ProfileSectionConfig[]): ProfileSectionConfig[] =>
  sections ?? PROFILE_SECTIONS;

export const AccountSidenav = ({ sections }: AccountSidenavProps): React.ReactElement => {
  const location = useLocation();
  const activeHash = location.hash.replace('#', '');
  const isOnMyAccountPage = location.pathname === MY_ACCOUNT_PATH;

  const resolvedSections = resolveSections(sections);

  return (
    <nav className="usa-sidenav" aria-label="Account navigation">
      <ul className="usa-sidenav__list">
        <li className="usa-sidenav__item">
          <NavLink
            to={MY_ACCOUNT_PATH}
            end
            className={({ isActive }) => (isActive ? 'usa-current' : undefined)}
          >
            My Account
          </NavLink>
          <ul className="usa-sidenav__sublist">
            {resolvedSections.map((section) => (
              <li key={section.id} className="usa-sidenav__item">
                {isOnMyAccountPage ? (
                  <a
                    href={`#${section.id}`}
                    className={activeHash === section.id ? 'usa-current' : undefined}
                  >
                    {section.heading}
                  </a>
                ) : (
                  <Link to={`${MY_ACCOUNT_PATH}#${section.id}`}>{section.heading}</Link>
                )}
              </li>
            ))}
          </ul>
        </li>
        <li className="usa-sidenav__item">
          <NavLink
            to={BUSINESS_ENTITIES_PATH}
            className={({ isActive }) => (isActive ? 'usa-current' : undefined)}
          >
            Business Entities
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
