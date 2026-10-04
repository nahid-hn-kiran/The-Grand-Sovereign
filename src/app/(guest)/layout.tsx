import { ConciergeDrawer } from "@/components/concierge/concierge-drawer";
import { Footer } from "@/components/layout/footer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ConciergeDrawer />
      <Footer />
    </>
  );
}
