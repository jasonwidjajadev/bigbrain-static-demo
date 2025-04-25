import Button from '@/components/button/Button';

/**
* Modal displayed when a quiz session ends early
* 
* @param {Object} props - Component props
* @param {boolean} props.isOpen - Controls modal visibility
* @param {Function} props.onClose - Handler for closing the modal
* @param {string} props.sessionId - ID of the quiz session for viewing results
* @returns {JSX.Element|null} A modal with options to close or view results, or null when closed
*/
function QuizEndedModal({ isOpen, onClose, sessionId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md px-6 py-8 text-center">
        <h3 className="text-2xl font-bold mb-2">The Quiz has ended early!</h3>
        <p className="mb-10">Would you like to view the results?</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onClose}
            aria-label="Close modal" className='w-[140px] sm:w-[163px] flex justify-center items-center'
            color='gray500'>
            Close
          </Button>
          <Button
            to={`/host/${sessionId}`}
            aria-label="View Results"
            color='green'>
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizEndedModal;
