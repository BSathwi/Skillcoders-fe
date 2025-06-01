import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const domains = [
  "Artificial Intelligence", "Web Development", "Cloud Computing",
  "DevOps", "UI/UX Design", "Game Development", "Mobile App Development",
  "Internet of Things (IoT)", "Embedded Systems", "Networking",
  "Big Data", "Software Testing", "Business Intelligence",
  "Automation", "Database Management", "Full Stack Development",
];

export default function AddCourse() {
  const [form, setForm] = useState({
    courseName: '',
    description: '',
    category: '',
    price: '',
    instructorName: '',
    courseImage: null,
    curriculumPdf: null
  });

  const [courseImageName, setCourseImageName] = useState('');
  const [curriculumPdfName, setCurriculumPdfName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = Cookies.get('access_token');
    if (!accessToken) {
      toast.error("Unauthorized: No access token found");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", form.courseName);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("instructor_name", form.instructorName);
    if (form.courseImage) formData.append("course_image", form.courseImage);
    if (form.curriculumPdf) formData.append("curriculum_pdf", form.curriculumPdf);

    try {
      const response = await fetch("http://localhost:5000/admin/add-course", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success("Course added successfully!");
        setForm({
          courseName: '',
          description: '',
          category: '',
          price: '',
          instructorName: '',
          courseImage: null,
          curriculumPdf: null
        });
        setCourseImageName('');
        setCurriculumPdfName('');
      } else {
        toast.error("Failed to add course");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Add New Course</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
              <input
                type="text"
                value={form.courseName}
                onChange={(e) => setForm({...form, courseName: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              >
                <option value="">Select Category</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Instructor Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({...form, price: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
              <input
                type="text"
                value={form.instructorName}
                onChange={(e) => setForm({...form, instructorName: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          {/* Course Image and Curriculum PDF Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    setForm({...form, courseImage: e.target.files[0]});
                    setCourseImageName(e.target.files[0].name);
                  }} 
                  className="hidden" 
                  id="courseImage" 
                />
                <label htmlFor="courseImage" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  {courseImageName && <p className="mt-2 text-sm text-gray-700">{courseImageName}</p>}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum PDF</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => {
                    setForm({...form, curriculumPdf: e.target.files[0]});
                    setCurriculumPdfName(e.target.files[0].name);
                  }} 
                  className="hidden" 
                  id="curriculumPdf" 
                />
                <label htmlFor="curriculumPdf" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  {curriculumPdfName && <p className="mt-2 text-sm text-gray-700">{curriculumPdfName}</p>}
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <>
      <Loader className="h-6 w-6 animate-spin text-indigo-600 mr-2" /> Submitting...
    </>  : "Add Course"}
          </button>
        </form>
      </div>
    </div>
  );
}