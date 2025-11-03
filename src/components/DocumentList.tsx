import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

interface DocumentListProps {
  refresh: boolean;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
}

type DocItem = {
  filename: string;
  modified_at?: number | string; // epoch sec (float) o string
};

type ListResponse =
  | {
      status: "success";
      data: {
        documents: DocItem[];
        page: number;
        per_page: number;
        total: number;
      };
    }
  | {
      status: "error";
      message?: string;
    };

export const DocumentList = ({
  refresh,
  page = 1,
  perPage = 10,
  onPageChange,
}: DocumentListProps) => {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ page: number; per_page: number; total: number }>({
    page,
    per_page: perPage,
    total: 0,
  });

  const fetchDocuments = async (p = page, pp = perPage) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get<ListResponse>(`/document/?page=${p}&per_page=${pp}`);
      if (res.data.status !== "success") {
        throw new Error(("message" in res.data && res.data.message) || "Respuesta inválida");
      }
      const payload = res.data.data;
      setDocs(payload.documents || []);
      setMeta({ page: payload.page, per_page: payload.per_page, total: payload.total });
    } catch (e: any) {
      setErr(e?.message || "Error al cargar documentos");
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(page, perPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, page, perPage]);

  const totalPages = useMemo(() => {
    if (!meta.total) return 1;
    return Math.max(1, Math.ceil(meta.total / meta.per_page));
  }, [meta]);

  const formatDate = (v?: number | string) => {
    if (v == null) return "—";
    // backend envía epoch en segundos (float). Si viene string, intenta parsear.
    const num = typeof v === "string" ? Number(v) : v;
    const ms = !isNaN(Number(num)) && Number(num) < 1e12 ? Number(num) * 1000 : Number(num);
    const d = new Date(ms);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
    // Si quieres solo fecha: d.toLocaleDateString()
  };

  if (loading) return <p>Cargando documentos...</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;
  if (!docs.length) return <p>No hay documentos disponibles</p>;

  return (
    <div className="space-y-4">
      {docs.map((item, idx) => (
        <div
          key={item.filename + idx}
          className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-green-600" />
            <div>
              <p className="font-semibold break-all">{item.filename}</p>
              <p className="text-left text-sm text-gray-500">
                Modificado: {formatDate(item.modified_at)}
              </p>
            </div>
          </div>

          {/* Abrir visor interno */}
          <Link
            to={`/viewer?name=${encodeURIComponent(item.filename)}`}
            className="text-green-700 hover:underline"
          >
            Ver PDF
          </Link>
        </div>
      ))}

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          disabled={meta.page <= 1}
          onClick={() => onPageChange?.(meta.page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {meta.page} de {totalPages}
        </span>
        <button
          disabled={meta.page >= totalPages}
          onClick={() => onPageChange?.(meta.page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};