// app/host-event/components/MusicFestForm.js
export function MusicFestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: '',
    startDate: '',
    endDate: '',
    venue: '',
    performersList: '',
    genres: [],
    isInterCollege: false,
    maxAttendees: '',
    noAttendeeLimit: false,
    isFree: true,
    ticketPrice: '',
    registrationQuestions: [{ question: '', type: 'text', required: true }]
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleGenreChange = (genre) => {
    let updatedGenres;
    if (formData.genres.includes(genre)) {
      updatedGenres = formData.genres.filter(g => g !== genre);
    } else {
      updatedGenres = [...formData.genres, genre];
    }
    setFormData({ ...formData, genres: updatedGenres });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.registrationQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, registrationQuestions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      registrationQuestions: [
        ...formData.registrationQuestions,
        { question: '', type: 'text', required: true }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.registrationQuestions.filter((_, i) => i !== index);
    setFormData({ ...formData, registrationQuestions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, eventType: 'music' });
  };

  const musicGenres = [
    'Rock', 'Pop', 'Hip Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Folk', 'Country', 'Metal', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Music Festival Details</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Festival Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date*</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date*</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue*</label>
          <input
            type="text"
            id="venue"
            name="venue"
            required
            value={formData.venue}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="performersList" className="block text-sm font-medium text-gray-700">Performers/Artists (one per line)</label>
          <textarea
            id="performersList"
            name="performersList"
            value={formData.performersList}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="List your performers here, one per line"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Music Genres</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {musicGenres.map((genre) => (
              <div key={genre} className="flex items-center">
                <input
                  type="checkbox"
                  id={`genre-${genre}`}
                  checked={formData.genres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`genre-${genre}`} className="ml-2 block text-sm text-gray-700">
                  {genre}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isInterCollege"
            name="isInterCollege"
            checked={formData.isInterCollege}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isInterCollege" className="ml-2 block text-sm text-gray-700">
            Inter-college event
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="noAttendeeLimit"
            name="noAttendeeLimit"
            checked={formData.noAttendeeLimit}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="noAttendeeLimit" className="ml-2 block text-sm text-gray-700">
            No attendee limit
          </label>
        </div>

        {!formData.noAttendeeLimit && (
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">
              Maximum Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="1"
              value={formData.maxAttendees}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            checked={formData.isFree}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">Free event</label>
        </div>

        {!formData.isFree && (
          <div>
            <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700">Ticket Price</label>
            <input
              type="text"
              id="ticketPrice"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. $25 per person"
            />
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Registration Questions</h3>
          <p className="text-sm text-gray-500 mb-4">Add questions that attendees need to answer when registering</p>
          
          {formData.registrationQuestions.map((q, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium">Question {index + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={formData.registrationQuestions.length === 1}
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor={`question-${index}`} className="block text-sm font-medium text-gray-700">Question</label>
                  <input
                    type="text"
                    id={`question-${index}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor={`question-type-${index}`} className="block text-sm font-medium text-gray-700">Answer Type</label>
                  <select
                    id={`question-type-${index}`}
                    value={q.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="url">URL</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`question-required-${index}`}
                    checked={q.required}
                    onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`question-required-${index}`} className="ml-2 block text-sm text-gray-700">Required</label>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Question
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Music Festival
        </button>
      </div>
    </form>
  );
}