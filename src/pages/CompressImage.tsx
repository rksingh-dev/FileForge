import { useState } from "react";
import { ArrowLeft, Download, Settings, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";

const CompressImage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedImage(null);
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality[0] / 100);
        setCompressedImage(compressedDataUrl);
        
        // Calculate compressed size (approximate)
        const base64Length = compressedDataUrl.split(',')[1].length;
        const compressedSizeBytes = (base64Length * 3) / 4;
        setCompressedSize(compressedSizeBytes);
        
        setIsProcessing(false);
        toast({
          title: "Compression complete!",
          description: `File size reduced by ${Math.round(((originalSize - compressedSizeBytes) / originalSize) * 100)}%`,
        });
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to compress image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.download = `compressed_${selectedFile?.name || 'image.jpg'}`;
    link.href = compressedImage;
    link.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Image Compressor</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center w-full min-h-[80vh] px-4">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            <CardHeader>
              <CardTitle className="text-center text-gray-900">Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
                maxSize={10}
                onFileSelect={handleFileSelect}
                title="Upload Image"
                description="Choose an image file to compress"
              />

              {selectedFile && (
                <div className="mt-6">
                  <Card className="bg-white border border-gray-200 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <Settings className="w-5 h-5 mr-2" />
                        Compression Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-gray-900">Quality: {quality[0]}%</Label>
                        <Slider
                          value={quality}
                          onValueChange={setQuality}
                          max={100}
                          min={10}
                          step={1}
                          className="mt-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Lower quality = smaller file size
                        </p>
                      </div>

                      <Button 
                        onClick={compressImage} 
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      >
                        {isProcessing ? "Compressing..." : "Compress Image"}
                        <Zap className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {compressedImage && (
                <div className="mt-6">
                  <Card className="bg-white border border-gray-200 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Compressed Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={compressedImage} 
                          alt="Compressed"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900">Original</p>
                          <p className="text-gray-600">{formatFileSize(originalSize)}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="font-medium text-green-700">Compressed</p>
                          <p className="text-green-600">{formatFileSize(compressedSize)}</p>
                        </div>
                      </div>

                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-700">
                          Space Saved: {Math.round(((originalSize - compressedSize) / originalSize) * 100)}%
                        </p>
                      </div>

                      <Button 
                        onClick={downloadCompressed}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Compressed Image
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompressImage;
