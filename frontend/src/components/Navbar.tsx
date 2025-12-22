import { Search, User } from 'lucide-react';
import { SidebarTrigger } from './Sidebar';
import { GlassCard } from './GlassCard';
import { useEffect, useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    // 1. Try to get the email from local storage
    // (Make sure your Login.tsx saves 'email' to localStorage!)
    const email = localStorage.getItem('email'); 
    
    if (email) {
      // 2. Extract the name part (everything before the @)
      const namePart = email.split('@')[0];
      
      // 3. Capitalize the first letter (e.g., "shubham" -> "Shubham")
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      
      setDisplayName(formattedName);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="px-4 py-4 lg:pl-20 lg:pr-8">
        <GlassCard className="px-4 py-3" hover={false}>
          <div className="flex items-center justify-between">
            
            {/* Left Side: Menu + Search */}
            <div className="flex items-center gap-4">
              <SidebarTrigger onClick={onMenuClick} />

              {/* Search Bar */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 w-64 focus-within:bg-white/10 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm flex-1 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Right side: User Profile */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-3">
                <div className="hidden sm:block text-right">
                  {/* Shows "Shubham" instead of John Doe */}
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-gray-400">Welcome Back !</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>
        </GlassCard>
      </div>
    </header>
  );
};