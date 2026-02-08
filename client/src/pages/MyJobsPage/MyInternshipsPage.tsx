import PortalLayout from "@/components/layouts/portal/PortalLayout";
import { useEffect, useState } from "react";
import {
  BookmarkIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  tags: string[];
  salary: string;
  time: string;
}

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

const MyInternshipsPage = () => {
  const [appliedInternships, setAppliedInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppliedInternships = () => {
    // Load applied internship IDs from localStorage
    const appliedIds = localStorage.getItem("appliedInternships");
    const ids = appliedIds ? JSON.parse(appliedIds) : [];

    // Filter mock internships to show only applied ones
    const applied = mockInternships.filter((internship) =>
      ids.includes(internship.id)
    );

    setAppliedInternships(applied);
    setLoading(false);
  };

  useEffect(() => {
    loadAppliedInternships();

    // Listen to storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "appliedInternships") {
        loadAppliedInternships();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Also listen for changes within the same tab using a custom event
  useEffect(() => {
    const handleStorageUpdate = () => {
      loadAppliedInternships();
    };

    window.addEventListener("appliedInternshipsUpdated", handleStorageUpdate as EventListener);
    return () => window.removeEventListener("appliedInternshipsUpdated", handleStorageUpdate as EventListener);
  }, []);

  if (loading) {
    return (
      <PortalLayout title="My Internships">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="My Internships">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            My Applications ({appliedInternships.length})
          </h3>
        </div>

        {appliedInternships.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BriefcaseIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-500">
              You haven't applied to any internships yet. Browse internship
              opportunities and apply to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {appliedInternships.map((internship) => (
              <div
                key={internship.id}
                className="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-indigo-400"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex gap-x-4 justify-between">
                    <div className="flex gap-x-2 flex-1">
                      <div className="rounded w-12 h-12 bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {internship.title}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {internship.company}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {internship.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-x-2 mt-2 flex-wrap">
                    {internship.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 ring-1 ring-inset ring-blue-600/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-x-2 mt-3 justify-between">
                    <div className="flex items-center gap-x-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {internship.salary}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {internship.time}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      ✓ Applied
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default MyInternshipsPage;
