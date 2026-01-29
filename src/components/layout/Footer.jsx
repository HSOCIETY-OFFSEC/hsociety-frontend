const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {currentYear} Hsociety. All rights reserved.
        </p>
        <p className="footer-tagline">
          Offensive Security Solutions
        </p>
      </div>
    </footer>
  );
};

export default Footer;