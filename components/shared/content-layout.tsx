import { Header } from "@/components/shared/header";
import { DesktopSidebar } from "@/components/shared/desktop-sidebar";
import { Footer } from "@/components/shared/footer";
import { Main } from "@/components/shared/main";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const ContentLayout = ({ title, children }: ContentLayoutProps) => {
  return (
    <>
      <DesktopSidebar />
      <Main>
        <div className="relative">
          <Header title={title} />
          <div className="p-2 sm:p-4">{children}</div>
        </div>
      </Main>
      <Footer />
    </>
  );
};
