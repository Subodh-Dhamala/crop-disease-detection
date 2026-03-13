import { useState } from "react";

const AdvisoryModal = ({ image, onClose }) => {
  const [lang, setLang] = useState("english");

  if (!image) return null;

  const advisory = image.advisory || {};
  const isHealthy = image.diseaseDetected?.toLowerCase()?.includes('healthy');
  const isUnknown = image.diseaseDetected?.toLowerCase() === 'unknown';
  const isNepali = lang === "nepali";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 w-full max-w-3xl rounded-2xl p-6 overflow-y-auto max-h-[90vh] relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Language Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setLang("english")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              !isNepali
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("nepali")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              isNepali
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-zinc-400 hover:bg-white/20"
            }`}
          >
            नेपाली
          </button>
        </div>

        {/* Image */}
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/${image.imageUrl}`}
          alt="Crop"
          className="w-full h-64 object-cover rounded-xl mb-6"
        />

        {/* Disease Name & Status */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {image.diseaseDetected?.replace(/__/g, ' - ').replace(/_/g, ' ') || "Unknown"}
          </h2>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
            isHealthy ? "bg-green-500/20 text-green-400" :
            isUnknown ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            {isHealthy ? (isNepali ? "स्वस्थ" : "Healthy") :
             isUnknown ? (isNepali ? "अज्ञात" : "Low Confidence") :
             (isNepali ? "रोग पत्ता लाग्यो" : "Disease Detected")}
          </div>
        </div>

        {/* Confidence */}
        {image.confidence && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>{isNepali ? "विश्वास स्तर" : "Confidence Level"}</span>
              <span className="font-semibold text-white">
                {Math.round(image.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  image.confidence >= 0.8 ? "bg-green-500" :
                  image.confidence >= 0.5 ? "bg-yellow-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${image.confidence * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Date */}
        <div className="mb-6 text-sm text-zinc-400">
          {isNepali ? "अपलोड मिति" : "Uploaded"}: {new Date(image.createdAt).toLocaleDateString()}
        </div>

        {/* Description */}
        {advisory.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNepali ? "विवरण" : "Description"}
            </h3>
            <p className="text-gray-300">{advisory.description}</p>
          </div>
        )}

        {/* Symptoms */}
        {advisory.symptoms && advisory.symptoms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNepali ? "लक्षणहरू" : "Symptoms"}
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {advisory.symptoms.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Causes */}
        {advisory.causes && advisory.causes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNepali ? "कारणहरू" : "Causes"}
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {advisory.causes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Treatment */}
        {advisory.treatment && advisory.treatment.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNepali ? "उपचार" : "Treatment"}
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {advisory.treatment.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Prevention */}
        {advisory.prevention && advisory.prevention.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isNepali ? "रोकथाम" : "Prevention"}
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {advisory.prevention.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Low Confidence Warning */}
        {isUnknown && (
          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              {isNepali ? "कम विश्वास" : "Low Confidence Detection"}
            </h3>
            <p className="text-gray-300 text-sm">
              {isNepali 
                ? "तस्बिर स्पष्ट छैन। कृपया राम्रो प्रकाशमा नजिकबाट फोटो खिच्नुहोस्।"
                : "The image quality or lighting may not be optimal. Please upload a clear, close-up photo in good lighting for better results."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdvisoryModal;