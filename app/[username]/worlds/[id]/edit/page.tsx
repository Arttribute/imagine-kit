"use client";

import store from "@/store/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import Editor from "@/components/Editor";

export default function EditWorld({
  params,
}: {
  params: { username: string; id: string };
}) {
  const appId = params.id;
  const username = params.username;

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        {appId && <Editor appId={appId} owner={username} />}
      </DndProvider>
    </Provider>
  );
}
