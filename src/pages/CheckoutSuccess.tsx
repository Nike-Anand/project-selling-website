import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';

interface DownloadLink {
  projectId: string;
  downloadUrl: string;
}

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const downloadLinks = (location.state?.downloadLinks || []) as DownloadLink[];

  useEffect(() => {
    if (!location.state?.downloadLinks) {
      navigate('/');
    }
  }, [location.state, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold dark:text-white">
          Thank you for your purchase!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your projects are ready to download
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {downloadLinks.map((link) => (
          <div
            key={link.projectId}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex justify-between items-center"
          >
            <span className="dark:text-white">Project Files</span>
            <a
              href={link.downloadUrl}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              download
            >
              <Download className="h-5 w-5 mr-2" />
              Download
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Download links will expire in 1 hour. Please save your files before they expire.
        </p>
      </div>
    </div>
  );
}