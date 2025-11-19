import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Upload error:", error);
      setPrediction("Error: Could not connect to backend.");
    }

    setLoading(false);
  };

  return (
    <div className="nature-bg">
      
      {/* 🌿 Nature Background Slideshow */}
      <div className="slideshow">
        <img className="slide" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" />
        <img className="slide" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e" />
        <img className="slide" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" />
        <img className="slide" src="https://images.unsplash.com/photo-1502082553048-f009c37129b9" />
      </div>

      {/* 🌿 UI Card */}
      <div className="content">
        <div className="card">
          <h2 className="title">🍃 Guava Disease Classifier</h2>

          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />

          {preview && <img src={preview} alt="Preview" className="preview-image" />}

          <button onClick={handleUpload} disabled={!selectedImage || loading} className="btn">
            {loading ? "Processing..." : "Predict"}
          </button>

          {prediction && <p className="result">Result: {prediction}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
