import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle>Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not find requested resource</p>
          <Button asChild className="mt-4">
            <Link href="/user/todos">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
