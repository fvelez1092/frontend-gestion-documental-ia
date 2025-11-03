import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { api } from "../services/api";

interface UploadButtonProps {
    onUploadSuccess: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFile(e.target.files[0]);
        setStatus("idle");
    };

    const handleFileUpload = async () => {
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("El archivo es demasiado grande. Máximo 10 MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            setStatus("uploading");
            setProgress(0);

            await api.post("/document/", formData, {
                onUploadProgress: (event) => {
                    if (event.total) {
                        setProgress(Math.round((event.loaded * 100) / event.total));
                    }
                },
            });

            setStatus("success");
            onUploadSuccess();
        } catch (error: any) {
            console.error("Error al subir documento:", error);
            setStatus("error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-green-500 to-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-50"
            >
                <Upload size={18} />
                Seleccionar documento
            </button>

            {file && (
                <div className="mb-4 text-sm bg-gray-100 p-2 rounded">
                    <p>Nombre: {file.name}</p>
                    <p>Tamaño: {(file.size / 1024).toFixed(2)} KB</p>
                    <p>Tipo: {file.type}</p>
                </div>
            )}

            {status === "uploading" && (
                <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                            className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600">{progress}% subido</p>
                </div>
            )}

            {file && status !== "uploading" && (
                <button
                    onClick={handleFileUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Subir
                </button>
            )}

            {status === "success" && <p className="text-sm text-green-600">Documento subido correctamente!</p>}
            {status === "error" && <p className="text-sm text-red-600">Error al subir. Intenta nuevamente.</p>}
        </div>
    );
};
