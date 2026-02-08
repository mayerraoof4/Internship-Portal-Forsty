import PortalLayout from "@/components/layouts/portal/PortalLayout";
import Divider from "@/components/core-ui/Divider";
import { useState } from "react";
import { CheckCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import PostedInternshipsService, { type PostedInternship } from "@/services/posted-internships.service";

const PostInternshipPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postedInternships, setPostedInternships] = useState<PostedInternship[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const service = new PostedInternshipsService();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.salary.trim()) newErrors.salary = "Salary range is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const posted = service.addPostedInternship({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      description: formData.description,
      salary: formData.salary,
      tags: tagsArray,
      status: "active",
    });

    setPostedInternships([posted, ...postedInternships]);
    setFormData({
      title: "",
      company: "",
      location: "",
      description: "",
      salary: "",
      tags: "",
    });
    setSubmitSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this internship posting?")) {
      service.deletePostedInternship(id);
      setPostedInternships(postedInternships.filter((i) => i.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PortalLayout title="Post an Internship Opportunity">
      <div className="mx-auto max-w-4xl">
        {submitSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200 flex items-center gap-x-3">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              ✅ Internship posted successfully! It's now visible to all seekers.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Post New Internship
              </h2>
              <Divider />

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Internship Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.title ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="e.g., Frontend Developer Intern"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ${
                        errors.company ? "ring-red-500" : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      placeholder="e.g., Google"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ${
                        errors.location ? "ring-red-500" : "ring-gray-300"
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      placeholder="e.g., Mountain View, CA"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.salary ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="e.g., $15k - $20k/month"
                  />
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                    <span className="text-xs text-gray-500 ml-1">
                      (minimum 50 characters)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ${
                      errors.description ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="Describe the internship opportunity, responsibilities, and requirements..."
                  />
                  <div className="mt-1 flex justify-between items-start">
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.description.length} / 50+ characters
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tags
                    <span className="text-xs text-gray-500 ml-1">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="e.g., Remote, Full-time, 3+ years"
                  />
                  {formData.tags && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/10"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Post Internship
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: "",
                        company: "",
                        location: "",
                        description: "",
                        salary: "",
                        tags: "",
                      });
                      setErrors({});
                    }}
                    className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Stats</h3>
              <Divider />

              <div className="mt-4 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">
                    {postedInternships.length}
                  </p>
                  <p className="text-sm text-gray-600">Active Internships</p>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-3xl font-bold text-green-600">
                    {postedInternships.reduce((sum, i) => sum + (i.applicants || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posted Internships List */}
        {postedInternships.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Your Posted Internships
            </h3>

            <div className="space-y-4">
              {postedInternships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {internship.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {internship.company} • {internship.location}
                      </p>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        {internship.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-6 mt-4 text-sm">
                        <div>
                          <p className="text-gray-500">Salary</p>
                          <p className="font-semibold text-gray-900">
                            {internship.salary}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                            {internship.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-500">Posted</p>
                          <p className="text-gray-700">{formatDate(internship.postedDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Applications</p>
                          <p className="font-semibold text-gray-900">
                            {internship.applicants || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(internship.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete internship"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PostInternshipPage;
