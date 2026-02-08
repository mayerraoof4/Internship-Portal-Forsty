import PortalLayout from "@/components/layouts/portal/PortalLayout";
import Divider from "@/components/core-ui/Divider";
import { useState } from "react";
import {
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

const SettingsPage = () => {
  const [userRole] = useState<"internship_seeker" | "company">("internship_seeker");
  const isCompany = userRole === "company";

  return (
    <PortalLayout title="Settings">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-x-3 mb-6">
              <BellIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notification Preferences
              </h2>
            </div>
            <Divider />

            <div className="mt-6 space-y-4">
              {isCompany ? (
                <>
                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about new applications
                    </span>
                  </label>

                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about candidate messages
                    </span>
                  </label>

                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about job postings expiring soon
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about new internship matches
                    </span>
                  </label>

                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about application updates
                    </span>
                  </label>

                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about company messages
                    </span>
                  </label>

                  <label className="flex items-center gap-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">
                      Email me about internship recommendations
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Privacy & Security
              </h2>
            </div>
            <Divider />

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Profile Visibility
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-x-3">
                    <input
                      type="radio"
                      name="visibility"
                      defaultChecked
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">Public</span>
                  </label>
                  <label className="flex items-center gap-x-3">
                    <input
                      type="radio"
                      name="visibility"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-900">Private</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Data & Privacy
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your personal data is encrypted and secure. Learn more about our
                  privacy policy.
                </p>
                <button
                  type="button"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  View Privacy Policy →
                </button>
              </div>
            </div>
          </div>

          {/* Password & Authentication */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-x-3 mb-6">
              <KeyIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Password & Authentication
              </h2>
            </div>
            <Divider />

            <div className="mt-6 space-y-4">
              <button
                type="button"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Change Password
              </button>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Two-Factor Authentication
                </h3>
                <label className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-sm text-gray-900">
                    Enable two-factor authentication
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white rounded-lg shadow p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Account Management
            </h2>
            <Divider />

            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <button
                type="button"
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default SettingsPage;
