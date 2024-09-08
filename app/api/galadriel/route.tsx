import { AssistantBotABI } from "@/lib/abis/AssistantBotABI";
import { Contract, ethers, TransactionReceipt, Wallet } from "ethers";
export const revalidate = 0;

const privateKey = process.env.PRIVATE_KEY!;
const galdrielRpcurl = process.env.GALADRIEL_RPC_URL!;
const contractAddress = process.env.ASSISTANT_ADDRESS!;
const provider = new ethers.JsonRpcProvider(galdrielRpcurl);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, AssistantBotABI, wallet);

const initializeConversation = async (
  instruction: any,
  inputs: any,
  outputs: any
) => {
  const prompt = `
  You are an assistant designed to output JSON.
  Your goal is to ${instruction}

  This is the input: ${inputs}

  and you should output the json in the following format:
  ${outputs}
`;
  const transactionResponse = await contract.initiateConversation(prompt);
  const receipt = await transactionResponse.wait();
  let sessionId = getConversationSessionId(receipt, contract);
  if (!sessionId && sessionId !== 0) {
    return;
  }
  console.log("Session ID:", sessionId);
  const interactions = await contract.getConversationTexts(sessionId);
  console.log("Interactions:", interactions);
  console.log("Conversation initialized...");
  const returnObject = {
    sessionId,
    interactions,
  };
  return returnObject;
};

const generateNewInteraction = async (
  prevInteractionInfo: any,
  sessionId: string
) => {
  const previousInteractionInfo = JSON.stringify(prevInteractionInfo);
  await contract.addInteraction(previousInteractionInfo, sessionId);
  const interactions = await contract.getConversationTexts(sessionId);
  console.log("Interactions:", interactions);
  console.log("New interaction generated...");
  const returnObject = {
    sessionId,
    interactions,
  };
  return returnObject;
};

function getConversationSessionId(
  receipt: TransactionReceipt,
  contract: Contract
) {
  let sessionId;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "ConversationStarted") {
        sessionId = ethers.toNumber(parsedLog.args[1]);
      }
    } catch (error) {
      console.log("Could not parse log:", log);
    }
  }
  return sessionId;
}

export async function GET(request: Request) {
  const { instruction, inputs, outputs } = await request.json();
  try {
    const conversationData = await initializeConversation(
      instruction,
      inputs,
      outputs
    );
    return Response.json({ status: 200, conversationData });
  } catch (error: any) {
    return Response.json({ status: 500, error: error.message });
  }
}

export async function POST(request: Request) {
  const { prevInteractionInfo, conversationSessionId } = await request.json();
  try {
    const conversationData = await generateNewInteraction(
      prevInteractionInfo,
      conversationSessionId
    );
    return Response.json({ status: 200, conversationData });
  } catch (error: any) {
    return Response.json({ status: 500, error: error.message });
  }
}
