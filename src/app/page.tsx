import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div>
      quick dev bookinggg
    </div>
    <Link href="/onboarding">
      <Button>
        sign inn 
      </Button>
    </Link>
    </>
  );
}
