import { useState, useEffect } from "react";
import {
  Heart,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

import "./Pages.css";

const API_URL = import.meta.env.VITE_API_URL;

function ClientGallery() {
  // =====================================================
  // GALLERY ACCESS
  // =====================================================

  const [galleryAccess, setGalleryAccess] = useState(false);

  const [code, setCode] = useState("");

  const [error, setError] = useState("");

  const [loadingGallery, setLoadingGallery] = useState(false);

  // =====================================================
  // GALLERY DATA
  // =====================================================

  const [gallery, setGallery] = useState(null);

  const [photos, setPhotos] = useState([]);

  // =====================================================
  // GALLERY STATE
  // =====================================================

  const [favorites, setFavorites] = useState([]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [slideshow, setSlideshow] = useState(false);


  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (filePath) => {
    if (!filePath) {
      return "";
    }

    const cleanPath = filePath.replaceAll("\\", "/");

    return `${API_URL}/${cleanPath}`;
  };


  // =====================================================
  // GALLERY ACCESS
  // =====================================================

  const handleAccess = async (event) => {
    event.preventDefault();

    const enteredCode = code.trim();

    if (!enteredCode) {
      setError("Please enter your gallery code.");
      return;
    }

    setLoadingGallery(true);
    setError("");

    try {
      // -----------------------------------------------
      // Find gallery using gallery code
      // -----------------------------------------------

      const galleryResponse = await fetch(
        `${API_URL}/galleries/code/${encodeURIComponent(
          enteredCode
        )}`
      );

      const galleryData = await galleryResponse.json();

      if (!galleryResponse.ok) {
        throw new Error(
          galleryData.detail || "Gallery not found."
        );
      }


      // -----------------------------------------------
      // Get photos belonging to this gallery
      // -----------------------------------------------

      const photosResponse = await fetch(
        `${API_URL}/photos/gallery/${galleryData.id}`
      );

      const photosData = await photosResponse.json();

      if (!photosResponse.ok) {
        throw new Error(
          photosData.detail || "Unable to load gallery photos."
        );
      }


      // -----------------------------------------------
      // Convert backend photo data
      // -----------------------------------------------

      const formattedPhotos = photosData.map((photo) => ({
        id: photo.id,
        image: getImageUrl(photo.file_path),
        title: photo.filename,
        category: galleryData.event_type,
        filename: photo.filename,
      }));


      // -----------------------------------------------
      // Save gallery data
      // -----------------------------------------------

      setGallery(galleryData);

      setPhotos(formattedPhotos);

      setFavorites([]);

      setSelectedPhoto(null);

      setSlideshow(false);

      setGalleryAccess(true);

      setError("");
    } catch (err) {
      setGalleryAccess(false);

      setGallery(null);

      setPhotos([]);

      setError(
        err.message || "Unable to open gallery."
      );
    } finally {
      setLoadingGallery(false);
    }
  };


  // =====================================================
  // FAVORITES
  // =====================================================

  const toggleFavorite = (index) => {
    setFavorites((current) => {
      if (current.includes(index)) {
        return current.filter(
          (item) => item !== index
        );
      }

      return [...current, index];
    });
  };


  // =====================================================
  // OPEN PHOTO
  // =====================================================

  const openPhoto = (index) => {
    setSelectedPhoto(index);
  };


  // =====================================================
  // CLOSE PHOTO
  // =====================================================

  const closePhoto = () => {
    setSelectedPhoto(null);
    setSlideshow(false);
  };


  // =====================================================
  // PREVIOUS PHOTO
  // =====================================================

  const showPrevious = () => {
    setSelectedPhoto((current) => {
      if (current === null || photos.length === 0) {
        return null;
      }

      return current === 0
        ? photos.length - 1
        : current - 1;
    });
  };


  // =====================================================
  // NEXT PHOTO
  // =====================================================

  const showNext = () => {
    setSelectedPhoto((current) => {
      if (current === null || photos.length === 0) {
        return null;
      }

      return current === photos.length - 1
        ? 0
        : current + 1;
    });
  };


  // =====================================================
  // DOWNLOAD PHOTO
  // =====================================================

  const downloadPhoto = async (photo) => {
    try {
      const response = await fetch(photo.image);

      if (!response.ok) {
        throw new Error("Unable to download photo.");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      link.download = photo.filename || "photo.jpg";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError("Unable to download this photo.");
    }
  };


  // =====================================================
  // SLIDESHOW
  // =====================================================

  useEffect(() => {
    if (
      !slideshow ||
      selectedPhoto === null ||
      photos.length === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setSelectedPhoto((current) => {
        if (current === null) {
          return null;
        }

        return current === photos.length - 1
          ? 0
          : current + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [
    slideshow,
    selectedPhoto,
    photos.length,
  ]);


  // =====================================================
  // START / STOP SLIDESHOW
  // =====================================================

  const toggleSlideshow = () => {
    if (photos.length === 0) {
      return;
    }

    if (selectedPhoto === null) {
      setSelectedPhoto(0);

      setSlideshow(true);

      return;
    }

    setSlideshow((current) => !current);
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="page client-gallery-page">

      {/* =================================================
          ACCESS SCREEN
      ================================================= */}

      {!galleryAccess ? (

        <section className="gallery-access">

          <div className="gallery-access-content">

            <p className="section-label">
              PRIVATE CLIENT GALLERY
            </p>


            <h1>
              Your memories,
              <br />
              <span>
                beautifully preserved.
              </span>
            </h1>


            <p>
              Enter the private gallery code provided
              by Passionate Clicker to view your photos.
            </p>


            <form onSubmit={handleAccess}>

              <input
                type="text"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                placeholder="Enter Gallery Code"
                autoComplete="off"
              />


              <button
                type="submit"
                className="primary-btn"
                disabled={loadingGallery}
              >
                {loadingGallery
                  ? "Opening Gallery..."
                  : "Open Gallery →"}
              </button>

            </form>


            {error && (
              <p className="gallery-error">
                {error}
              </p>
            )}

          </div>

        </section>

      ) : (

        /* =================================================
           CLIENT GALLERY
        ================================================= */

        <>

          {/* =================================================
              GALLERY HEADER
          ================================================= */}

          <section className="client-gallery-header">

            <div>

              <p className="section-label">
                PRIVATE GALLERY
              </p>


              <h1>
                {gallery?.gallery_name || "Your Gallery"}
                <br />
                <span>
                  Collection.
                </span>
              </h1>


              <p>
                Captured with love by Passionate Clicker.
              </p>

            </div>


            {/* =================================================
                GALLERY ACTIONS
            ================================================= */}

            <div className="gallery-actions">

              <span>
                {favorites.length} Favorites
              </span>


              <button
                onClick={toggleSlideshow}
                disabled={photos.length === 0}
              >

                {slideshow ? (
                  <>
                    <Pause size={16} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Slideshow
                  </>
                )}

              </button>

            </div>

          </section>


          {/* =================================================
              PHOTO GRID
          ================================================= */}

          <section className="client-photo-grid">

            {photos.length === 0 ? (

              <div className="gallery-empty">

                <h2>
                  No Photos Yet
                </h2>

                <p>
                  Photos for this gallery have not
                  been uploaded yet.
                </p>

              </div>

            ) : (

              photos.map((photo, index) => (

                <div
                  className="client-photo"
                  key={photo.id}
                  onClick={() => openPhoto(index)}
                >

                  <img
                    src={photo.image}
                    alt={photo.title}
                  />


                  {/* FAVORITE BUTTON */}

                  <button
                    className={`favorite-btn ${
                      favorites.includes(index)
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();

                      toggleFavorite(index);
                    }}
                    aria-label="Favorite photo"
                  >

                    <Heart
                      size={20}
                      fill={
                        favorites.includes(index)
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>


                  {/* PHOTO INFO */}

                  <div className="client-photo-info">

                    <span>
                      {photo.category}
                    </span>

                    <h3>
                      {photo.title}
                    </h3>

                  </div>

                </div>

              ))

            )}

          </section>


          {/* =================================================
              FULL SCREEN VIEWER
          ================================================= */}

          {selectedPhoto !== null &&
            photos.length > 0 && (

            <div
              className="client-lightbox"
              onClick={closePhoto}
            >

              {/* CLOSE */}

              <button
                className="client-lightbox-close"
                onClick={closePhoto}
                aria-label="Close"
              >
                <X size={28} />
              </button>


              {/* PREVIOUS */}

              <button
                className="client-lightbox-prev"
                onClick={(event) => {
                  event.stopPropagation();

                  showPrevious();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={40} />
              </button>


              {/* IMAGE */}

              <div
                className="client-lightbox-content"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <img
                  src={
                    photos[selectedPhoto].image
                  }
                  alt={
                    photos[selectedPhoto].title
                  }
                />


                {/* PHOTO DETAILS */}

                <div className="client-lightbox-bottom">

                  <div>

                    <span>
                      {
                        photos[selectedPhoto]
                          .category
                      }
                    </span>

                    <h3>
                      {
                        photos[selectedPhoto]
                          .title
                      }
                    </h3>

                  </div>


                  {/* DOWNLOAD */}

                  <button
                    onClick={() =>
                      downloadPhoto(
                        photos[selectedPhoto]
                      )
                    }
                  >

                    <Download size={18} />

                    Download

                  </button>

                </div>

              </div>


              {/* NEXT */}

              <button
                className="client-lightbox-next"
                onClick={(event) => {
                  event.stopPropagation();

                  showNext();
                }}
                aria-label="Next photo"
              >
                <ChevronRight size={40} />
              </button>

            </div>

          )}

        </>

      )}

    </div>
  );
}

export default ClientGallery;