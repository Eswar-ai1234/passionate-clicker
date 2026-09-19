import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./Pages.css";

function Portfolio() {
  const photos = [
    {
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
      category: "Weddings",
      title: "Forever Begins",
    },

    {
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",
      category: "Pre-Wedding",
      title: "Two Souls",
    },

    {
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
      category: "Portraits",
      title: "In Focus",
    },

    {
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85",
      category: "Weddings",
      title: "The Celebration",
    },

    {
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85",
      category: "Weddings",
      title: "Together",
    },

    {
      image:
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85",
      category: "Events",
      title: "Beautiful Moments",
    },

    {
      image:
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1400&q=85",
      category: "Portraits",
      title: "The Portrait",
    },

    {
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85",
      category: "Events",
      title: "Celebration",
    },
  ];

  const categories = [
    "All",
    "Weddings",
    "Pre-Wedding",
    "Portraits",
    "Events",
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter(
          (photo) => photo.category === activeCategory
        );

  const openPhoto = (photo) => {
    const index = photos.indexOf(photo);

    setSelectedPhoto({
      photo,
      index,
    });
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const showPrevious = () => {
    if (!selectedPhoto) return;

    const previousIndex =
      selectedPhoto.index === 0
        ? photos.length - 1
        : selectedPhoto.index - 1;

    setSelectedPhoto({
      photo: photos[previousIndex],
      index: previousIndex,
    });
  };

  const showNext = () => {
    if (!selectedPhoto) return;

    const nextIndex =
      selectedPhoto.index === photos.length - 1
        ? 0
        : selectedPhoto.index + 1;

    setSelectedPhoto({
      photo: photos[nextIndex],
      index: nextIndex,
    });
  };

  return (
    <div className="page">

      {/* ================================
          PAGE HERO
      ================================= */}

      <section className="page-hero">

        <p>OUR WORK</p>

        <h1>
          Stories
          <br />
          <span>in Frames.</span>
        </h1>

        <p className="page-description">
          A collection of moments, emotions and celebrations
          captured by Passionate Clicker.
        </p>

      </section>


      {/* ================================
          PORTFOLIO
      ================================= */}

      <section className="portfolio-page">

        {/* FILTER BUTTONS */}

        <div className="portfolio-filters">

          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>


        {/* GALLERY */}

        <div className="portfolio-grid">

          {filteredPhotos.map((photo) => (
            <div
              className="portfolio-photo"
              key={photo.title}
              onClick={() => openPhoto(photo)}
            >

              <img
                src={photo.image}
                alt={photo.title}
              />

              <div className="portfolio-overlay">

                <small>
                  {photo.category}
                </small>

                <h3>
                  {photo.title}
                </h3>

                <span className="view-photo">
                  View Photo →
                </span>

              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================================
          FULL SCREEN PHOTO VIEWER
      ================================= */}

      {selectedPhoto && (
        <div
          className="lightbox"
          onClick={closePhoto}
        >

          {/* CLOSE */}

          <button
            className="lightbox-close"
            onClick={closePhoto}
            aria-label="Close"
          >
            <X size={28} />
          </button>


          {/* PREVIOUS */}

          <button
            className="lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={36} />
          </button>


          {/* IMAGE */}

          <div
            className="lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={selectedPhoto.photo.image}
              alt={selectedPhoto.photo.title}
            />

            <div className="lightbox-info">

              <span>
                {selectedPhoto.photo.category}
              </span>

              <h3>
                {selectedPhoto.photo.title}
              </h3>

              <p>
                {selectedPhoto.index + 1} /{" "}
                {photos.length}
              </p>

            </div>

          </div>


          {/* NEXT */}

          <button
            className="lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            <ChevronRight size={36} />
          </button>

        </div>
      )}

    </div>
  );
}

export default Portfolio;