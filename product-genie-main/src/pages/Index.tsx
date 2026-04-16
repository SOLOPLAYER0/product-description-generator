import { useState, useRef } from "react";
import { Upload, Sparkles, Tag, FileText, List, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PLACEHOLDER_OUTPUT = {
  title: "Premium Wireless Noise-Cancelling Headphones",
  tagline: "Immerse yourself in pure sound — anytime, anywhere.",
  description:
    "Experience unparalleled audio quality with our state-of-the-art wireless headphones. Designed for the modern audiophile, these headphones combine cutting-edge noise-cancellation technology with luxurious comfort for an immersive listening experience that lasts all day.",
  features: [
    "Active Noise Cancellation with adaptive sound control",
    "40-hour battery life with quick-charge support",
    "Premium memory foam ear cushions for all-day comfort",
    "Bluetooth 5.3 with multipoint connection",
    "Built-in microphone with AI-powered voice clarity",
  ],
};

const ProductDescriptionGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

const handleGenerate = async () => {
  console.log("BUTTON CLICKED");
  if (!fileInputRef.current?.files?.[0]) return;

  const file = fileInputRef.current.files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("style", style);
  formData.append("tone", tone);
  formData.append("length", length);

  setGenerating(true);
//"http://127.0.0.1:8000/generate"
  try {
    const res = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      body: formData,
    });

    // ✅ Handle backend crash properly
    if (!res.ok) {
      throw new Error("Backend error");
    }

    const data = await res.json();

    console.log("API RESPONSE:", data);

    // ✅ IMPORTANT: backend returns object inside description
    setResult(data.description);

    // ✅ show UI
    setShowOutput(true);

  } catch (err) {
    console.error("ERROR:", err);
  }

  setGenerating(false);
};

  // const handleGenerate = () => {
  //   setGenerating(true);
  //   setShowOutput(false);
  //   setTimeout(() => {
  //     setGenerating(false);
  //     setShowOutput(true);
  //   }, 1500);
  // };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            Generative AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Product Description Generator
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload a product image and generate compelling descriptions instantly.
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="w-5 h-5 text-primary" />
              Upload Product Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImageUpload}
            />
            {!image ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <Upload className="w-10 h-10 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  Click to upload JPG, PNG, or JPEG
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <img
                  src={image}
                  alt="Uploaded product"
                  className="w-full max-h-80 object-contain rounded-lg bg-muted"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImage(null);
                    setShowOutput(false);
                  }}
                >
                  Remove Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generation Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tone</label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Length</label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={!image || generating}
          onClick={handleGenerate}
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Description
            </span>
          )}
        </Button>

        {/* Output */}
        {showOutput && (
          <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="w-5 h-5 text-primary" />
                  Title
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-foreground">
                  {result?.title || "No title"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Tagline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg italic text-muted-foreground">
                  {result?.tagline || "No tagline"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {result?.description || "No Description"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <List className="w-5 h-5 text-primary" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result?.features?.length > 0 ? (
                    result.features.map((f, i) => (
                       <li key={i}>{f}</li>
                     ))
                      ) : (
                     <p>No features available</p>
                    )}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionGenerator;
