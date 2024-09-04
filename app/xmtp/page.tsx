"use client";
import ChatInteface from "@/components/imaginekit/chat/ChatInteface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { BrowserProvider, ethers, JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { HandlerContext, run } from "@xmtp/message-kit";

export default function Home() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>();
  const [provider, setProvider] = useState<BrowserProvider | null>();
  const [xmtpClient, setXMTPClient] = useState<Client | null>();
  const [wallet, setWallet] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation<any> | null>();

  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  useEffect(() => {
    console.log(process.env);
    if (window?.ethereum && !provider) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, [provider]);

  useEffect(() => {
    if (provider) {
      provider.getSigner().then(async (signer) => {
        console.log(signer.getAddress());
        setSigner(signer);
      });
    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      Client.create(signer, { env: "production" }).then(async (client) => {
        setXMTPClient(client);
      });
    }
  }, [signer]);

  useEffect(() => {
    (async () => {
      if (xmtpClient) {
        for await (const message of await xmtpClient?.conversations.streamAllMessages()) {
          console.log(`[${message.senderAddress}]: ${message.content}`);
        }
      }
    })();
  }, [xmtpClient]);

  const startConversation = useCallback(
    async (walletTo: string = wallet) => {
      console.log(walletTo);
      xmtpClient &&
        setConversation(
          await xmtpClient.conversations.newConversation(walletTo)
        );
    },
    [xmtpClient, wallet]
  );

  const sendMessage = useCallback(
    (messageTo: string = message) => {
      conversation?.send(messageTo);
    },
    [conversation, message]
  );

  return (
    <div>
      {/* <LLMNode />
      <SketchPad />
      <FlipCard />
      <WordArranger
        correctWords={["This", "Is", "A", "Test"]}
        setIsCorrect={(isCorrect: any) => console.log("Is correct", isCorrect)}
      /> */}
      <ChatInteface />
      <div className="flex">
        <Input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Enter wallet"
          className=""
        />
        <Button onClick={() => startConversation()}>Start</Button>
      </div>
      <div className="flex">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send Message"
          className=""
        />
        <Button onClick={() => sendMessage()}>Send</Button>
      </div>
    </div>
  );
}