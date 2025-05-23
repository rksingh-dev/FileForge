import { useState, useEffect } from "react";
import { ArrowLeft, Download, FileImage, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";

// Import PDF.js dynamically
const loadPdfLib = async () => {
  const pdfjs = await import('pdfjs-dist/build/pdf');
  const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
  
  // Configure the worker
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  
  return pdfjs;
};

const PdfToImage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<string[]>([]);
  const { toast } = useToast();
  const [pdfLib, setPdfLib] = useState<typeof import('pdfjs-dist/build/pdf') | null>(null);

  useEffect(() => {
    loadPdfLib().then(lib => {
      setPdfLib(lib);
    }).catch(error => {
      console.error('Error loading PDF.js:', error);
      toast({
        title: "PDF.js Loading Error",
        description: "Failed to load PDF processing library. Please try refreshing the page.",
        variant: "destructive",
      });
    });
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConvertedImages([]);
  };

  const convertToImages = async () => {
    if (!selectedFile || !pdfLib) return;

    setIsProcessing(true);
    
    try {
      // Load the PDF file
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfLib.getDocument({ data: fileArrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const images: string[] = [];

      // Convert each page to an image
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          // Clear canvas before rendering
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Set white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
            background: 'white'
          }).promise;

          // Convert to the selected format
          let mimeType: string;
          switch (outputFormat) {
            case 'png':
              mimeType = 'image/png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
            default:
              mimeType = 'image/jpeg';
          }

          const imageUrl = canvas.toDataURL(mimeType, 0.8);
          images.push(imageUrl);
        }
      }

      setConvertedImages(images);
      
      toast({
        title: "Conversion complete!",
        description: `${totalPages} PDF pages have been converted to ${outputFormat.toUpperCase()} images.`,
      });
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      toast({
        title: "Conversion failed",
        description: "There was an error processing your PDF. Please make sure it's a valid PDF file and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadImage = (imageUrl: string, index: number) => {
    if (!selectedFile) return;
    
    console.log("Downloading image:", imageUrl.substring(0, 50) + "...");
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${selectedFile.name.replace('.pdf', '')}_page${index+1}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Download initiated");
    
    toast({
      title: "Download started",
      description: `Page ${index + 1} is downloading as ${outputFormat.toUpperCase()}`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">PDF to Image</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <FileUpload
            acceptedTypes={['.pdf']}
            maxSize={50}
            onFileSelect={handleFileSelect}
            title="Upload PDF"
            description="Choose a PDF file to convert to images"
          />

          {selectedFile && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Conversion Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select image format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">JPG (Recommended)</SelectItem>
                      <SelectItem value="png">PNG (High Quality)</SelectItem>
                      <SelectItem value="webp">WebP (Smaller Size)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">File Name:</span>
                  <span className="text-gray-600">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">File Size:</span>
                  <span className="text-gray-600">{formatFileSize(selectedFile.size)}</span>
                </div>

                {convertedImages.length === 0 ? (
                  <Button 
                    onClick={convertToImages} 
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isProcessing ? "Converting..." : "Convert to Images"}
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}

                {isProcessing && (
                  <div className="text-center p-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <p className="mt-2 text-gray-600">Converting PDF pages to images...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {convertedImages.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Converted Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {convertedImages.map((imageUrl, index) => (
                  <div key={index} className="space-y-3">
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`Page ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Page {index + 1}</span>
                      <Button
                        onClick={() => downloadImage(imageUrl, index)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download as {outputFormat.toUpperCase()}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-orange-900 mb-2">Conversion Details</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Each PDF page becomes a separate image</li>
                <li>• High-resolution output for best quality</li>
                <li>• Preserves original formatting and layout</li>
                <li>• Downloads as individual image files</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfToImage;
