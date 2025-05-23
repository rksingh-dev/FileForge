import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, FileText, Zap, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    pdfjsLib: any;
    PDFDocument: any;
    blobStream: any;
    saveAs: (blob: Blob, filename: string) => void;
    Sortable: any;
  }
}

const REQUIRED_SCRIPTS = [
  {
    id: 'pdf-js',
    src: '/js/pdf.min-2.5.207.js',
    global: 'pdfjsLib',
    worker: '/js/pdf.worker.min-2.5.207.js'
  },
  {
    id: 'pdfkit',
    src: '/js/pdfkit-standalone-0.10.0.js',
    global: 'PDFDocument'
  },
  {
    id: 'blob-stream',
    src: '/js/blob-stream-0.1.3.js',
    global: 'blobStream'
  },
  {
    id: 'file-saver',
    src: '/js/FileSaver.min-2.0.4.js',
    global: 'saveAs'
  },
  {
    id: 'sortable',
    src: '/js/sortable.min.1.10.2.js',
    global: 'Sortable'
  }
];

interface ProcessedPage {
  width: number;
  height: number;
  data: string;
}

interface CompressionSettings {
  imageQuality: number;
  scale: number;
  colorSpace: 'RGB' | 'GRAY';
}

interface ProgressState {
  currentFile: number;
  totalFiles: number;
  currentPage: number;
  totalPages: number;
  percent: number;
}

const getCompressionSettings = (level: number): CompressionSettings => {
  // Determine settings based on compression level - using more moderate settings
  if (level < 30) { // Light compression
    return {
      imageQuality: 0.8,    // Reduced from 0.95
      scale: 0.9,          // Reduced from 1
      colorSpace: 'RGB'
    };
  } else if (level < 60) { // Medium compression
    return {
      imageQuality: 0.7,    // Reduced from 0.85
      scale: 0.85,         // Reduced from 0.95
      colorSpace: 'RGB'
    };
  } else if (level < 80) { // High compression
    return {
      imageQuality: 0.6,    // Reduced from 0.75
      scale: 0.8,          // Reduced from 0.9
      colorSpace: 'RGB'
    };
  } else { // Maximum compression
    return {
      imageQuality: 0.5,    // Reduced from 0.65
      scale: 0.75,         // Reduced from 0.85
      colorSpace: 'RGB'
    };
  }
};

