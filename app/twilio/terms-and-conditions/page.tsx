import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SMS Terms and Conditions — Steven Zeiler',
  description: 'Terms and conditions for SMS messaging services on stevenzeiler.com.',
};

export default function TwilioTermsAndConditions() {
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
          <h1 className="text-3xl font-bold text-earth-100">SMS Terms and Conditions</h1>
          <p className="text-earth-400 text-sm mt-2">
            Last updated: July 29, 2025
          </p>
        </div>

        <section className="space-y-6 text-earth-200 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Program Name</h2>
            <p>Steven Zeiler Personal SMS</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Program Description</h2>
            <p>
              This SMS service is a personal messaging program operated by Steven Zeiler
              through stevenzeiler.com. The service is used exclusively for:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-earth-300">
              <li>Personal text message communication with friends and family</li>
              <li>Receiving one-time passwords (OTPs) and verification codes from third-party services</li>
            </ul>
            <p className="mt-2">
              This is not a commercial, promotional, or marketing messaging service. No
              advertising or solicitation messages will be sent through this program.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Message Frequency</h2>
            <p>
              Message frequency varies based on personal conversation activity. This is a
              personal messaging service, so message volume will depend on normal conversational
              patterns. There is no recurring automated messaging schedule.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Message and Data Rates</h2>
            <p>
              <strong className="text-earth-100">Message and data rates may apply.</strong>{' '}
              Standard messaging rates from your wireless carrier apply to all SMS messages
              sent and received. Please contact your carrier for details about your messaging
              plan and any associated costs.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Opt-In</h2>
            <p>
              By providing your phone number and consenting to receive SMS messages, you agree
              to these terms and conditions. Consent is not a condition of any purchase or
              service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Opt-Out Instructions</h2>
            <p>
              You can opt out of receiving SMS messages at any time. To stop receiving messages:
            </p>
            <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4 mt-3 space-y-2">
              <p>
                Reply <strong className="text-leaf-400 text-lg">STOP</strong> to any message
                to unsubscribe and stop receiving SMS messages.
              </p>
            </div>
            <p className="mt-3">
              After sending STOP, you will receive a one-time confirmation message, and no
              further messages will be sent unless you opt back in.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Help</h2>
            <p>
              If you need assistance or have questions about this SMS service:
            </p>
            <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4 mt-3 space-y-2">
              <p>
                Reply <strong className="text-leaf-400 text-lg">HELP</strong> to any message
                for support information.
              </p>
            </div>
            <p className="mt-3">
              You can also reach us by email at:{' '}
              <a
                href="mailto:me@stevenzeiler.com"
                className="text-leaf-400 hover:text-leaf-300 underline"
              >
                me@stevenzeiler.com
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Supported Carriers</h2>
            <p>
              This service is available on all major US wireless carriers including AT&amp;T,
              Verizon, T-Mobile, Sprint, and other supported carriers. Service availability
              may vary by carrier.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Privacy</h2>
            <p>
              Your privacy is important to us. We do not sell, share, or disclose your phone
              number or message content to third parties. For full details, see our{' '}
              <Link
                href="/twilio/privacy-policy"
                className="text-leaf-400 hover:text-leaf-300 underline"
              >
                SMS Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Contact Information</h2>
            <p>
              For support or questions regarding this SMS service, contact:
            </p>
            <ul className="list-none mt-2 space-y-1 text-earth-300">
              <li>
                <strong className="text-earth-100">Name:</strong> Steven Zeiler
              </li>
              <li>
                <strong className="text-earth-100">Email:</strong>{' '}
                <a
                  href="mailto:me@stevenzeiler.com"
                  className="text-leaf-400 hover:text-leaf-300 underline"
                >
                  me@stevenzeiler.com
                </a>
              </li>
              <li>
                <strong className="text-earth-100">Website:</strong>{' '}
                <a
                  href="https://stevenzeiler.com"
                  className="text-leaf-400 hover:text-leaf-300 underline"
                >
                  stevenzeiler.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-earth-100 mb-3">Changes to These Terms</h2>
            <p>
              We reserve the right to update these terms and conditions at any time. Changes
              will be posted on this page with an updated revision date.
            </p>
          </div>
        </section>

        <div className="border-t border-forest-800 pt-6 text-earth-500 text-sm">
          <p>
            See also:{' '}
            <Link
              href="/twilio/privacy-policy"
              className="text-leaf-400 hover:text-leaf-300 underline"
            >
              SMS Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
