import React from 'react';
import { Shield } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dadcoin-yellow py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: May 24, 2025</p>
        </div>

        <div className="card">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Welcome to Dadcoin</h2>
            <p className="mb-4">
              Dadcoin is a fun and secure platform that rewards users for their dad jokes and community participation. Our service is built on cutting-edge technology and maintained by a dedicated team of professionals to ensure the best possible experience for our users.
            </p>
            <p className="mb-4">
              By using Dadcoin, you're joining a vibrant community of users who enjoy sharing laughs while earning rewards. Our platform is designed to be transparent, fair, and enjoyable for everyone.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Platform Security & Reliability</h2>
            <p className="mb-4">
              Dadcoin employs industry-standard security measures to protect your assets and data. Our platform features:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Advanced encryption for all transactions</li>
              <li>Regular security audits by independent firms</li>
              <li>24/7 system monitoring</li>
              <li>Automated backup systems</li>
              <li>Transparent reward distribution</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Eligibility</h2>
            <p className="mb-4">To use Dadcoin, you confirm that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>You are at least 18 years old</li>
              <li>You are the legitimate owner of your wallet address</li>
              <li>You have the legal capacity to accept these terms</li>
              <li>You will use the platform responsibly and legally</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Fair Usage & Rewards</h2>
            <p className="mb-4">
              Our reward system is designed to be fair and transparent. All users have equal opportunities to earn Dadcoins through:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Generating and sharing quality dad jokes</li>
              <li>Active participation in the community</li>
              <li>Regular platform engagement</li>
              <li>Special events and promotions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. User Protection</h2>
            <p className="mb-4">
              We are committed to protecting our users. Your experience with Dadcoin is backed by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Secure wallet integration</li>
              <li>Transparent transaction history</li>
              <li>Clear reward distribution rules</li>
              <li>Responsive support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Community Guidelines</h2>
            <p className="mb-4">
              To maintain a positive environment, we ask users to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Share family-friendly content</li>
              <li>Respect other community members</li>
              <li>Report any suspicious activity</li>
              <li>Help maintain a fun and welcoming atmosphere</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Our Commitment</h2>
            <p className="mb-4">
              Dadcoin is committed to providing:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>A stable and reliable platform</li>
              <li>Fair and transparent rewards</li>
              <li>Regular platform improvements</li>
              <li>Responsive customer support</li>
              <li>Clear communication about any changes</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;