import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen font-sans bg-[#121212] text-[#fafafa]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-[#a6a6a6] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="w-12 h-12 bg-[#2266ec]/10 border border-[#2266ec]/20 rounded-xl flex items-center justify-center mb-6">
          <Shield className="w-6 h-6 text-[#2266ec]" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Privacy Policy</h1>
        <p className="text-[#a6a6a6] text-[15px] mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-[15px] leading-relaxed text-[#d4d4d4]">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, build a dashboard, or communicate with us. This may include your name, email address, and the configuration data for your custom reports.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and provide the features and functionality of the Service. We may also use it to communicate with you about updates, security alerts, and support messages.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">3. Data Security</h2>
            <p>
              We implement reasonable security measures to protect the security of your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white tracking-tight">4. Third-Party Services</h2>
            <p>
              Our Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-[#262626]">
            <p className="text-[#a6a6a6] text-sm">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@litetrack.com" className="text-[#2266ec] hover:underline">privacy@litetrack.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
