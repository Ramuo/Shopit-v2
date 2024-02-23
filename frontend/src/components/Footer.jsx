import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-1 pt-5">
      <p className="text-center mt-1 fw-bold">
        ShopIT Copyright &copy; {currentYear}
      </p>
    </footer>
  );
};

export default Footer;