import React, { useState } from "react";
import { SectionHead } from "./Primitives";
import { useReveal } from "../hooks/useReveal";
import { X, ChevronLeft, ChevronRight, MapPin, ImageOff } from "lucide-react";
import galleryData from "../data/gallery.json";

const LOCATIONS = Object.entries(galleryData);

function PhotoCard({ photo, locationLabel, onClick, index }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      className={`gallery-thumb${loaded ? " gallery-thumb--loaded" : ""}`}
      onClick={() => onClick(index)}
      aria-label={`View photo: ${photo.caption}`}
      type="button"
    >
      {!error ? (
        <>
          {!loaded && <div className="gallery-thumb-skeleton" aria-hidden="true" />}
          <img
            src={photo.src}
            alt={photo.caption}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
            style={{ display: loaded ? "block" : "none" }}
          />
        </>
      ) : (
        <div className="gallery-thumb-error" aria-label="Image not found">
          <ImageOff size={22} />
          <span>Drop photo here</span>
          <code className="gallery-thumb-path">{photo.src}</code>
        </div>
      )}
      <div className="gallery-thumb-overlay" aria-hidden="true">
        <span className="gallery-thumb-caption">{photo.caption}</span>
      </div>
    </button>
  );
}

function Lightbox({ photos, activeIndex, onClose, onPrev, onNext }) {
  if (activeIndex === null) return null;
  const photo = photos[activeIndex];

  const handleKey = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
      onClick={onClose}
      onKeyDown={handleKey}
      tabIndex={0}
    >
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X size={20} />
        </button>
        <button
          className="lightbox-nav lightbox-prev"
          onClick={onPrev}
          aria-label="Previous photo"
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        <img src={photo.src} alt={photo.caption} className="lightbox-img" />
        <button
          className="lightbox-nav lightbox-next"
          onClick={onNext}
          aria-label="Next photo"
          disabled={activeIndex === photos.length - 1}
        >
          <ChevronRight size={24} />
        </button>
        <div className="lightbox-footer">
          <p className="lightbox-caption">{photo.caption}</p>
          <span className="lightbox-counter mono">{activeIndex + 1} / {photos.length}</span>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [activeLocation, setActiveLocation] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [ref, visible] = useReveal();

  const [locKey, locData] = LOCATIONS[activeLocation];
  const photos = locData.photos;

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () => setLightboxIndex((i) => Math.max(0, i - 1));
  const nextPhoto = () => setLightboxIndex((i) => Math.min(photos.length - 1, i + 1));

  return (
    <section id="gallery" className="shell">
      <SectionHead
        index="07"
        title="Gallery"
        sub="Moments from research internships and academic visits."
      />

      {/* Location tabs */}
      <div className="gallery-tabs" role="tablist" aria-label="Gallery locations">
        {LOCATIONS.map(([key, data], i) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeLocation === i}
            aria-controls={`gallery-panel-${key}`}
            className={`gallery-tab${activeLocation === i ? " gallery-tab--active" : ""}`}
            onClick={() => { setActiveLocation(i); setLightboxIndex(null); }}
            type="button"
          >
            <MapPin size={13} aria-hidden="true" />
            {data.label}
            <span className="gallery-tab-count mono">{data.photos.length}</span>
          </button>
        ))}
      </div>

      {/* Location info strip */}
      <div className="gallery-location-info">
        <span className="gallery-location-subtitle mono">{locData.subtitle}</span>
        <span className="gallery-location-desc">{locData.description}</span>
      </div>

      {/* Photo grid */}
      <div
        ref={ref}
        id={`gallery-panel-${locKey}`}
        role="tabpanel"
        aria-label={`${locData.label} photos`}
        className={`gallery-grid reveal${visible ? " revealed" : ""}`}
      >
        {photos.map((photo, i) => (
          <PhotoCard
            key={photo.src}
            photo={photo}
            locationLabel={locData.label}
            onClick={openLightbox}
            index={i}
          />
        ))}
      </div>

      <p className="gallery-hint mono">// click any photo to view full size</p>

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />
    </section>
  );
}
