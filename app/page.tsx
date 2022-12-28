import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Admin</h1>
      <Link href="/admin">Games</Link>

      <Link href="/login">Login</Link>
    </>
  );
}
