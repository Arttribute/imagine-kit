// components/imaginekit/nodes/index.ts

import CustomNode from "./CustomNode";
import LLMNode from "./LLMNode";
import ImageGeneratorNode from "./ImageGeneratorNode";
import ImageDisplayNode from "./ImageDisplayNode";
import ImageTilesNode from "./ImageTilesNode";
import SketchPadNode from "./SketchPadNode";
import CompareNode from "./CompareNode";
import TextInputNode from "./TextInputNode";
import TextOutputNode from "./TextOutputNode";
import WordSelectorNode from "./WordSelectorNode";
import WordArrangerNode from "./WordArrangerNode";
import FlipCardNode from "./FlipCardNode";
import ChatInterfaceNode from "./ChatInterfaceNode";
import MemoryNode from "./MemoryNode";
import TriggerButtonNode from "./TriggerButtonNode";

// Object to map node types to their respective components
export const nodeTypes = {
  custom: CustomNode,
  llm: LLMNode,
  imageGen: ImageGeneratorNode,
  imageDisplay: ImageDisplayNode,
  imageTiles: ImageTilesNode,
  sketchPad: SketchPadNode,
  compare: CompareNode,
  textInput: TextInputNode,
  textOutput: TextOutputNode,
  wordSelector: WordSelectorNode,
  wordArranger: WordArrangerNode,
  flipCard: FlipCardNode,
  chatInterface: ChatInterfaceNode,
  memory: MemoryNode,
  triggerButton: TriggerButtonNode,
};

// Object to map node type names and default data configurations
export const NODE_TYPE_MAPPING = {
  types: {
    LLMNode: "llm",
    ImageGen: "imageGen",
    ImagesDisplay: "imageDisplay",
    ImageTiles: "imageTiles",
    SketchPad: "sketchPad",
    Compare: "compare",
    TextInput: "textInput",
    TextOutput: "textOutput",
    WordSelector: "wordSelector",
    WordArranger: "wordArranger",
    FlipCard: "flipCard",
    ChatInterface: "chatInterface",
    Memory: "memory",
    CustomNode: "custom",
    TriggerButton: "triggerButton",
  } as const, // Use 'as const' to make this object read-only and enable type-safe indexing
  ui: [
    "imageDisplay",
    "imageTiles",
    "sketchPad",
    "textInput",
    "textOutput",
    "wordSelector",
    "wordArranger",
    "flipCard",
    "chatInterface",
    "triggerButton",
  ],
  defaultData: {
    LLMNode: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Output", value: "" }],
      instruction: "",
      botName: "Bot Name",
    },
    ImageGen: {
      inputs: [
        { id: "input-0", label: "Prompt", value: "" },
        { id: "input-1", label: "Reference Image", value: "" },
      ],
      outputs: [{ id: "output-0", label: "Generated Image", value: "" }],
      imageGenName: "Image Generator",
    },
    ImagesDisplay: {
      inputs: [{ id: "input-0", label: "Image Source", value: "" }],
      outputs: [{ id: "output-0", label: "Display Image", value: "" }],
      imageDisplayName: "Image Display",
    },
    ImageTiles: {
      inputs: [{ id: "input-0", label: "Image Source", value: "" }],
      outputs: [{ id: "output-0", label: "Arranged Images", value: "" }],
    },
    SketchPad: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Sketch result", value: "" }],
    },
    Compare: {
      inputs: [
        { id: "input-0", label: "Input 1", value: "" },
        { id: "input-1", label: "Input 2", value: "" },
      ],
      outputs: [{ id: "output-0", label: "Comparison result", value: "" }],
    },
    TriggerButton: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Button name", value: "" }],
    },
    TextInput: {
      inputs: [],
      outputs: [{ id: "output-0", label: "User content", value: "" }],
    },
    TextOutput: {
      inputs: [{ id: "input-0", label: "Text source", value: "" }],
      outputs: [],
    },
    WordSelector: {
      inputs: [
        { id: "input-0", label: "Correct words", value: "" },
        { id: "input-1", label: "Incorrect words", value: "" },
      ],
      outputs: [{ id: "output-0", label: "Selected words", value: "" }],
    },
    WordArranger: {
      inputs: [
        { id: "input-0", label: "Correct words", value: "" },
        { id: "input-1", label: "Incorrect words", value: "" },
      ],
      outputs: [{ id: "output-0", label: "Arranged words", value: "" }],
    },
    FlipCard: {
      inputs: [
        { id: "input-0", label: "Front title", value: "" },
        { id: "input-1", label: "Back title", value: "" },
        { id: "input-2", label: "Front text", value: "" },
        { id: "input-3", label: "Back text", value: "" },
        { id: "input-4", label: "Front image", value: "" },
        { id: "input-5", label: "Back image", value: "" },
      ],
      outputs: [],
    },
    ChatInterface: {
      inputs: [{ id: "input-0", label: "Participant 1", value: "" }],
      outputs: [{ id: "output-0", label: "Interaction data", value: "" }],
    },
    Memory: {
      inputs: [],
      outputs: [],
      memoryFields: [{ id: "field-0", label: "Memory Field 1", value: "" }],
    },
    CustomNode: {
      inputs: [],
      outputs: [],
    },
  },
} as const; // Use 'as const' to freeze the entire NODE_TYPE_MAPPING object

export default nodeTypes;
