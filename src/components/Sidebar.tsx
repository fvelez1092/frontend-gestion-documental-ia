import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, FileText, Upload } from "lucide-react";

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        setTimeout(() => {
            if (location.pathname !== path) navigate(path);
        }, 300); 
    };

    return (
        <>
            {!isOpen && (
                <button
                    className="fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-600 transition-colors"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu size={24} />
                </button>
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-gray-100 shadow-lg transform transition-transform duration-300 z-40
    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                <div className="p-6 relative">
                    <button
                        className="absolute top-4 right-4 p-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold mb-8 text-white">Gestión Documental</h2>

                    <nav className="flex flex-col gap-3">
                        <button
                            onClick={() => handleNavigation("/")}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium w-full text-left hover:bg-green-600 hover:text-white"
                        >
                            <FileText size={20} />
                            Documentos
                        </button>

                        <button
                            onClick={() => handleNavigation("/upload")}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium w-full text-left hover:bg-green-600 hover:text-white"
                        >
                            <Upload size={20} />
                            Subir
                        </button>

                    </nav>
                </div>
            </aside>
        </>
    );
};
