import { useEffect, useState } from "react";
import { getImages, deleteImage } from "../api/image.api";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import AdvisoryModal from "../components/AdvisoryModal";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const data = await getImages();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img._id !== imageId));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  useEffect(() => {
    fetchImages();

    // Auto-refresh every 5 seconds for pending images
    const interval = setInterval(() => {
      fetchImages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

<<<<<<< HEAD
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
=======
  useEffect(() => {
    const handler = () => setSidebarOpen((p) => !p);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  const handleImageClick = async (image) => {
    if (!image.diseaseDetected || image.diseaseDetected.toLowerCase() === "pending") return;
    setModalLoading(true);
    try {
      const advisory = await getAdvisory(image.diseaseDetected);
      setModalData({
        ...advisory,
        imageUrl: image.imageUrl,
        confidence: image.confidence,
        createdAt: image.createdAt,
      });
    } catch (err) {
      console.error("Failed to fetch advisory", err);
      showToast("Could not load advisory. Try again.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      showToast("Image deleted successfully.");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete image.", "error");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all"
        >
          Retry
        </button>
>>>>>>> e66cefa738cd3534f098095c23f9674965f6b2c4
      </div>
    );
  }

  const pendingCount = images.filter(img => img.diseaseDetected?.toLowerCase() === 'pending').length;

  return (
    <div className="min-h-screen bg-[#0d140d]">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 border-r border-white/10 p-6 min-h-[calc(100vh-73px)]">
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold">
              Dashboard
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-all"
            >
              Upload Image
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Auto-refresh indicator */}
          {pendingCount > 0 && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                {pendingCount} image{pendingCount > 1 ? 's' : ''} being analyzed... Auto-refreshing
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Welcome back, {user?.username}!
              </h3>
              <p className="text-zinc-400 mb-6">Let's analyze your crops.</p>
              <button
                onClick={() => navigate('/upload')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
              >
                Upload Image
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Your Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-zinc-400 text-sm">Total Uploads</p>
                  <p className="text-2xl font-bold text-white">{images.length}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Healthy Crops</p>
                  <p className="text-2xl font-bold text-green-400">
                    {images.filter(img => img.diseaseDetected?.toLowerCase() === 'healthy').length}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Diseases Detected</p>
                  <p className="text-2xl font-bold text-red-400">
                    {images.filter(img => 
                      img.diseaseDetected?.toLowerCase() !== 'healthy' && 
                      img.diseaseDetected?.toLowerCase() !== 'pending' &&
                      img.diseaseDetected?.toLowerCase() !== 'unknown'
                    ).length}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Processing</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Recent Uploads</h3>
            
            {images.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-zinc-400 text-lg">No uploads yet</p>
                <p className="text-zinc-500 text-sm mt-2">Upload your first crop image to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <ImageCard 
                    key={img._id} 
                    image={img} 
                    onClick={setSelectedImage}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advisory Modal */}
      {selectedImage && (
        <AdvisoryModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
