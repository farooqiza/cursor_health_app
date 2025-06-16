const TermsOfServicePage = () => {
  return (
    <div className="prose lg:prose-xl">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our website and services, you agree to be bound by these Terms of Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Our service provides health-related information, procedure pricing, and an AI assistant for general guidance. This service is for informational purposes only and does not constitute medical advice.
      </p>

      <h2>3. User Conduct</h2>
      <p>
        You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
      </p>
      
      <h2>4. Disclaimers</h2>
      <p>
        The information provided on this website is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        We are not liable for any decisions you make based on the information provided on our website. Your use of the service is at your sole risk.
      </p>
    </div>
  );
};

export default TermsOfServicePage; 