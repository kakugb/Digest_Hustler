import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddBlogs = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: null,
    tags: []
  });
console.log(formData)
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState(''); 

  // Rich text editor configurations
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      // Prevent empty tags and duplicates
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput(''); // Clear input after adding
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };
  

  const handlePublish = async () => {
    setErrors({});  // Clear previous errors
  
    let validationErrors = {};
  
    if (!formData.title.trim()) {
      validationErrors.title = 'Title is required';
    }
  
    if (!formData.content.trim()) {
      validationErrors.content = 'Content is required';
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const updatedFormData = {
      ...formData,
      publishedAt: new Date(),
    };
  
    console.log('Publishing:', updatedFormData);
  };
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Cover Image Upload */}
      <div className="mb-6">
        <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          {formData.coverImage ? (
            <img
              src={formData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <label className="cursor-pointer bg-white px-4 py-2 rounded-md shadow">
                Add Cover Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
        {errors.coverImage && (
          <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
        )}
      </div>

  
      <input
  type="text"
  name="title"
  placeholder="Title"
  value={formData.title}
  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
  className={`w-full text-4xl font-bold p-2 border-none outline-none ${errors.title ? 'border-red-500' : ''}`}
/>
{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}


<div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.length > 0 ? (
            formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm gap-2"
              >
                <span className="text-gray-700">{tag}</span>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index)
                    }));
                  }}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No tags added yet.</p>
          )}
        </div>

        <input
          type="text"
          placeholder="Add tags... (Press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          className="w-full p-2 border rounded-md"
        />
      </div>


      {/* Rich Text Editor */}
      <ReactQuill
        value={formData.content}
        onChange={(value) => {
          setFormData(prev => ({
            ...prev,
            content: value
          }));
        }}
        modules={modules}
        className={`h-[600px] mb-12 ${errors.content ? 'border-red-500' : ''}`}
      />
      {errors.content && (
        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
      )}

      {/* Debug Button */}
      <button
        type="button"
        onClick={() => {
          console.log('Current Form State:', formData);
        }}
        className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
      >
        Debug Form State
      </button>

      {/* Publish Button */}
      <button
        onClick={handlePublish}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
      >
        Publish
      </button>
    </div>
  );
};

export default AddBlogs;
