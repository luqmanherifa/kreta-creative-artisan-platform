export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-white font-bold mb-2">Kreta</h3>
            <p className="text-sm text-gray-400">
              Creative marketplace for talented artisans
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Platform</h4>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="hover:text-white">
                  Find Talent
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Browse Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Kreta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
