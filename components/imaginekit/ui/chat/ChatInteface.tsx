import React from "react";

function ChatInteface() {
  const filteredInteractionData = [
    {
      input_type: "text",
      user_message: "Hello",
      system_message: '{"response": "Hi, how can I help you?"}',
    },
    {
      input_type: "text",
      user_message: "I want to know about your services",
      system_message: '{"response": "Sure, we offer a wide range of services"}',
    },
    {
      input_type: "text",
      user_message: "Can you tell me more about them?",
      system_message:
        '{"response": "Of course! Here are some of the services we offer"}',
    },
  ];

  return (
    <div className="bg-gray-200 rounded-xl">
      {filteredInteractionData &&
        filteredInteractionData.map((interaction: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex justify-end">
              <div className="bg-gray-200 p-3 rounded-2xl shadow-sm max-w-full">
                <p className="text-sm text-gray-800">
                  {interaction.user_message}
                </p>
              </div>
            </div>

            <div className="flex justify-start mt-4">
              <div className="border bg-white rounded-2xl p-4 px-5 shadow-sm max-w-full">
                <p className="text-sm text-gray-700">
                  {JSON.parse(interaction.system_message).response}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ChatInteface;
