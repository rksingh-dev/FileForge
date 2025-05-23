import { useState, useRef } from 'react';
import { PDFDocument, PageSizes, degrees } from 'pdf-lib';
import { FileText, Upload, Settings, Trash2, Plus, Download } from 'lucide-react';
import EXIF from 'exif-js';

// Constants for page sizes and orientations
const PAGE_SIZES = {
  A4: "A4",
  LETTER: "US Letter",
  FIT: "Same as Image"
} as const;

const ORIENTATIONS = {
  PORTRAIT: "Portrait",
  LANDSCAPE: "Landscape"
} as const;

const MARGINS = {
  NONE: "0",
  SMALL: "20",
  LARGE: "50"
} as const;

interface ImageFile {
  id: string;
  imgDataUrl: string;
  file: File;
  selected: boolean;
}

interface ImageToPdfSettings {
  pageOrientation: typeof ORIENTATIONS[keyof typeof ORIENTATIONS];
  pageSize: typeof PAGE_SIZES[keyof typeof PAGE_SIZES];
  pageMargin: typeof MARGINS[keyof typeof MARGINS];
  compressImages: boolean;
  imageQuality: number;
}

const ImageToPdf = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ImageToPdfSettings>({
    pageOrientation: ORIENTATIONS.PORTRAIT,
    pageSize: PAGE_SIZES.A4,
    pageMargin: MARGINS.NONE,
    compressImages: false,
    imageQuality: 8
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type === "image/png" || 
      file.type === "image/jpeg" || 
      file.type === "image/x-png"
    );

    const newImages = await Promise.all(validFiles.map(async (file) => {
      const imgDataUrl = URL.createObjectURL(file);
      return {
        id: generateUUID(),
        imgDataUrl,
        file,
        selected: false
      };
    }));

    setImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type === "image/png" || 
      file.type === "image/jpeg" || 
      file.type === "image/x-png"
    );

    if (validFiles.length === 0) {
      setError("Please select valid image files (PNG or JPEG)");
      return;
    }

    const newImages = await Promise.all(validFiles.map(async (file) => {
      const imgDataUrl = URL.createObjectURL(file);
      return {
        id: generateUUID(),
        imgDataUrl,
        file,
        selected: false
      };
    }));

    setImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const handleImageReorder = (draggedId: string, targetId: string) => {
    setImages(prev => {
      const newImages = [...prev];
      const draggedIndex = newImages.findIndex(img => img.id === draggedId);
      const targetIndex = newImages.findIndex(img => img.id === targetId);
      const [draggedItem] = newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, draggedItem);
      return newImages;
    });
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const getPageSize = () => {
    const { pageSize, pageOrientation } = settings;
    let size;

    switch (pageSize) {
      case PAGE_SIZES.A4:
        size = [...PageSizes.A4];
        break;
      case PAGE_SIZES.LETTER:
        size = [...PageSizes.Letter];
        break;
      default:
        return undefined;
    }

    if (pageOrientation === ORIENTATIONS.LANDSCAPE) {
      size.reverse();
    }

    return size;
  };

  const createPdf = async () => {
    if (images.length === 0) return;

    try {
      setIsProcessing(true);
      setError(null);

      const pdfDoc = await PDFDocument.create();
      
      for (const image of images) {
        const response = await fetch(image.imgDataUrl);
        const imageData = await response.arrayBuffer();
        
        // Determine page size
        let pageSize = getPageSize();
        
        // Handle image orientation from EXIF
        let rotation = 0;
        if (image.file.type === 'image/jpeg') {
          try {
            const exifData = EXIF.readFromBinaryFile(imageData);
            if (exifData?.Orientation) {
              switch (exifData.Orientation) {
                case 6: rotation = 90; break;
                case 3: rotation = 180; break;
                case 8: rotation = 270; break;
              }
            }
          } catch (err) {
            console.error('EXIF read error:', err);
          }
        }

        // Embed image
        const pdfImage = image.file.type === 'image/jpeg' 
          ? await pdfDoc.embedJpg(imageData)
          : await pdfDoc.embedPng(imageData);

        // Create page
        if (settings.pageSize === PAGE_SIZES.FIT) {
          pageSize = [pdfImage.width, pdfImage.height];
        }

        const page = pdfDoc.addPage(pageSize);

        if (settings.pageSize === PAGE_SIZES.FIT) {
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: pdfImage.width,
            height: pdfImage.height,
          });
        } else {
          const margin = parseInt(settings.pageMargin);
          const scaleFactor = Math.min(
            (page.getWidth() - margin) / pdfImage.width,
            (page.getHeight() - margin) / pdfImage.height
          );

          const width = pdfImage.width * scaleFactor;
          const height = pdfImage.height * scaleFactor;

          page.drawImage(pdfImage, {
            x: (page.getWidth() - width) / 2,
            y: (page.getHeight() - height) / 2,
            width,
            height,
          });
        }

        if (rotation !== 0) {
          page.setRotation(degrees(rotation));
        }
      }

      // Save and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted-images.pdf';
      link.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('PDF creation error:', err);
      setError('Failed to create PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
      {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Image to PDF Converter</h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {images.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
              <p className="text-gray-600 mb-6">
                Select or drag and drop your images to convert them to PDF
              </p>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Select Images
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  or drag and drop images here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Grid */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', image.id)}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedId = e.dataTransfer.getData('text/plain');
                      handleImageReorder(draggedId, image.id);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={image.imgDataUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => deleteImage(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add More</span>
                </button>
        </div>
            </div>

            {/* Settings Panel */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setShowSettings(!showSettings)}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">PDF Settings</span>
                </div>
                <span className="text-gray-500">{showSettings ? '−' : '+'}</span>
              </div>

              {showSettings && (
                <div className="p-4 border-t space-y-6">
                  {/* Page Size */}
            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(PAGE_SIZES).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSettings({ ...settings, pageSize: size })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            settings.pageSize === size
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(ORIENTATIONS).map((orientation) => (
                        <button
                          key={orientation}
                          onClick={() => setSettings({ ...settings, pageOrientation: orientation })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            settings.pageOrientation === orientation
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {orientation}
                        </button>
                      ))}
                          </div>
                          </div>

                  {/* Margins */}
                  {settings.pageSize !== PAGE_SIZES.FIT && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Margins
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(MARGINS).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setSettings({ ...settings, pageMargin: value })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              settings.pageMargin === value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </button>
                        ))}
                        </div>
                    </div>
                  )}

                  {/* Image Compression */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Compression
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          checked={settings.compressImages}
                          onChange={(e) => setSettings({ ...settings, compressImages: e.target.checked })}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                      {settings.compressImages && (
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              imageQuality: Math.max(1, prev.imageQuality - 1)
                            }))}
                            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium">
                            Quality: {settings.imageQuality / 10}
                          </span>
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              imageQuality: Math.min(10, prev.imageQuality + 1)
                            }))}
                            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            +
                          </button>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={createPdf}
              disabled={isProcessing || images.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <span className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Converting...</span>
                </span>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Create PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToPdf;
