import { ConciergeDrawer } from "@/components/concierge/concierge-drawer";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ConciergeDrawer />
    </>
  );
}
