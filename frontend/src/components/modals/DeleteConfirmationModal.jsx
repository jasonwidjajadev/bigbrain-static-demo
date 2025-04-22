function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-11/12">
        <h2 className="text-2xl text-center font-bold mb-6">
          Do you really want to delete {title}?
        </h2>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-cyan-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out hover:bg-red-400"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
