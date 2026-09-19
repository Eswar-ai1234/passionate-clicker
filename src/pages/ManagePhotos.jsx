import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Pages.css";

const API_URL = "http://127.0.0.1:8000";

function ManagePhotos() {
  const { galleryId } = useParams();

  const fileInputRef = useRef(null);

  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // ADMIN AUTH HEADER
  // =====================================================

  const getAdminHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  // =====================================================
  // LOAD GALLERY
  // =====================================================

  const loadGallery = async () => {
    try {
      const response = await fetch(
        `${API_URL}/galleries/${galleryId}`,
        {
          headers: getAdminHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load gallery."
        );
      }

      setGallery(data);
    } catch (err) {
      setError(err.message || "Failed to load gallery.");
    }
  };

  // =====================================================
  // LOAD PHOTOS
  // =====================================================

  const loadPhotos = async () => {
    try {
      const response = await fetch(
        `${API_URL}/photos/gallery/${galleryId}`,
        {
          headers: getAdminHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load photos."
        );
      }

      setPhotos(data);
    } catch (err) {
      setError(err.message || "Failed to load photos.");
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        loadGallery(),
        loadPhotos(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [galleryId]);

  // =====================================================
  // SELECT FILES
  // =====================================================

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    setSelectedFiles(files);
    setMessage("");
    setError("");
  };

  // =====================================================
  // UPLOAD PHOTOS
  // =====================================================

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one photo.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    let uploadedCount = 0;
    let failedCount = 0;

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();

        formData.append("file", file);

        const response = await fetch(
          `${API_URL}/photos/upload/${galleryId}`,
          {
            method: "POST",
            headers: getAdminHeaders(),
            body: formData,
          }
        );

        if (response.ok) {
          uploadedCount++;
        } else {
          failedCount++;
        }
      }

      if (uploadedCount > 0) {
        setMessage(
          `${uploadedCount} photo${
            uploadedCount > 1 ? "s" : ""
          } uploaded successfully.`
        );
      }

      if (failedCount > 0) {
        setError(
          `${failedCount} photo${
            failedCount > 1 ? "s" : ""
          } could not be uploaded.`
        );
      }

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadPhotos();
    } catch (err) {
      setError(
        err.message || "Photo upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE PHOTO
  // =====================================================

  const handleDelete = async (photoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/photos/${photoId}`,
        {
          method: "DELETE",
          headers: getAdminHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete photo."
        );
      }

      setMessage("Photo deleted successfully.");

      await loadPhotos();
    } catch (err) {
      setError(
        err.message || "Failed to delete photo."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page">
        <section className="admin-header">
          <div>
            <p className="section-label">
              GALLERY MANAGEMENT
            </p>

            <h1>
              Loading
              <br />
              <span>Gallery...</span>
            </h1>
          </div>
        </section>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="page manage-photos-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="admin-header">

        <div>

          <p className="section-label">
            GALLERY MANAGEMENT
          </p>

          <h1>
            Manage
            <br />
            <span>Photos.</span>
          </h1>

          {gallery && (
            <p>
              {gallery.gallery_name}
            </p>
          )}

        </div>

        <Link
          to="/admin/galleries"
          className="secondary-btn"
        >
          ← Back to Galleries
        </Link>

      </section>


      {/* =================================================
          GALLERY INFORMATION
      ================================================= */}

      {gallery && (

        <section className="manage-gallery-info">

          <div className="manage-gallery-info-card">

            <p className="section-label">
              CLIENT
            </p>

            <h3>
              {gallery.client_name}
            </h3>

          </div>


          <div className="manage-gallery-info-card">

            <p className="section-label">
              EVENT
            </p>

            <h3>
              {gallery.event_type}
            </h3>

          </div>


          <div className="manage-gallery-info-card">

            <p className="section-label">
              DATE
            </p>

            <h3>
              {gallery.event_date}
            </h3>

          </div>


          <div className="manage-gallery-info-card">

            <p className="section-label">
              GALLERY CODE
            </p>

            <h3>
              {gallery.gallery_code}
            </h3>

          </div>

        </section>

      )}


      {/* =================================================
          UPLOAD SECTION
      ================================================= */}

      <section className="admin-gallery-create">

        <div className="admin-panel">

          <div className="admin-panel-heading">

            <div>

              <p className="section-label">
                ADD PHOTOS
              </p>

              <h2>
                Upload Photos
              </h2>

            </div>

          </div>


          <div className="photo-upload-box">

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />


            {selectedFiles.length > 0 && (

              <div className="selected-files">

                <p>
                  {selectedFiles.length} photo
                  {selectedFiles.length > 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <ul>

                  {selectedFiles.map((file) => (

                    <li
                      key={`${file.name}-${file.size}`}
                    >
                      {file.name}
                    </li>

                  ))}

                </ul>

              </div>

            )}


            <button
              type="button"
              className="primary-btn"
              onClick={handleUpload}
              disabled={
                uploading ||
                selectedFiles.length === 0
              }
            >
              {uploading
                ? "Uploading..."
                : "Upload Photos →"}
            </button>

          </div>


          {message && (
            <p className="admin-success-message">
              {message}
            </p>
          )}


          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

        </div>

      </section>


      {/* =================================================
          PHOTO LIST
      ================================================= */}

      <section className="admin-gallery-section">

        <div className="admin-gallery-heading">

          <div>

            <p className="section-label">
              GALLERY PHOTOS
            </p>

            <h2>
              Uploaded Photos
            </h2>

          </div>

          <span>
            {photos.length} Photos
          </span>

        </div>


        {photos.length === 0 ? (

          <div className="admin-empty-state">

            <p>
              No photos uploaded yet.
            </p>

            <span>
              Select photos above to add them
              to this gallery.
            </span>

          </div>

        ) : (

          <div className="manage-photos-grid">

            {photos.map((photo) => (

              <div
                className="manage-photo-card"
                key={photo.id}
              >

                <div className="manage-photo-preview">

                  <img
                    src={`${API_URL}/${photo.file_path.replaceAll("\\", "/")}`}
                    alt={photo.filename}
                  />

                </div>


                <div className="manage-photo-details">

                  <p title={photo.filename}>
                    {photo.filename}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(photo.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default ManagePhotos;