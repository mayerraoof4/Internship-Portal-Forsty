import usePageTitle from "@/hooks/usePageTitle";
import { FC } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

type Props = {
  title?: string;
  children: React.ReactNode;
};

const PortalLayout: FC<Props> = ({ title, children }) => {
  usePageTitle(title);

  return (
    <div className="flex flex-col bg-gray-50 h-screen">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PortalLayout;
