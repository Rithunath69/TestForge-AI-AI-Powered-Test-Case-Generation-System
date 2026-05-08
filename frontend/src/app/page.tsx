"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    input: "",
    modules: "",
    purpose: "",
    uielements: "",
    Api: "",
    type: "",
    coverage: "",
  });

  // -----------------------------
  // INPUT CHANGE HANDLER
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // SUBMIT HANDLER (IMPORTANT FIX)
  // -----------------------------
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault(); // 🔥 STOPS GET /? COMPLETELY

    console.log("SUBMIT FIRED");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/generate",
        formData,
        {
          responseType: "blob",
          timeout: 120000,
        }
      );

      // -----------------------------
      // DOWNLOAD FILE
      // -----------------------------
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "testcases.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error:", error);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold mb-2">
          TestForge AI
        </h1>

        <p className="text-gray-600 mb-8">
          AI Powered Test Case Generator
        </p>

        {/* 🔥 IMPORTANT: REAL FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <textarea
            name="input"
            value={formData.input}
            onChange={handleChange}
            placeholder="Requirement Document"
            rows={6}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="modules"
            value={formData.modules}
            onChange={handleChange}
            placeholder="Modules"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Purpose"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="uielements"
            value={formData.uielements}
            onChange={handleChange}
            placeholder="UI Elements"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="Api"
            value={formData.Api}
            onChange={handleChange}
            placeholder="API Endpoints"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Environment"
            className="w-full border p-3 rounded-lg"
          />

          <input
            name="coverage"
            value={formData.coverage}
            onChange={handleChange}
            placeholder="Coverage"
            className="w-full border p-3 rounded-lg"
          />

          {/* 🔥 IMPORTANT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Generating..." : "Generate CSV"}
          </button>

        </form>

      </div>

    </main>
  );
}