const PdfCompressor = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedPdf, setCompressedPdf] = useState(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    savedBytes: number;
    compressionRatio: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scriptLoadingRef = useRef<boolean>(false);
  const fileListRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<ProgressState>({
    currentFile: 0,
    totalFiles: 0,
    currentPage: 0,
    totalPages: 0,
    percent: 0
  });

  useEffect(() => {
    const loadScript = (script: typeof REQUIRED_SCRIPTS[0]): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
        const existingScript = document.getElementById(script.id);
        if (existingScript) {
          existingScript.remove();
        }

        const scriptElement = document.createElement('script');
        scriptElement.src = script.src;
        scriptElement.id = script.id;
        
        scriptElement.onload = () => {
          console.log(`${script.id} loaded successfully`);
          
          // Special handling for PDF.js worker
          if (script.worker && window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = script.worker;
            console.log("PDF.js worker configured");
          }
          
          // Add a small delay to ensure globals are properly initialized
          setTimeout(() => {
            if (window[script.global]) {
              resolve();
            } else {
              reject(new Error(`${script.global} not found after loading ${script.src}`));
            }
          }, 100);
        };
        
        scriptElement.onerror = () => {
          reject(new Error(`Failed to load ${script.src}`));
        };
        
        document.body.appendChild(scriptElement);
      });
    };

    const loadAllScripts = async () => {
      if (scriptLoadingRef.current) return;
      scriptLoadingRef.current = true;

      try {
        console.log("Starting script loading...");
        setError(null);

        // Load scripts sequentially
        for (const script of REQUIRED_SCRIPTS) {
          await loadScript(script);
          console.log(`${script.id} initialized successfully`);
        }

        // Final verification of all required globals
        const missingLibs = REQUIRED_SCRIPTS.filter(script => !window[script.global]);
        if (missingLibs.length > 0) {
          throw new Error(`Missing required libraries: ${missingLibs.map(s => s.global).join(', ')}`);
        }

        setScriptsLoaded(true);
        console.log("All scripts loaded and verified successfully");
      } catch (error) {
        console.error("Script loading error:", error);
        setError(`Failed to load required resources: ${error.message}`);
      } finally {
        scriptLoadingRef.current = false;
      }
    };

    loadAllScripts();

    // Cleanup function
    return () => {
      REQUIRED_SCRIPTS.forEach(script => {
        const element = document.getElementById(script.id);
        if (element) {
          element.remove();
        }
      });
    };
  }, []);

  // Initialize Sortable after scripts are loaded
  useEffect(() => {
    if (scriptsLoaded && fileListRef.current && window.Sortable) {
      new window.Sortable(fileListRef.current, {
        animation: 150,
        ghostClass: 'ghost-class',
        onSort: (evt) => {
          const files = Array.from(selectedFiles);
          const moved = files.splice(evt.oldIndex!, 1)[0];
          files.splice(evt.newIndex!, 0, moved);
          setSelectedFiles(files);
        }
      });
    }
  }, [scriptsLoaded, selectedFiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.every(file => file.type === 'application/pdf')) {
      setSelectedFiles(files);
      setCompressedPdf(null);
      setCompressionStats(null);
      setError(null);
    } else {
      setError("Please select valid PDF files only");
    }
  };

  const updateProgress = (currentFile: number, totalFiles: number, currentPage: number, totalPages: number) => {
    const overallProgress = ((currentFile - 1) * totalPages + currentPage) / (totalFiles * totalPages);
    setProgress({
      currentFile,
      totalFiles,
      currentPage,
      totalPages,
      percent: Math.round(overallProgress * 100)
    });
  };

  const compressPDF = async () => {
    if (!selectedFiles.length) return;
    if (!scriptsLoaded) {
      setError("Required resources are still loading. Please wait.");
      return;
    }
    if (!window.pdfjsLib || !window.PDFDocument || !window.blobStream) {
      setError("Required libraries not loaded. Please refresh the page.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCompressionStats(null);
    
    // Initialize progress
    setProgress({
      currentFile: 1,
      totalFiles: selectedFiles.length,
      currentPage: 0,
      totalPages: 0,
      percent: 0
    });

    try {
      const CHUNK_SIZE = 5;
      const processedPages: ProcessedPage[] = [];
      const settings = getCompressionSettings(compressionLevel);
      const totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      
      // Reduce max file size limits
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // Reduced to 50MB total
      if (totalOriginalSize > MAX_FILE_SIZE) {
        throw new Error("Total file size exceeds 50MB. Please process fewer or smaller files.");
      }

      // Process each PDF file
      for (let fileIndex = 0; fileIndex < selectedFiles.length; fileIndex++) {
        const file = selectedFiles[fileIndex];
        if (file.size > 25 * 1024 * 1024) { // Reduced to 25MB per file
          throw new Error(`File "${file.name}" exceeds 25MB. Please choose a smaller file.`);
        }

        console.log(`Processing file: ${file.name} with settings:`, settings);
        const pdfDoc = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        
        // Update progress with total pages for current file
        setProgress(prev => ({
          ...prev,
          currentFile: fileIndex + 1,
          totalPages: pdfDoc.numPages,
          currentPage: 0
        }));

        // Process pages in chunks
        for (let i = 1; i <= pdfDoc.numPages; i += CHUNK_SIZE) {
          const chunk = [];
          const end = Math.min(i + CHUNK_SIZE - 1, pdfDoc.numPages);
          
          for (let j = i; j <= end; j++) {
            const page = await pdfDoc.getPage(j);
            chunk.push({ page, pageNum: j });
            // Update progress for each page
            updateProgress(fileIndex + 1, selectedFiles.length, j, pdfDoc.numPages);
          }

          // Process chunk
          for (const { page, pageNum } of chunk) {
            const viewport = page.getViewport({ scale: settings.scale });
            
            // Set canvas dimensions
            const canvas = canvasRef.current;
            if (!canvas) {
              throw new Error("Canvas not found");
            }
            const context = canvas.getContext('2d');
            if (!context) {
              throw new Error("Could not get canvas context");
            }
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Render page to canvas
            console.log(`Rendering page ${pageNum} to canvas...`);
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            // Convert to grayscale if specified
            if (settings.colorSpace === 'GRAY') {
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
              }
              context.putImageData(imageData, 0, 0);
            }
            
            // Get compressed image data
            const imageData = canvas.toDataURL('image/jpeg', settings.imageQuality);
            processedPages.push({
              width: canvas.width,
              height: canvas.height,
              data: imageData
            });
            console.log(`Page ${pageNum} processed successfully`);
          }
        }
      }

      // Create new PDF with compressed images
      console.log("Creating new PDF document...");
      const doc = new window.PDFDocument({ autoFirstPage: false });
      const stream = window.blobStream();
      
      // Set up stream handling
      const streamFinished = new Promise<Blob>((resolve) => {
        stream.on('finish', () => {
          resolve(stream.toBlob('application/pdf'));
        });
      });

      doc.pipe(stream);

      // Add each compressed page
      for (let i = 0; i < processedPages.length; i++) {
        console.log(`Adding page ${i + 1} to output PDF...`);
        const { width, height, data } = processedPages[i];

        doc.addPage({ size: [width, height] });
        doc.image(data, 0, 0, { width, height });
      }

      console.log("Finalizing PDF...");
      doc.end();

      // Get the compressed PDF blob
      const blob = await streamFinished;
      console.log("PDF compression complete");
      
      // Calculate compression statistics
      const compressedSize = blob.size;
      const savedBytes = Math.max(0, totalOriginalSize - compressedSize);
      const compressionRatio = ((savedBytes / totalOriginalSize) * 100).toFixed(1);

      setCompressionStats({
        originalSize: totalOriginalSize,
        compressedSize,
        savedBytes,
        compressionRatio
      });

      // Download the file
      downloadFile(blob, `compressed_${selectedFiles[0].name}`);

    } catch (error) {
      console.error('Compression error:', error);
      setError(`Failed to compress PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      // Reset progress
      setProgress({
        currentFile: 0,
        totalFiles: 0,
        currentPage: 0,
        totalPages: 0,
        percent: 0
      });
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    if (window.saveAs) {
      window.saveAs(blob, filename);
    } else {
      // Fallback if FileSaver.js fails to load
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Compressor</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload PDF Files</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-sm text-gray-500">
              Select PDF files to compress
            </p>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2" ref={fileListRef}>
              {selectedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-lg cursor-move flex items-center"
                  data-id={index}
                >
                  <div className="mr-2 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-gray-600">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compression Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Compression Level: {compressionLevel}%</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Quality Priority</span>
              <span className="text-sm text-gray-600">Size Priority</span>
            </div>
                  <input
              type="range"
              min="0"
              max="100"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Better Quality</span>
              <span className="text-xs text-gray-500">Smaller Size</span>
            </div>
                  </div>

          {/* Compression Level Indicator */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700">
              Current Mode: {
                compressionLevel < 30 ? "Light Compression" :
                compressionLevel < 60 ? "Balanced Compression" :
                compressionLevel < 80 ? "High Compression" :
                "Maximum Compression"
              }
            </div>
                  </div>
          
          {/* Compression Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Quality Settings:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                <p className="text-gray-600">Image Quality:</p>
                <p className="font-medium">{Math.round(getCompressionSettings(compressionLevel).imageQuality * 100)}%</p>
                  </div>
              <div>
                <p className="text-gray-600">Image Scale:</p>
                <p className="font-medium">{Math.round(getCompressionSettings(compressionLevel).scale * 100)}%</p>
              </div>
              </div>
            </div>

          {/* File Size Limits */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2">File Size Limits:</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Maximum file size per PDF: 25MB</li>
              <li>• Maximum total size for batch processing: 50MB</li>
            </ul>
          </div>
        </div>

        {/* Compression Results */}
        {compressionStats && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-green-700">✅ Compression Complete!</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Original Size</p>
                <p className="text-lg font-semibold">{formatFileSize(compressionStats.originalSize)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Compressed Size</p>
                <p className="text-lg font-semibold text-green-700">
                  {formatFileSize(compressionStats.compressedSize)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Space Saved</p>
                <p className="text-lg font-semibold text-blue-700">
                  {formatFileSize(compressionStats.savedBytes)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Reduction</p>
                <p className="text-lg font-semibold text-purple-700">{compressionStats.compressionRatio}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={compressPDF}
            disabled={isProcessing || selectedFiles.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Compressing...</span>
              </span>
            ) : (
              <>
                Compress PDF
                <Zap className="w-4 h-4 ml-2" />
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing PDF {progress.currentFile} of {progress.totalFiles}</span>
                <span>{progress.percent}% Complete</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>

              <div className="text-sm text-gray-500">
                {progress.currentPage > 0 && (
                  <span>Page {progress.currentPage} of {progress.totalPages}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default PdfCompressor;