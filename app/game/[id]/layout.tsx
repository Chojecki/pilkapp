export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen md:fixed w-full">{children}</div>;
}
