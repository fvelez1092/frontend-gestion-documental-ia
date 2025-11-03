import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { api } from "../services/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function DocumentViewerPage() {
  const [params] = useSearchParams();
  const name = params.get("name") || "";
  const initialPage = Number(params.get("page") || "1");

  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(Math.max(1, initialPage));
  const [scale, setScale] = useState(1.1);

  const apiBase = (api.defaults?.baseURL || "").replace(/\/+$/, "");
  const fileUrl = useMemo(() => {
    if (!name) return "";
    return `${apiBase}/document/view?name=${encodeURIComponent(name)}`;
  }, [apiBase, name]);

  useEffect(() => {
    setPage(Math.max(1, initialPage));
  }, [initialPage]);

  if (!name) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          Falta el parámetro <b>name</b>.
        </p>
        <Link to="/" className="text-blue-700 underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 bg-white">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-blue-700 underline">← Volver</Link>
          <span className="text-sm text-gray-600 break-all">{name}</span>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Abrir en pestaña
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} className="px-2 py-1 rounded-lg border">−</button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(2, s + 0.1))} className="px-2 py-1 rounded-lg border">＋</button>
          {numPages && (
            <div className="ml-4 flex items-center gap-1 text-sm">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded-lg border">◀</button>
              <span>{page} / {numPages}</span>
              <button onClick={() => setPage((p) => Math.min(numPages || 1, p + 1))} className="px-2 py-1 rounded-lg border">▶</button>
            </div>
          )}
        </div>
      </div>

      {/* Lienzo */}
      <div className="flex-1 flex justify-center py-6">
        {fileUrl ? (
          <div className="shadow-sm bg-white rounded-xl p-3">
            <Document
              file={fileUrl}
              onLoadSuccess={(info) => setNumPages(info.numPages || 1)}
              onLoadError={(e) => console.error("PDF load error", e)}
            >
              <Page pageNumber={page} scale={scale} renderTextLayer renderAnnotationLayer />
            </Document>
          </div>
        ) : (
          <div className="text-gray-500">No se pudo construir la URL del documento.</div>
        )}
      </div>
    </div>
  );
}