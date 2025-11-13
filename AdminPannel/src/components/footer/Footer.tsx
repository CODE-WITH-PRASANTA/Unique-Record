const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 py-6 mt-8 shadow-inner">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-gray-700 dark:text-gray-300 text-sm">
        
        {/* Branding */}
        <p className="text-center mb-2">
          &copy; {new Date().getFullYear()} <span className="font-bold text-pink-600">PR WEBSTOCK</span>. All Rights Reserved.
        </p>
        
        {/* Official Site */}
        <a 
          href="https://pr-webstock.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-pink-600 transition-colors font-medium"
        >
          Visit Official Site
        </a>
      </div>
    </footer>
  );
};

export default Footer;
