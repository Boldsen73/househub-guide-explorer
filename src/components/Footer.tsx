
import { Link } from 'react-router-dom';
import { Lock, Settings, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">HouseHub</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              HouseHub er en innovativ platform, der forbinder boligsælgere med kvalificerede ejendomsmæglere. 
              Vi skaber gennemsigtighed i boligmarkedet og sikrer, at sælgere får de bedste tilbud.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For sælgere</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hvordan-virker-det" className="text-gray-300 hover:text-white transition-colors">
                  Sådan virker det
                </Link>
              </li>
              <li>
                <Link to="/saelger" className="text-gray-300 hover:text-white transition-colors">
                  Sælg din bolig
                </Link>
              </li>
              <li>
                <Link to="/om-os" className="text-gray-300 hover:text-white transition-colors">
                  Om HouseHub
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                  Kontakt os
                </Link>
              </li>
              <li>
                <a href="mailto:support@househub.dk" className="text-gray-300 hover:text-white transition-colors">
                  support@househub.dk
                </a>
              </li>
              <li>
                <a href="tel:+4570123456" className="text-gray-300 hover:text-white transition-colors">
                  +45 70 12 34 56
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 HouseHub. Alle rettigheder forbeholdes.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/vilkaar" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <Lock className="mr-1 h-4 w-4" />
                Vilkår og betingelser
              </Link>
              <Link to="/privatlivspolitik" className="text-gray-400 hover:text-white transition-colors flex items-center">
                <Settings className="mr-1 h-4 w-4" />
                Privatlivspolitik
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
