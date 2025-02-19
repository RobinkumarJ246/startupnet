'use client';

const CreateEventModal = ({ isOpen, onClose, onSubmit }) => (
  <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
    <div className="fixed inset-0 bg-black/20" onClick={onClose} />
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Create Event</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            title: e.target.title.value,
            date: e.target.date.value,
            location: e.target.location.value,
            type: e.target.type.value,
          });
        }}>
          <input
            name="title"
            type="text"
            placeholder="Event Title"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="date"
            type="date"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="location"
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="type"
            type="text"
            placeholder="Event Type"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default CreateEventModal;