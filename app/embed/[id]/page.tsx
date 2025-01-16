//embed/[id]/page.tsx
import RuntimeEngine from "@/components/RuntimeEngine";

export default function EmbedPage({ params }: { params: { id: string } }) {
  const { id: appId } = params;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto", // Let it scroll if there's more content than the iFrame
      }}
    >
      <RuntimeEngine appId={appId} />
    </div>
  );
}
