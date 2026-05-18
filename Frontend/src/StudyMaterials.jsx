import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext";

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

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8">

      {/* Heading */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3 tracking-wide">
          Study Materials 📚
        </h1>

        <p className="text-gray-400 text-lg">
          Upload, manage and access your study notes anytime.
        </p>

      </div>

      {/* Upload Section */}

      <div className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-3xl shadow-2xl p-8 mb-12">

        <h2 className="text-3xl font-semibold mb-6">
          Upload Notes
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
            className="p-4 rounded-2xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Enter Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-4 rounded-2xl bg-gray-900 border border-gray-600 outline-none focus:border-white"
            required
          />

          <textarea
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            className="md:col-span-2 p-4 rounded-2xl bg-gray-900 border border-gray-600 outline-none focus:border-white h-32 resize-none"
            required
          />

          <div className="md:col-span-2">

            <label className="block mb-3 text-lg font-medium">
              Upload PDF
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              className="w-full bg-gray-900 border border-gray-600 rounded-2xl p-3"
              required
            />

          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >
            Upload Material
          </button>

        </form>

      </div>

      {/* Materials */}

      <div>

        <h2 className="text-3xl font-bold mb-8">
          Uploaded Materials
        </h2>

        {materials.length === 0 ? (

          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-10 text-center text-gray-400 text-xl">
            No Materials Uploaded Yet
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {materials.map((item) => (

              <div
                key={item._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-7 shadow-2xl hover:-translate-y-2 hover:shadow-black/50 transition-all duration-500"
              >

                <div className="flex justify-between items-start mb-5">

                  <div>

                    <h3 className="text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-blue-400 mt-1">
                      {item.subject}
                    </p>

                  </div>

                  <div className="text-4xl">
                    📄
                  </div>

                </div>

                <p className="text-gray-400 leading-relaxed mb-8">
                  {item.description}
                </p>

                <div className="flex gap-4">

                  <a
                    href={`http://localhost:5000/${item.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-center py-3 rounded-2xl font-semibold transition-all"
                  >
                    Open PDF
                  </a>

                  <button
                    onClick={() => deleteMaterial(item._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-semibold transition-all"
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

  );
}

export default StudyMaterials;