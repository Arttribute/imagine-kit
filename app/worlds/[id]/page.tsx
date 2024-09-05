"use client";
import RuntimeEngine from "@/components/RuntimeEngine";
export default function World({ params }: { params: { id: string } }) {
  const appId = params.id;
  return (
    <div>
      <RuntimeEngine appId={appId} />
    </div>
  );
}
