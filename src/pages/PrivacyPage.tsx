import React from 'react';
import { Lock } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dadcoin-yellow py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Lock className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: May 24, 2025</p>
        </div>

        <div className="card">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Wallet address (used for authentication)</li>
              <li>Account activity and transaction history</li>
              <li>Dadcoin balance and earnings</li>
              <li>Usage data and interaction with the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Your information is used to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and maintain our service</li>
              <li>Process your transactions</li>
              <li>Prevent fraud and abuse</li>
              <li>Improve our platform and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Data Protection</h2>
            <p className="mb-4">We implement robust security measures to protect your data:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>End-to-end encryption for sensitive data</li>
              <li>Regular security audits and updates</li>
              <li>Strict access controls and authentication</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. Your data is only used within our platform to provide you with the best possible service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Object to data processing</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use essential cookies to maintain your session and secure your account. No third-party tracking or advertising cookies are used.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Changes to Privacy Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;