import AdminNav from "./AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 ml-[60px]">{children}</main>
    </div>
  );
}
