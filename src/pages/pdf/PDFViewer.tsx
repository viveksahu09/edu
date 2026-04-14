import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useLocation } from "react-router-dom";

export default function PDFViewer() {
  const location = useLocation();
  const { url } = location.state as { url: string };
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <Worker workerUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={url}
            plugins={[defaultLayoutPluginInstance]}
            renderError={(error) => (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-600 dark:text-red-400">Failed to load PDF: {error?.message || 'Unknown error'}</p>
              </div>
            )}
          />
        </Worker>
      </div>
    </div>
  );
}
