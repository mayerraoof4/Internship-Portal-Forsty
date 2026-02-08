import {
  BookmarkIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "@/components/core-ui/Divider";
import Dialog from "@/components/core-ui/Dialog";
import PortalLayout from "@/components/layouts/portal/PortalLayout";
import InternshipsService from "@/services/internships.service";
import PostedInternshipsService from "@/services/posted-internships.service";
import { useAuth } from "@/providers";

const mockInternships = [
  {
    id: 1,
    title: "UX/UI Designer",
    company: "Google",
    location: "Mountain View, California",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Facebook",
    location: "Menlo Park, California",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Amazon",
    location: "Seattle, Washington",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Microsoft",
    location: "Redmond, Washington",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 5,
    title: "UX/UI Designer",
    company: "Google",
    location: "Mountain View, California",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 6,
    title: "Software Engineer",
    company: "Facebook",
    location: "Menlo Park, California",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 7,
    title: "Product Manager",
    company: "Amazon",
    location: "Seattle, Washington",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 8,
    title: "Data Scientist",
    company: "Microsoft",
    location: "Redmond, Washington",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
  {
    id: 9,
    title: "UX/UI Designer",
    company: "Google",
    location: "Mountain View, California",
    tags: ["Remote", "Full-time", "5+ years"],
    salary: "$100k - $120k/yr",
    time: "5min ago",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [internships, setInternships] = useState(mockInternships);
  const [filteredInternships, setFilteredInternships] = useState(mockInternships);
  const [postedInternships, setPostedInternships] = useState<any[]>([]);
  const [savedInternships, setSavedInternships] = useState<number[]>(() => {
    const saved = localStorage.getItem("savedInternships");
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedInternships, setAppliedInternships] = useState<number[]>(() => {
    const applied = localStorage.getItem("appliedInternships");
    return applied ? JSON.parse(applied) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Filter states
  const [sortBy, setSortBy] = useState("most-recent");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  
  const internshipsService = new InternshipsService();
  const postedInternshipsService = new PostedInternshipsService();

  useEffect(() => {
    fetchInternships();
    loadPostedInternships();
    const handleUpdate = () => loadPostedInternships();
    window.addEventListener("postedInternshipsUpdated", handleUpdate);
    return () => window.removeEventListener("postedInternshipsUpdated", handleUpdate);
  }, []);

  const loadPostedInternships = () => {
    const posted = postedInternshipsService.getPostedInternships();
    const transformed = posted.map((p: any) => ({
      id: p.id,
      title: p.title,
      company: p.company,
      location: p.location,
      tags: p.tags,
      salary: p.salary,
      time: new Date(p.postedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      description: p.description,
      isPosted: true,
    }));
    setPostedInternships(transformed);
    
    // Merge with mock internships
    const allInternships = [...mockInternships, ...transformed];
    setInternships(allInternships);
    setFilteredInternships(allInternships);
  };

  // Sync saved internships to localStorage
  useEffect(() => {
    localStorage.setItem("savedInternships", JSON.stringify(savedInternships));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("savedInternshipsUpdated"));
  }, [savedInternships]);

  // Sync applied internships to localStorage
  useEffect(() => {
    localStorage.setItem("appliedInternships", JSON.stringify(appliedInternships));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("appliedInternshipsUpdated"));
  }, [appliedInternships]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await internshipsService.getInternships();
      if (response && response.data) {
        setInternships(response.data);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      // Use mock data on error
      setInternships(mockInternships);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Get all internships (mock + posted)
    const allInternships = [...mockInternships, ...postedInternships];
    
    // Filter internships based on search query
    const filtered = allInternships.filter((internship) =>
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const toShow = filtered.length > 0 ? filtered : allInternships;
    setInternships(toShow);
    setFilteredInternships(toShow);
  };

  const handleApplyFilters = () => {
    let filtered = internships;

    // Filter by job types
    if (jobTypes.length > 0) {
      filtered = filtered.filter((internship) =>
        internship.tags.some((tag) => jobTypes.includes(tag))
      );
    }

    // Filter by experience
    if (experiences.length > 0) {
      filtered = filtered.filter((internship) =>
        internship.tags.some((tag) => experiences.includes(tag))
      );
    }

    // Filter by location
    if (locations.length > 0) {
      filtered = filtered.filter(
        (internship) =>
          locations.includes(internship.location) ||
          internship.tags.some((tag) => locations.includes(tag))
      );
    }

    // Sort
    if (sortBy === "a-z") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "top-salary") {
      filtered = [...filtered].sort((a, b) => {
        const extractNum = (str: string) => parseInt(str.replace(/\D/g, ""));
        return extractNum(b.salary) - extractNum(a.salary);
      });
    }

    setFilteredInternships(filtered);
  };

  const handleClearFilters = () => {
    setSortBy("most-recent");
    setSalaryMin("");
    setSalaryMax("");
    setJobTypes([]);
    setExperiences([]);
    setLocations([]);
    setFilteredInternships(internships);
  };

  const toggleJobType = (jobType: string) => {
    setJobTypes((prev) =>
      prev.includes(jobType) ? prev.filter((t) => t !== jobType) : [...prev, jobType]
    );
  };

  const toggleExperience = (exp: string) => {
    setExperiences((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const toggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleCardClick = (internship: any) => {
    setSelectedInternship(internship);
  };

  const handleSaveInternship = (e: React.MouseEvent, internshipId: number) => {
    e.stopPropagation();
    if (savedInternships.includes(internshipId)) {
      setSavedInternships(savedInternships.filter((id) => id !== internshipId));
    } else {
      setSavedInternships([...savedInternships, internshipId]);
    }
  };

  const handleApplyForInternship = async (e: React.MouseEvent, internshipId: number) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    try {
      setApplying(true);
      await internshipsService.applyForInternship(internshipId.toString());
      // Add to applied internships if not already there
      if (!appliedInternships.includes(internshipId)) {
        setAppliedInternships([...appliedInternships, internshipId]);
      }
      alert("✅ Application submitted successfully!");
      setSelectedInternship(null);
    } catch (error) {
      console.error("Error applying for internship:", error);
      alert("❌ Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <PortalLayout title="Home">
      <aside className="sticky top-24 hidden w-80 shrink-0 xl:block">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-lg font-semibold text-gray-900">Filters</h4>

            <div className="py-5">
              <Divider />
            </div>

            {/* Sort By [Most Recent, A-Z, Top Salary, Trending] Radio Groups Grid */}
            <div className="">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Sort By
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "most-recent", name: "Most Recent" },
                  { id: "a-z", name: "A-Z" },
                  { id: "top-salary", name: "Top Salary" },
                  { id: "trending", name: "Trending" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-x-2">
                    <input
                      id={item.id}
                      name="sort-by"
                      type="radio"
                      checked={sortBy === item.id}
                      onChange={(e) => setSortBy(e.target.id)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={item.id} className="text-sm text-gray-900">
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Sort By [Most Recent, A-Z, Top Salary, Trending] Radio Groups Grid End */}

            <div className="py-5">
              <Divider />
            </div>

            {/* Job Salary Filter Inputs */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Salary
              </h5>
              <div className="flex gap-x-4">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-1/2"
                  placeholder="Min"
                />
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 w-1/2"
                  placeholder="Max"
                />
              </div>
            </div>
            {/* Job Salary Filter Inputs End */}

            <div className="py-5">
              <Divider />
            </div>

            {/* Job Type [Full-time, Part-time, Remote] Checkbox Group */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Job Type
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {["Full-time", "Part-time", "Remote", "Voluntier"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-x-2">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id={`job-type-${item}`}
                            type="checkbox"
                            checked={jobTypes.includes(item)}
                            onChange={() => toggleJobType(item)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor={`job-type-${item}`}
                            className="font-md text-gray-900"
                          >
                            {item}
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            {/* Job Type [Full-time, Part-time, Remote] Checkbox Group End */}

            <div className="py-5">
              <Divider />
            </div>

            {/* Job Experience [1-3 years, 3-5 years, 5+ years] Checkbox Group */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Experience
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {["1-3 years", "3-5 years", "5+ years"].map((item) => (
                  <div key={item} className="flex items-center gap-x-2">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id={`exp-${item}`}
                          type="checkbox"
                          checked={experiences.includes(item)}
                          onChange={() => toggleExperience(item)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor={`exp-${item}`}
                          className="font-md text-gray-900"
                        >
                          {item}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Job Experience [1-3 years, 3-5 years, 5+ years] Checkbox Group End */}

            <div className="py-5">
              <Divider />
            </div>

            {/* Job Location [Remote, On-site, Hybrid] Checkbox Group */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Location
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {["Remote", "On-site", "Hybrid"].map((item) => (
                  <div key={item} className="flex items-center gap-x-2">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id={`loc-${item}`}
                          type="checkbox"
                          checked={locations.includes(item)}
                          onChange={() => toggleLocation(item)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor={`loc-${item}`}
                          className="font-md text-gray-900"
                        >
                          {item}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Job Location [Remote, On-site, Hybrid] Checkbox Group End */}

            <div className="py-5">
              <Divider />
            </div>

            {/* Apply Filters Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
            {/* Apply Filters Button End */}
          </div>
        </div>
      </aside>

      <main className="flex-1">
        {/* Internships Search Area Mix Search Input with Location Dropdown & Search Button */}
        <form className="flex gap-x-4 justify-between mb-4" onSubmit={handleSearch}>
          <div className="flex gap-x-4">
            <div className="relative rounded-md shadow-sm w-80">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full h-10 rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search Internships"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
        {/* Internships Search Area Mix Search Input with Location Dropdown & Search Button End */}

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Search Results
          </h3>

          {/* Search Results Count */}
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-500">
              {filteredInternships.length} Result{filteredInternships.length !== 1 ? "s" : ""} Found
            </span>
          </div>
        </div>

        {/* Internships List Grid extra-large - 5 columns , large - 4 columns, medium - 3 columns, small - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredInternships.map((job, index) => (
            <div
              key={job.id}
              onClick={() => handleCardClick(job)}
              className={`overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-all duration-200 cursor-pointer ${
                selectedInternship?.id === job.id ? "border-2 border-indigo-600" : "border border-gray-200"
              } hover:border-indigo-400`}
            >
              <div className="px-4 py-5 sm:p-6">
                {/* Internship Title, Company, Location */}
                <div className="flex gap-x-4 justify-between">
                  <div className="flex gap-x-2 flex-1">
                    <div className="rounded w-12 h-12 bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{job.company}</p>
                      <p className="text-sm text-gray-500 truncate">{job.location}</p>
                    </div>
                  </div>

                  {/* Save Internship Action */}
                  <div className="flex items-start flex-shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={(e) => handleSaveInternship(e, job.id)}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        savedInternships.includes(job.id)
                          ? "text-indigo-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                      title={savedInternships.includes(job.id) ? "Remove from saved" : "Save internship"}
                    >
                      <BookmarkIcon
                        className={`h-5 w-5 ${
                          savedInternships.includes(job.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {/* Save Internship Action End */}
                </div>
                {/* Internship Title, Company, Location End */}

                {/* Tags */}
                <div className="flex gap-x-2 mt-2 flex-wrap">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-600/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Tags End */}

                {/* Salary & Time */}
                <div className="flex items-center gap-x-2 mt-3 justify-between">
                  <div className="flex items-center gap-x-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      {job.salary}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{job.time}</span>
                </div>
                {/* Salary & Time End */}
              </div>
            </div>
          ))}
        </div>
        {/* Internships List Scrollable End */}
      </main>

      <aside className="sticky top-24 hidden w-80 shrink-0 xl:block">
        {selectedInternship ? (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6 gap-4">
              {/* Close Button */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Internship Details */}
              <div className="flex gap-x-4 justify-between">
                <div className="rounded w-16 h-16 bg-indigo-100 flex items-center justify-center">
                  <BriefcaseIcon className="h-10 w-10 text-indigo-600" />
                </div>

                {/* Share & Save Actions */}
                <div className="flex gap-2 items-start">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Share"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveInternship(e, selectedInternship.id)}
                    className={`p-2 rounded transition-colors ${
                      savedInternships.includes(selectedInternship.id)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                    title={savedInternships.includes(selectedInternship.id) ? "Remove from saved" : "Save"}
                  >
                    <BookmarkIcon
                      className={`h-5 w-5 ${
                        savedInternships.includes(selectedInternship.id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedInternship.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedInternship.company} • {selectedInternship.location}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {selectedInternship.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="py-4">
                <Divider />
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">
                    Salary
                  </h4>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedInternship.salary}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">
                    Posted
                  </h4>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedInternship.time}
                  </p>
                </div>
              </div>

              <div className="py-4">
                <Divider />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedInternship.description ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac purus sit amet nisl tincidunt."}
                </p>
              </div>

              <div className="py-4">
                <Divider />
              </div>

              {/* Apply Button */}
              <button
                type="button"
                onClick={(e) => handleApplyForInternship(e, selectedInternship.id)}
                disabled={applying}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow p-6 text-center">
            <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">
              Select an internship to view details
            </p>
          </div>
        )}
      </aside>

      <Dialog
        open={showLoginDialog}
        title="Authentication Required"
        onClose={() => setShowLoginDialog(false)}
        enableAccept={false}
        enableCancel={false}
        enableClose={true}
      >
        <div className="text-center py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Login to Apply
          </h3>
          <p className="text-gray-600 mb-6">
            You need to be logged in to apply for internship opportunities. Please login or create an account to continue.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/login");
              }}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/register");
              }}
              className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </Dialog>
    </PortalLayout>
  );
};

export default HomePage;
