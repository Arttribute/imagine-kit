import React from "react";

function ChatIntefaceInterface() {
  const InteractionData = [
    {
      input_type: "text",
      user_message: "Hello",
      system_message: '{"response": "Hi, how can I help you?"}',
    },
    {
      input_type: "text",
      user_message: "Design a fun coding game",
      system_message: '{"response": "That sounds like a fun project!"}',
    },
    {
      input_type: "text",
      user_message: "Let's get started",
      system_message:
        '{"response": "Great! Here are some ideas to get you started"}',
    },
  ];

  return (
    <div className="bg-gray-50 rounded-xl py-1 px-2 w-96 h-96">
      {InteractionData &&
        InteractionData.map((interaction: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex justify-end">
              <div className="bg-cyan-50 p-3 border rounded-2xl shadow-sm max-w-full">
                <p className="text-sm text-gray-500">
                  {interaction.user_message}
                </p>
              </div>
            </div>

            <div className="flex justify-start mt-4">
              <div className="border bg-white rounded-2xl p-4 px-5 shadow-sm max-w-full">
                <p className="text-sm text-gray-500">
                  {JSON.parse(interaction.system_message).response}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ChatIntefaceInterface;
