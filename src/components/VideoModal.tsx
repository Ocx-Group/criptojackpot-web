'use client';
import React, { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  videoId: string;
};

const VideoModal = ({ isOpen, setOpen, videoId }: Props) => {
  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = () => setOpen(false);
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleBackdropClick}
      onKeyDown={e => e.key === 'Enter' && handleBackdropClick()}
      role="button"
      tabIndex={0}
      aria-label="Close video modal"
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={handleContentClick} role="document">
        <div className="modal-content bg-transparent border-0">
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <div className="modal-body p-0 position-relative">
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={() => setOpen(false)}
              style={{ zIndex: 1050 }}
              aria-label="Close"
            ></button>
            <div className="ratio ratio-16x9">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
