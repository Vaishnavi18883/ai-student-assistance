import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";
import { Link } from "react-router-dom";

function StudyMaterials() {

  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
  });

  const [pdf, setPdf] = useState(null);

  const [materials, setMaterials] = useState([]);

  // Fetch Materials

  const fetchMaterials = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/materials/${user.studentId}`
      );

      setMaterials(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchMaterials();

  }, []);

  // Handle Input

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Upload Material

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("description", formData.description);
      data.append("studentId", user.studentId);
      data.append("pdf", pdf);

      await axios.post(
        "http://localhost:5000/api/materials/add",
        data
      );

      alert("Material Uploaded Successfully");

      setFormData({
        title: "",
        subject: "",
        description: "",
      });

      setPdf(null);

      fetchMaterials();

    } catch (error) {

      console.log(error);

      alert("Upload Failed");

    }

  };

  // Delete Material

  const deleteMaterial = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/materials/${id}`
      );

      fetchMaterials();

    } catch (error) {

      console.log(error);

    }

  };

  const inputClasses = "w-full p-4 rounded-xl bg-sky-100 border border-sky-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all text-slate-800";

  return (

    <div className="min-h-screen bg-app-gradient text-slate-800 font-sans pb-16">

      {/* Topbar */}
      <nav className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="text-slate-400 hover:text-sky-600 text-xl leading-none transition-colors">←</Link>
          <span className="font-semibold text-base text-slate-800">📚 Study Materials</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {/* Heading */}

        <div className="mb-10 text-center">

          <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-slate-800">
            Study Materials
          </h1>

          <p className="text-slate-500 text-lg">
            Upload, manage and access your study notes anytime.
          </p>

        </div>

        {/* Upload Section */}

        <div className="bg-white border border-sky-100 rounded-2xl shadow-lg shadow-sky-100/50 p-6 sm:p-8 mb-12 max-w-4xl mx-auto">

          <h2 className="text-xl font-bold mb-6 text-slate-800 border-b border-sky-50 pb-4">
            Upload New Notes
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6"
          >

            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Enter Subject"
              value={formData.subject}
              onChange={handleChange}
              className={inputClasses}
              required
            />

            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputClasses} md:col-span-2 h-32 resize-none`}
              required
            />

            <div className="md:col-span-2">

              <label className="block mb-2 text-sm font-semibold text-slate-600">
                Upload PDF
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                className="w-full bg-sky-100 border border-sky-200 text-slate-600 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-200 file:text-sky-700 hover:file:bg-sky-300 transition-all cursor-pointer"
                required
              />

            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-sky-600 text-white py-4 rounded-xl font-bold text-base hover:bg-sky-700 active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Upload Material
            </button>

          </form>

        </div>

        {/* Materials */}

        <div>

          <h2 className="text-2xl font-bold mb-6 text-slate-800">
            Your Uploaded Materials
          </h2>

          {materials.length === 0 ? (

            <div className="bg-white border border-sky-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm text-lg">
              No Materials Uploaded Yet
            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {materials.map((item) => (

                <div
                  key={item._id}
                  className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 flex flex-col"
                >

                  <div className="flex justify-between items-start mb-4">

                    <div>

                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                        {item.title}
                      </h3>

                      <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-2 py-1 rounded-md mt-1.5">
                        {item.subject}
                      </span>

                    </div>

                    <div className="text-3xl bg-sky-50 p-2 rounded-xl text-sky-500">
                      📄
                    </div>

                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex gap-3 mt-auto">

                    <a
                      href={`http://localhost:5000/${item.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-center py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                      Open PDF
                    </a>

                    <button
                      onClick={() => deleteMaterial(item._id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </div>

    </div>

  );
}

export default StudyMaterials;