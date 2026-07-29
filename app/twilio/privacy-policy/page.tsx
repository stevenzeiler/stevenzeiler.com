import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SMS Privacy Policy — Steven Zeiler',
  description: 'Privacy policy for SMS messaging services on stevenzeiler.com.',
};

export default function TwilioPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-earth-200 hover:text-leaf-400 transition-colors text-sm mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-3xl font-bold text-earth-100">SMS Privacy Policy</h1>
          <p className="text-earth-400 text-sm mt-2">
            Last updated: July 29, 2025
          </p>
        </div>

        <section className="space-y-6 text-earth-200 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Overview</h2>
            <p>
              This privacy policy describes how Steven Zeiler (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
              collects, uses, and protects information in connection with our SMS messaging
              service operated through stevenzeiler.com.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Information We Collect</h2>
            <p>When you interact with our SMS service, we may collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-earth-300">
              <li>Your phone number</li>
              <li>SMS message content sent to and from our number</li>
              <li>Date, time, and frequency of messages</li>
              <li>Opt-in and opt-out status</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">How We Use Your Information</h2>
            <p>We use the information collected solely to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-earth-300">
              <li>Send and receive personal text messages with friends and family</li>
              <li>Receive one-time passwords (OTPs) and verification codes from third-party services</li>
              <li>Respond to your messages and requests</li>
              <li>Manage opt-in and opt-out preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">No Sharing with Third Parties</h2>
            <p>
              We do <strong className="text-earth-100">not</strong> sell, rent, share, or disclose your
              personal information, phone number, or message content to any third parties for
              marketing, advertising, or any other purpose. Your information is kept strictly
              confidential and is used only for the purposes described above.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">No Marketing Messages</h2>
            <p>
              This SMS service is for personal communication only. We do not send promotional,
              marketing, or advertising messages. You will never receive unsolicited commercial
              messages from us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access,
              alteration, or destruction. Messages are transmitted via Twilio&apos;s secure
              infrastructure, which employs industry-standard encryption and security practices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Data Retention</h2>
            <p>
              We retain message data only as long as necessary for the purposes described in
              this policy. You may request deletion of your data at any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-earth-300">
              <li>Opt out of SMS messages at any time by replying <strong className="text-earth-100">STOP</strong></li>
              <li>Request information about the data we hold about you</li>
              <li>Request deletion of your personal data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our SMS practices, please
              contact us at:{' '}
              <a
                href="mailto:me@stevenzeiler.com"
                className="text-leaf-400 hover:text-leaf-300 underline"
              >
                me@stevenzeiler.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted
              on this page with an updated revision date.
            </p>
          </div>
        </section>

        <div className="border-t border-forest-800 pt-6 text-earth-500 text-sm">
          <p>
            See also:{' '}
            <Link
              href="/twilio/terms-and-conditions"
              className="text-leaf-400 hover:text-leaf-300 underline"
            >
              SMS Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
