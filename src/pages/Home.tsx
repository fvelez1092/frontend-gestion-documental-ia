import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { DocumentList } from "../components/DocumentList";

export const Home = () => {
    const [refresh] = useState(false);


    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                    Documentos
                </h1>

                <DocumentList refresh={refresh} />
            </main>
        </div>
    );
};
