import * as React from "react";
import WorldCard from "@/components/worlds/WorldCard";

export default function WorldList({ apps }: { apps: any }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      {apps &&
        apps.map((app: any) => (
          <div className="col-span-6 lg:col-span-3 " key={app._id}>
            <WorldCard key={app?._id} app={app} />
          </div>
        ))}
    </div>
  );
}
