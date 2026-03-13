import { useEffect, useState } from "react";
import { getImages, deleteImage } from "../api/image.api";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import AdvisoryModal from "../components/AdvisoryModal";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d140d] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const pendingCount = images.filter(img => img.diseaseDetected?.toLowerCase() === 'pending').length;

  return (
    <div className="min-h-screen bg-[#0d140d]">

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
            <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                {pendingCount} image{pendingCount > 1 ? 's' : ''} being analyzed... Auto-refreshing
              </p>
            </div>
          )}

          {/* Empty State - Show only when no uploads */}
          {images.length === 0 ? (
            <div className="max-w-2xl mx-auto mt-20">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">🌱</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Welcome, {user?.username}!
                </h3>
                <p className="text-zinc-400 text-lg mb-6">
                  No uploads yet. Let's analyze your first crop!
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition-all text-lg"
                >
                  Upload Your First Image
                </button>
              </div>
            </div>
          ) : (
            /* Image Grid - Show when there are uploads */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Your Uploads ({images.length})
                </h3>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-all"
                >
                  + Upload New
                </button>
              </div>

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
            </div>
          )}
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