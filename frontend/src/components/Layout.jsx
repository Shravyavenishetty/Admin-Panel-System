/**
 * Main Layout Component
 * Wrapper component with Sidebar for authenticated pages
 */

import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
