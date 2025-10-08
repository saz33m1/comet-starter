import { Card, CardBody } from '@metrostar/comet-uswds';
import React from 'react';
import './my-account.scss';

const profileSections = [
  {
    id: 'profile-name',
    heading: 'Name',
    description:
      'Review the legal and preferred names associated with your account. Ensure these details match your official documentation.',
  },
  {
    id: 'profile-email',
    heading: 'Email',
    description:
      'Confirm your primary email address and add alternate addresses to stay informed about application updates.',
  },
  {
    id: 'profile-phone',
    heading: 'Phone',
    description:
      'Keep your primary phone number current so our team can reach you about time-sensitive notices or approvals.',
  },
  {
    id: 'profile-address',
    heading: 'Residential Address',
    description:
      'Maintain an up-to-date residential address to ensure all mailed correspondence reaches you without delay.',
  },
];

export const MyAccount = (): React.ReactElement => {
  return (
    <div className="grid-container my-account-page">
      <div className="grid-row grid-gap-4 my-account-page__layout">
        <aside className="grid-col-12 tablet:grid-col-4 my-account-page__sidenav">
          <nav className="usa-sidenav" aria-label="Account navigation">
            <ul className="usa-sidenav__list">
              {profileSections.map((section, index) => (
                <li key={section.id} className="usa-sidenav__item">
                  <a
                    className={index === 0 ? 'usa-current' : ''}
                    href={`#${section.id}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <section className="grid-col-12 tablet:grid-col-8 my-account-page__content">
          <header className="my-account-page__header">
            <h1>My Account</h1>
            <p>Use this page to review and manage your account information.</p>
          </header>
          <div className="my-account-page__cards">
            {profileSections.map((section) => (
              <Card
                id={`my-account-card-${section.id}`}
                key={section.id}
                className="my-account-page__card"
              >
                <CardBody>
                  <h2 id={section.id}>{section.heading}</h2>
                  <p>{section.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
