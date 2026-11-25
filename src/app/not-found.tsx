import Link from "next/link";
import { getCopy } from "@/lib/content";
export default function NotFound() {
  const copy = getCopy();
  return (
    <main id="main" className="not-found">
      <span>404</span>
      <h1>{copy.notFound.title}</h1>
      <Link className="button" href="/">
        {copy.notFound.action} ↗
      </Link>
    </main>
  );
}
