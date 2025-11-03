import { UploadButton } from "../components/UploadButton";

export const UploadPage = () => {
    const handleUploadSuccess = () => {
        console.log("Documento subido correctamente");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Subir documento</h1>

            <div className="flex justify-center">
                <UploadButton onUploadSuccess={handleUploadSuccess} />
            </div>
        </div>
    );
};
