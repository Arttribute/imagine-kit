import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import { ConstructionIcon, TriangleAlert } from "lucide-react";

export default function WorldScaffolding() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="border border-gray-500 shadow-2xl shadow-purple-200 rounded-2xl bg-white z-10 p-2 w-96 lg:w-[460px]">
        <div className="p-6 border  border-gray-300 rounded-xl">
          <div className="p-4 mb-4 flex flex-col items-center justify-center">
            <ConstructionIcon className="mb-2 w-12 h-12 text-amber-700" />
            <h1 className="text-2xl font-semibold">
              Blue print still unfolding
            </h1>
            <div className="flex items-center justify-center mt-2">
              <p className="text-gray-500">
                World is still under construction{" "}
              </p>
              <TriangleAlert className="ml-1 w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="flex justify-center p-4 w-full">
            <Link href="/worlds" passHref>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                Explore more worlds
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}
