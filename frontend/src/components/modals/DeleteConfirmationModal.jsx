import { useEffect, useRef } from "react";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title }) {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Focus the confirm button when modal opens
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    // Prevent scrolling of background content when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Trap focus within the modal
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements?.length) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalRef.current.addEventListener("keydown", handleTabKey);
      return () =>
        modalRef.current?.removeEventListener("keydown", handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-11/12" ref={modalRef}>
        <h2 id="modal-title" className="text-2xl text-center font-bold mb-6">
          Do you really want to delete {title}?
        </h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            aria-label={`Cancel deletion of ${title}`}
          >
            No
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label={`Confirm deletion of ${title}`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;
