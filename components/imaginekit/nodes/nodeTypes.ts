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
import AudioPlayerNode from "./AudioPlayerNode";
import TextToSpeech from "./TextToSpeechNode";
import SpeechToText from "./SpeechToTextNode";
import AudioRecorder from "./AudioRecorderNode";
import CameraNode from "./CameraNode";
import FileUploadNode from "./FileUploadNode";

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
  audioPlayer: AudioPlayerNode,
  textToSpeech: TextToSpeech,
  audioRecorder: AudioRecorder,
  speechToText: SpeechToText,
  camera: CameraNode,
  fileUpload: FileUploadNode,
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
    AudioPlayer: "audioPlayer",
    TextToSpeech: "textToSpeech",
    AudioRecorder: "audioRecorder",
    SpeechToText: "speechToText",
    Camera: "camera",
    FileUpload: "fileUpload",
  },
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
    "audioPlayer",
    "audioRecorder",
    "camera",
    "fileUpload",
  ],
  defaultData: {
    LLMNode: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Output", value: "", color: "" }],
      instruction: "",
      botName: "Bot Name",
    },
    ImageGen: {
      inputs: [{ id: "input-0", label: "Prompt", value: "", color: "" }],
      outputs: [
        { id: "output-0", label: "Generated Image", value: "", color: "" },
      ],
      imageGenName: "Image Generator",
    },
    ImagesDisplay: {
      inputs: [{ id: "input-0", label: "Image Source", value: "", color: "" }],
      outputs: [
        { id: "output-0", label: "Display Image", value: "", color: "" },
      ],
      imageDisplayName: "Image Display",
    },
    ImageTiles: {
      inputs: [{ id: "input-0", label: "Image Source", value: "", color: "" }],
      outputs: [
        { id: "output-0", label: "Arranged Images", value: "", color: "" },
      ],
    },
    SketchPad: {
      outputs: [
        { id: "output-0", label: "Sketch result", value: "", color: "" },
      ],
    },
    Compare: {
      inputs: [
        { id: "input-0", label: "Input 1", value: "", color: "" },
        { id: "input-1", label: "Input 2", value: "", color: "" },
      ],
      outputs: [
        { id: "output-0", label: "Comparison result", value: "", color: "" },
      ],
    },
    TriggerButton: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Button name", value: "", color: "" }],
    },
    TextInput: {
      inputs: [],
      outputs: [
        { id: "output-0", label: "User content", value: "", color: "" },
      ],
    },
    TextOutput: {
      inputs: [{ id: "input-0", label: "Text source", value: "", color: "" }],
      outputs: [],
    },
    WordSelector: {
      inputs: [
        { id: "input-0", label: "Correct words", value: "", color: "" },
        { id: "input-1", label: "Incorrect words", value: "", color: "" },
      ],
      outputs: [
        { id: "output-0", label: "Selected words", value: "", color: "" },
      ],
    },
    WordArranger: {
      inputs: [
        { id: "input-0", label: "Correct words", value: "", color: "" },
        { id: "input-1", label: "Incorrect words", value: "", color: "" },
      ],
      outputs: [
        { id: "output-0", label: "Arranged words", value: "", color: "" },
      ],
    },
    FlipCard: {
      inputs: [
        { id: "input-0", label: "Front title", value: "", color: "" },
        { id: "input-1", label: "Back title", value: "", color: "" },
        { id: "input-2", label: "Front text", value: "", color: "" },
        { id: "input-3", label: "Back text", value: "", color: "" },
        { id: "input-4", label: "Front image", value: "", color: "" },
        { id: "input-5", label: "Back image", value: "", color: "" },
      ],
      outputs: [],
    },
    ChatInterface: {
      inputs: [{ id: "input-0", label: "Participant 1", value: "", color: "" }],
      outputs: [
        { id: "output-0", label: "Interaction data", value: "", color: "" },
      ],
    },
    AudioPlayer: {
      inputs: [{ id: "input-0", label: "Audio Source", value: "", color: "" }],
      outputs: [],
      audioPlayerName: "Audio Player",
    },
    AudioRecorder: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Audio", value: "", color: "" }],
      audioRecorderName: "Audio Recorder",
    },
    TextToSpeech: {
      inputs: [{ id: "input-0", label: "Text Source", value: "", color: "" }],
      outputs: [{ id: "output-0", label: "Audio", value: "", color: "" }],
      textToSpeechName: "Text to Speech",
    },
    SpeechToText: {
      inputs: [{ id: "input-0", label: "Audio Source", value: "", color: "" }],
      outputs: [{ id: "output-0", label: "Text", value: "", color: "" }],
      speechToTextName: "Speech to Text",
    },
    Camera: {
      inputs: [],
      outputs: [{ id: "output-0", label: "Photo", value: "", color: "" }],
      cameraName: "Camera",
    },
    Memory: {
      inputs: [],
      outputs: [],
      memoryFields: [
        { id: "field-0", label: "Memory Field 1", value: "", color: "" },
      ],
    },
    FileUpload: {
      inputs: [],
      outputs: [{ id: "output-0", label: "File", value: "", color: "" }],
      fileUploadName: "File Upload",
    },
    CustomNode: {
      inputs: [],
      outputs: [],
    },
  },
} as const; // Use 'as const' to freeze the entire NODE_TYPE_MAPPING object

export default nodeTypes;
