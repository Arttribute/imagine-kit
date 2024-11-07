import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  SketchAppExample,
  TextToImageExample,
  AITarotExample,
  MosaicsExample,
} from "@/lib/ptomptEngineering/worldExamples";
import { ComponentsFormat } from "@/lib/ptomptEngineering/ComponentsFormat";
import {
  AllNodeTypes,
  AllNodeNames,
  AllUIComponentTypes,
} from "@/lib/ptomptEngineering/AllNodeTypes";
import { RuntimeEngineWorking } from "@/lib/ptomptEngineering/RuntimeEngineWorking";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { input } = requestBody;

    const prompt = `
    You are an assistant designed create AI-driven apps to output JSON.
    You will be using imagineKit's Node, Edge and UIComponent structure to create the app.
    Your goal is to take the user's input of what app they want to create and return the nodes, edges and uiComponents in JSON format.

    The user input is: ${input}

    The following is all you need to know about the imagineKit's Node, Edge and UIComponent structure:
    Here are the mongoose schamas for Node, Edge and UIComponent:
    InputOutputSchema ={
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
        },
        value: {
            type: String,
        },
    };

    NodeSchema ={
        node_id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        data: {
            inputs: [InputOutputSchema],
            outputs: [InputOutputSchema],
            instruction: { type: String },
            memoryFields: [InputOutputSchema],
        },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: App,
            required: true,
        },
    }

    EdgeSchema = {
        source: {
            type: String,
            required: true,
        },
        target: {
            type: String,
            required: true,
        },
        sourceHandle: {
            type: String,
            required: true,
        },
        targetHandle: {
            type: String,
            required: true,
        },
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: App,
            required: true,
        },
    };

    UIComponentSchema = {
        component_id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        label: {
            type: String,
        },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            width: { type: Number },
            height: { type: Number },
        },
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: App,
            required: true,
        },
    };

    YOU DO NOTE NEED TO PROVIDE THE app_id AS IT IS AUTOMATICALLY GENERATED BY MONGOOSE

    The following are the node types that are available:
        ${AllNodeTypes}

    The following are the node names that are available:
        ${AllNodeNames}

    The following are the uiComponents types that are available:
        ${AllUIComponentTypes}
    
    DO NOT GO OUTSIDE THE SCOPE OF THE NODE TYPES, NODE NAMES AND UI COMPONENTS TYPES PROVIDED

    The node_id are are named as follows: NodeName-n where n is a number starting from 1. Eg:LLMNode-1, ImageGen-2, ImagesDisplay-3, ImageTiles-4, SketchPad-5, Compare-6, TextInput-7, TextOutput-8, WordSelector-9, WordArranger-10, FlipCard-11, ChatInterface-12, Memory-13, CustomNode-14     

    Now create the necessary nodes, edges and uiComponents in JSON format to create the  user's desired app based on the user input:
    Return the JSON in th following format:
    ${ComponentsFormat}
        
    Here are examples of apps that can be created:

    ${SketchAppExample}

    ${TextToImageExample}

    ${AITarotExample}

    ${MosaicsExample}

    It is also VERY IMPORTANT you have a comprehensive understanding of how the runtime engine works in order to create a functional app and avoid errors.
    Here is a brief overview of how the runtime engine works:${RuntimeEngineWorking}

    Hint: For apps that may require complex behavior or logical understanding, use the LLM to process the input giving it the necessary instructions to follow to poduce the desired output.
    If the app gets too long to generate avoid generating the UI components and focus on the nodes and edges.
     
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        { role: "user", content: input },
      ],
      temperature: 1,
      max_tokens: 16384,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    return new NextResponse(
      JSON.stringify(response.choices[0].message.content),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
