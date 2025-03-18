import DashboardIcon from './AdminIcons/Dashboard.svg';
import AdminLogo from './AdminLogo/admin-logo.svg';
import AccountIcon from './AdminIcons/Account.svg';
import LogoutIcon from './AdminIcons/logout.svg';
import { Link, useNavigate } from 'react-router-dom';
import HmaburgerIcon from './AdminIcons/hamburger.svg';
import { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'; // Import your auth object

function ControlNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1023);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1023);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/controlLogin');
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <aside>
      {isMobileView && (
        <div className="general-nav" onClick={() => setOpenNav((prev) => !prev)}>
          <img src={HmaburgerIcon} alt="Menu" className="lg:hidden" />
        </div>
      )}

      {(openNav || !isMobileView) && (
        <nav className="admin-navbar">
          <ul className="admin-ul">
            <img src={AdminLogo} alt="logo" className="p-2" />

            <li>
              <img src={DashboardIcon} alt="dashboard" className="w-5" />
              <Link to="/controlDashboard">Dashboard</Link>
            </li>

            <li>
              <img src={AccountIcon} alt="account" className="w-5" />
              <Link to="/controlAccount">Account</Link>
            </li>

            <li className="absolute bottom-5">
              <button type='button' onClick={handleLogout} className="flex items-center gap-1 ">
                <img src={LogoutIcon} alt="Logout" className="w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
}

export default ControlNavbar;