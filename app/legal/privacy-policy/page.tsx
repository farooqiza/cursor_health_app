const PrivacyPolicyPage = () => {
  return (
    <div className="prose lg:prose-xl">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Introduction</h2>
      <p>
        We respect your privacy and are committed to protecting it. This privacy policy explains how we collect, use, and share your personal information when you use our services.
      </p>

      <h2>Information We Collect</h2>
      <p>
        <strong>Non-Identifiable Information:</strong> We automatically collect your IP address, browser type, visit time, and pages viewed to improve our services.
      </p>
      <p>
        <strong>Identifiable Information:</strong> We collect personal information like your name, email, and health-related inputs only when you voluntarily provide it.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To customize and improve your experience.</li>
        <li>To provide you with the services you requested.</li>
        <li>To contact you with news or information, with your consent.</li>
      </ul>
      <p>
        Your information is never shared with third parties unless required by law or to protect our rights.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to ensure your data is secure. All health-related data is stored securely within the UAE.
      </p>

      <h2>Your Consent</h2>
      <p>
        By using our services, you consent to our collection and use of your personal information as described in this policy.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage; 