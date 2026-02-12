import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="font-bold text-slate-900">EPMS</span>
                    </div>

                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link to="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Support</Link>
                    </div>

                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} EPMS International.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;