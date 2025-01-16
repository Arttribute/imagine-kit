//embed/[id]/page.tsx
import RuntimeEngine from "@/components/RuntimeEngine";

export default function EmbedPage({ params }: { params: { id: string } }) {
  const { id: appId } = params;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <RuntimeEngine appId={appId} />
    </div>
  );
}
