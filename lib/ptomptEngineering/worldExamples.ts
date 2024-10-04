export const SketchAppExample = `
Example 1: A Simple sketch pad app that turns the user's sketch into a refined image. 
This app also displays the prompt that is used to generate the image.

Nodes:
[
    {
        "data": {
            "inputs": [],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "sketch",
                    "value": "sketch",
                    "_id": "66f2ee4c1066fe71450bd9e2"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": -123.96910397129352,
            "y": -470.8896672331379
        },
        "_id": "66f2ee4a2f74658a93ca655c",
        "node_id": "SketchPad-2",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0,
        "name": "SketchPad Node",
        "type": "sketchPad"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "sketch",
                    "value": "sketch",
                    "_id": "66f303121066fe71450bdf74"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f303121066fe71450bdf73"
                }
            ],
            "instruction": "Your goal is to enhance the hand drawn user image by creating an image prompt that best matches what the user has drawn.",
            "memoryFields": []
        },
        "position": {
            "x": 343.2908914164508,
            "y": -506.5998996254731
        },
        "_id": "66f301e62f74658a93f54f2d",
        "app_id": "66f1b4538ff2230d14a340b4",
        "node_id": "LLMNode-2",
        "__v": 0,
        "name": "LLMNode Node",
        "type": "llm"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f303121066fe71450bdf76"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "image",
                    "value": "image",
                    "_id": "66f303121066fe71450bdf75"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 752.4531804030939,
            "y": -525.0523451044542
        },
        "_id": "66f301e62f74658a93f54f40",
        "app_id": "66f1b4538ff2230d14a340b4",
        "node_id": "ImageGen-3",
        "__v": 0,
        "name": "ImageGen Node",
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "image",
                    "value": "image",
                    "_id": "66f303121066fe71450bdf78"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "",
                    "value": "",
                    "_id": "66f303121066fe71450bdf77"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 1184.3809349665823,
            "y": -493.3368714877106
        },
        "_id": "66f3020e2f74658a93f5ac31",
        "node_id": "ImagesDisplay-4",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0,
        "name": "ImagesDisplay Node",
        "type": "imageDisplay"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f303121066fe71450bdf79"
                }
            ],
            "outputs": [],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 759.616893662469,
            "y": -145.53984413540914
        },
        "_id": "66f302222f74658a93f5d735",
        "app_id": "66f1b4538ff2230d14a340b4",
        "node_id": "TextOutput-5",
        "__v": 0,
        "name": "TextOutput Node",
        "type": "textOutput"
    }
]

Edges:
[
    {
        "_id": "66f301e72f74658a93f54fe2",
        "sourceHandle": "output-0",
        "app_id": "66f1b4538ff2230d14a340b4",
        "target": "LLMNode-2",
        "source": "SketchPad-2",
        "targetHandle": "input-0",
        "__v": 0
    },
    {
        "_id": "66f301f12f74658a93f56486",
        "source": "LLMNode-2",
        "targetHandle": "input-0",
        "target": "ImageGen-3",
        "sourceHandle": "output-0",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0
    },
    {
        "_id": "66f3020e2f74658a93f5ac80",
        "target": "ImagesDisplay-4",
        "sourceHandle": "output-0",
        "source": "ImageGen-3",
        "targetHandle": "input-0",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0
    },
    {
        "_id": "66f302222f74658a93f5d7c4",
        "source": "LLMNode-2",
        "sourceHandle": "output-0",
        "target": "TextOutput-5",
        "app_id": "66f1b4538ff2230d14a340b4",
        "targetHandle": "input-0",
        "__v": 0
    }
]

UIComponents:
[
    {
        "position": {
            "x": 178,
            "y": 29
        },
        "_id": "66f2ee4a2f74658a93ca6584",
        "component_id": "SketchPad-2",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0,
        "label": "SketchPad Node",
        "type": "sketchPad"
    },
    {
        "position": {
            "x": 570,
            "y": 63
        },
        "_id": "66f3020f2f74658a93f5acc9",
        "component_id": "ImagesDisplay-4",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0,
        "label": "ImagesDisplay Node",
        "type": "imageDisplay"
    },
    {
        "position": {
            "x": 367,
            "y": 484
        },
        "_id": "66f302222f74658a93f5d814",
        "component_id": "TextOutput-5",
        "app_id": "66f1b4538ff2230d14a340b4",
        "__v": 0,
        "label": "TextOutput Node",
        "type": "textOutput"
    }
]
`;

export const TextToImageExample = `
Example 2: A simple app that generates an image from a text prompt.

Nodes:
[
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66e49ca7061d6b621f0dd976"
                },
                {
                    "id": "input-1",
                    "label": "",
                    "value": "",
                    "_id": "66e49ca7061d6b621f0dd977"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "images",
                    "value": "images",
                    "_id": "66e49ca7061d6b621f0dd975"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 291.90617472982615,
            "y": 93.86899382526363
        },
        "_id": "66e49ca72f74658a93c34e16",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "node_id": "ImageGen-1",
        "__v": 0,
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "images",
                    "value": "images",
                    "_id": "66e49ce4061d6b621f0dd9d2"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "",
                    "value": "",
                    "_id": "66e49ce4061d6b621f0dd9d1"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 769.780119718052,
            "y": 88.29583669357473
        },
        "_id": "66e49ce42f74658a93c3e2c6",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "node_id": "ImagesDisplay-3",
        "__v": 0,
        "name": "ImagesDisplay Node",
        "type": "imageDisplay"
    },
    {
        "data": {
            "inputs": [],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f6a3bdfd62e79218cc526d"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": -172.18112731672863,
            "y": 118.66385601124739
        },
        "_id": "66f6a3ac2f74658a93ece6e9",
        "node_id": "TextInput-3",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "__v": 0,
        "type": "textInput"
    }
]

Edges:
[
    {
        "_id": "66e49ce42f74658a93c3e31a",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "sourceHandle": "output-0",
        "target": "ImagesDisplay-3",
        "source": "ImageGen-1",
        "targetHandle": "input-0",
        "__v": 0
    },
    {
        "_id": "66f6a3ac2f74658a93ece728",
        "target": "ImageGen-1",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "targetHandle": "input-0",
        "source": "TextInput-3",
        "sourceHandle": "output-0",
        "__v": 0
    }
]

UIComponents:
[
    {
        "position": {
            "x": 358,
            "y": 37
        },
        "_id": "66e49caf2f74658a93c36591",
        "component_id": "ImagesDisplay-3",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "__v": 0,
        "label": "ImagesDisplay Node",
        "type": "imageDisplay"
    },
    {
        "position": {
            "x": 359,
            "y": 442
        },
        "_id": "66f6a3ad2f74658a93ece753",
        "app_id": "66e49c8d061d6b621f0dd96d",
        "component_id": "TextInput-3",
        "__v": 0,
        "type": "textInput"
    }
]

`;

export const AITarotExample = `
Example 3: A Tarot reading app that generates unique story-based Tarot readings with image prompts.

Nodes:
[
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "Get reading",
                    "value": "Get reading",
                    "_id": "66f162b68ff2230d14a31d26"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "tarot-title-1",
                    "value": "tarot-title-1",
                    "_id": "66f162b68ff2230d14a31d1a"
                },
                {
                    "id": "output-1",
                    "label": "tarot-title-2",
                    "value": "tarot-title-2",
                    "_id": "66f162b68ff2230d14a31d1b"
                },
                {
                    "id": "output-2",
                    "label": "tarot-title-3",
                    "value": "tarot-title-3",
                    "_id": "66f162b68ff2230d14a31d1c"
                },
                {
                    "id": "output-3",
                    "label": "tarot-period-1",
                    "value": "tarot-period-1",
                    "_id": "66f162b68ff2230d14a31d1d"
                },
                {
                    "id": "output-4",
                    "label": "tarot-period-2",
                    "value": "tarot-period-2",
                    "_id": "66f162b68ff2230d14a31d1e"
                },
                {
                    "id": "output-5",
                    "label": "tarot-period-3",
                    "value": "tarot-period-3",
                    "_id": "66f162b68ff2230d14a31d1f"
                },
                {
                    "id": "output-6",
                    "label": "tarot-reading-1",
                    "value": "tarot-reading-1",
                    "_id": "66f162b68ff2230d14a31d20"
                },
                {
                    "id": "output-7",
                    "label": "tarot-reading-2",
                    "value": "tarot-reading-2",
                    "_id": "66f162b68ff2230d14a31d21"
                },
                {
                    "id": "output-8",
                    "label": "tarot-reading-3",
                    "value": "tarot-reading-3",
                    "_id": "66f162b68ff2230d14a31d22"
                },
                {
                    "id": "output-9",
                    "label": "tarot-image-prompt-1",
                    "value": "tarot-image-prompt-1",
                    "_id": "66f162b68ff2230d14a31d23"
                },
                {
                    "id": "output-10",
                    "label": "tarot-image-prompt-2",
                    "value": "tarot-image-prompt-2",
                    "_id": "66f162b68ff2230d14a31d24"
                },
                {
                    "id": "output-11",
                    "label": "tarot-image-prompt-3",
                    "value": "tarot-image-prompt-3",
                    "_id": "66f162b68ff2230d14a31d25"
                }
            ],
            "instruction": "You are a Tarot reader. Your goal is to give unque story-based Tarot readings that tell the user of their past, present, present and future.Unlike any other Tarot readings, you are not bound to a perticular deck and have the ability to generate anything for the Major Arcana and Minor Arcana with entirely new modern innovative concepts and designs, giving the user a completely unique tarot reading expreience.That means you willbe providing the card readings together with an image prompt which will be passed to an image generator to create a unique image for the card reading.",
            "memoryFields": []
        },
        "position": {
            "x": -228.68985931841564,
            "y": 76.77911592901134
        },
        "_id": "66f15f3f2f74658a936fb80d",
        "node_id": "LLMNode-1",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "name": "LLMNode Node",
        "type": "llm"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-image-prompt-3",
                    "value": "tarot-image-prompt-3",
                    "_id": "66f162b68ff2230d14a31d2f"
                },
                {
                    "id": "input-1",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d30"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "image-3",
                    "value": "image-3",
                    "_id": "66f162b68ff2230d14a31d2e"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 317.3584474653244,
            "y": 941.3372784071341
        },
        "_id": "66f160432f74658a9371d8a3",
        "node_id": "ImageGen-5",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "name": "ImageGen Node",
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-image-prompt-1",
                    "value": "tarot-image-prompt-1",
                    "_id": "66f162b68ff2230d14a31d29"
                },
                {
                    "id": "input-1",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d2a"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "image-1",
                    "value": "image-1",
                    "_id": "66f162b68ff2230d14a31d28"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 315.2743342417474,
            "y": 101.8391299169023
        },
        "_id": "66f160432f74658a9371d8a0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "node_id": "ImageGen-3",
        "__v": 0,
        "name": "ImageGen Node",
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-image-prompt-2",
                    "value": "tarot-image-prompt-2",
                    "_id": "66f162b68ff2230d14a31d2c"
                },
                {
                    "id": "input-1",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d2d"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "image-2",
                    "value": "image-2",
                    "_id": "66f162b68ff2230d14a31d2b"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 313.5058923429201,
            "y": 525.9756251159944
        },
        "_id": "66f160432f74658a9371d8a4",
        "app_id": "66f1288f8ff2230d14a2e114",
        "node_id": "ImageGen-4",
        "__v": 0,
        "name": "ImageGen Node",
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-title-1",
                    "value": "tarot-title-1",
                    "_id": "66f162b68ff2230d14a31d31"
                },
                {
                    "id": "input-1",
                    "label": "tarot-period-1",
                    "value": "tarot-period-1",
                    "_id": "66f162b68ff2230d14a31d32"
                },
                {
                    "id": "input-2",
                    "label": "tarot-reading-1",
                    "value": "tarot-reading-1",
                    "_id": "66f162b68ff2230d14a31d33"
                },
                {
                    "id": "input-3",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d34"
                },
                {
                    "id": "input-4",
                    "label": "image-1",
                    "value": "image-1",
                    "_id": "66f162b68ff2230d14a31d35"
                },
                {
                    "id": "input-5",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d36"
                }
            ],
            "outputs": [],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 877.4799950199779,
            "y": -161.90829730987235
        },
        "_id": "66f160432f74658a9371d8b1",
        "node_id": "FlipCard-6",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "name": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-title-2",
                    "value": "tarot-title-2",
                    "_id": "66f162b68ff2230d14a31d37"
                },
                {
                    "id": "input-1",
                    "label": "tarot-period-2",
                    "value": "tarot-period-2",
                    "_id": "66f162b68ff2230d14a31d38"
                },
                {
                    "id": "input-2",
                    "label": "tarot-reading-2",
                    "value": "tarot-reading-2",
                    "_id": "66f162b68ff2230d14a31d39"
                },
                {
                    "id": "input-3",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d3a"
                },
                {
                    "id": "input-4",
                    "label": "image-2",
                    "value": "image-2",
                    "_id": "66f162b68ff2230d14a31d3b"
                },
                {
                    "id": "input-5",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d3c"
                }
            ],
            "outputs": [],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 877.2644048450945,
            "y": 692.6711383926347
        },
        "_id": "66f160432f74658a9371d8b2",
        "app_id": "66f1288f8ff2230d14a2e114",
        "node_id": "FlipCard-7",
        "__v": 0,
        "name": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "tarot-title-3",
                    "value": "tarot-title-3",
                    "_id": "66f162b68ff2230d14a31d3d"
                },
                {
                    "id": "input-1",
                    "label": "tarot-period-3",
                    "value": "tarot-period-3",
                    "_id": "66f162b68ff2230d14a31d3e"
                },
                {
                    "id": "input-2",
                    "label": "tarot-reading-3",
                    "value": "tarot-reading-3",
                    "_id": "66f162b68ff2230d14a31d3f"
                },
                {
                    "id": "input-3",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d40"
                },
                {
                    "id": "input-4",
                    "label": "image-3",
                    "value": "image-3",
                    "_id": "66f162b68ff2230d14a31d41"
                },
                {
                    "id": "input-5",
                    "label": "",
                    "value": "",
                    "_id": "66f162b68ff2230d14a31d42"
                }
            ],
            "outputs": [],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 878.1342036801343,
            "y": 1544.7797582102635
        },
        "_id": "66f160522f74658a9371f5f8",
        "node_id": "FlipCard-8",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "name": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "data": {
            "inputs": [],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "Get Reading",
                    "value": "Get Reading",
                    "_id": "66f17fba8ff2230d14a326a7"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": -724.1013779068157,
            "y": 122.7356531650255
        },
        "_id": "66f17f252f74658a93b38f4b",
        "node_id": "TriggerButton-9",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "name": "TriggerButton Node",
        "type": "triggerButton"
    }
]

Edges:
[
    {
        "_id": "66f161322f74658a9373c7b9",
        "app_id": "66f1288f8ff2230d14a2e114",
        "sourceHandle": "output-0",
        "target": "FlipCard-6",
        "source": "LLMNode-1",
        "targetHandle": "input-0",
        "__v": 0
    },
    {
        "_id": "66f1614e2f74658a9374017b",
        "targetHandle": "input-1",
        "app_id": "66f1288f8ff2230d14a2e114",
        "target": "FlipCard-6",
        "sourceHandle": "output-3",
        "source": "LLMNode-1",
        "__v": 0
    },
    {
        "_id": "66f1614e2f74658a9374017a",
        "source": "LLMNode-1",
        "targetHandle": "input-2",
        "target": "FlipCard-6",
        "sourceHandle": "output-6",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0
    },
    {
        "_id": "66f161bf2f74658a9374ecb0",
        "targetHandle": "input-0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "target": "ImageGen-3",
        "sourceHandle": "output-9",
        "source": "LLMNode-1",
        "__v": 0
    },
    {
        "_id": "66f161d12f74658a93751163",
        "source": "ImageGen-3",
        "targetHandle": "input-4",
        "target": "FlipCard-6",
        "sourceHandle": "output-0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0
    },
    {
        "_id": "66f161f22f74658a93755871",
        "sourceHandle": "output-10",
        "app_id": "66f1288f8ff2230d14a2e114",
        "targetHandle": "input-0",
        "source": "LLMNode-1",
        "target": "ImageGen-4",
        "__v": 0
    },
    {
        "_id": "66f161fc2f74658a93756d09",
        "targetHandle": "input-0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "target": "ImageGen-5",
        "sourceHandle": "output-11",
        "source": "LLMNode-1",
        "__v": 0
    },
    {
        "_id": "66f162222f74658a9375cb2d",
        "target": "FlipCard-7",
        "app_id": "66f1288f8ff2230d14a2e114",
        "targetHandle": "input-0",
        "source": "LLMNode-1",
        "sourceHandle": "output-1",
        "__v": 0
    },
    {
        "_id": "66f1622f2f74658a9375e6b9",
        "targetHandle": "input-1",
        "app_id": "66f1288f8ff2230d14a2e114",
        "target": "FlipCard-7",
        "sourceHandle": "output-4",
        "source": "LLMNode-1",
        "__v": 0
    },
    {
        "_id": "66f1623f2f74658a9376085e",
        "source": "LLMNode-1",
        "sourceHandle": "output-5",
        "target": "FlipCard-7",
        "app_id": "66f1288f8ff2230d14a2e114",
        "targetHandle": "input-2",
        "__v": 0
    },
    {
        "_id": "66f1624a2f74658a93761e99",
        "target": "FlipCard-7",
        "sourceHandle": "output-0",
        "source": "ImageGen-4",
        "targetHandle": "input-4",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0
    },
    {
        "_id": "66f162582f74658a93763ca1",
        "source": "LLMNode-1",
        "targetHandle": "input-0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "sourceHandle": "output-2",
        "target": "FlipCard-8",
        "__v": 0
    },
    {
        "_id": "66f162802f74658a93768e03",
        "source": "LLMNode-1",
        "sourceHandle": "output-7",
        "target": "FlipCard-7",
        "app_id": "66f1288f8ff2230d14a2e114",
        "targetHandle": "input-2",
        "__v": 0
    },
    {
        "_id": "66f1628d2f74658a9376aaa6",
        "sourceHandle": "output-5",
        "app_id": "66f1288f8ff2230d14a2e114",
        "target": "FlipCard-8",
        "source": "LLMNode-1",
        "targetHandle": "input-1",
        "__v": 0
    },
    {
        "_id": "66f162972f74658a9376c05f",
        "source": "LLMNode-1",
        "targetHandle": "input-2",
        "target": "FlipCard-8",
        "sourceHandle": "output-8",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0
    },
    {
        "_id": "66f162992f74658a9376c474",
        "source": "ImageGen-5",
        "targetHandle": "input-4",
        "app_id": "66f1288f8ff2230d14a2e114",
        "sourceHandle": "output-0",
        "target": "FlipCard-8",
        "__v": 0
    },
    {
        "_id": "66f180242f74658a93b5a15a",
        "source": "TriggerButton-9",
        "targetHandle": "input-0",
        "app_id": "66f1288f8ff2230d14a2e114",
        "sourceHandle": "output-0",
        "target": "LLMNode-1",
        "__v": 0
    }
]

UIComponents:

[
    {
        "position": {
            "x": 488,
            "y": 111
        },
        "_id": "66f160432f74658a9371d8ed",
        "app_id": "66f1288f8ff2230d14a2e114",
        "component_id": "FlipCard-7",
        "__v": 0,
        "label": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "position": {
            "x": 266,
            "y": 112
        },
        "_id": "66f160432f74658a9371d8ee",
        "component_id": "FlipCard-6",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "label": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "position": {
            "x": 707,
            "y": 111
        },
        "_id": "66f160522f74658a9371f672",
        "component_id": "FlipCard-8",
        "app_id": "66f1288f8ff2230d14a2e114",
        "__v": 0,
        "label": "FlipCard Node",
        "type": "flipCard"
    },
    {
        "position": {
            "x": 395,
            "y": 415
        },
        "_id": "66f17f262f74658a93b38f9d",
        "app_id": "66f1288f8ff2230d14a2e114",
        "component_id": "TriggerButton-9",
        "__v": 0,
        "label": "TriggerButton Node",
        "type": "triggerButton"
    }
]
`;

export const MosaicsExample = `
Example 4: An image puzzle app where a prompt is used to generate an image which is broken into pieces and the user has to put the pieces back together to form the original image using the prompt as a hint.

Nodes:
[
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "image",
                    "value": "image",
                    "_id": "66f68f5f80a4c3491acfd1a0"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "",
                    "value": "",
                    "_id": "66f68f5f80a4c3491acfd19f"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 566.1397051881876,
            "y": -15.900393143073956
        },
        "_id": "66f68e292f74658a93bc412a",
        "app_id": "66e8671cce4d4101788faa2d",
        "node_id": "ImageTiles-1",
        "__v": 0,
        "name": "ImageTiles Node",
        "type": "imageTiles"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "Generate puzzle",
                    "value": "Generate puzzle",
                    "_id": "66f68f5f80a4c3491acfd1a4"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f68f5f80a4c3491acfd1a3"
                }
            ],
            "instruction": "Your goal is to come up with short concise image prompts for images that will be used as a mosaic puzzle",
            "memoryFields": []
        },
        "position": {
            "x": -356.839923876953,
            "y": -18.75686128946478
        },
        "_id": "66f68e4c2f74658a93bc8818",
        "app_id": "66e8671cce4d4101788faa2d",
        "node_id": "LLMNode-3",
        "__v": 0,
        "name": "LLMNode Node",
        "type": "llm"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f68f5f80a4c3491acfd1a2"
                }
            ],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "image",
                    "value": "image",
                    "_id": "66f68f5f80a4c3491acfd1a1"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 99.90753791493387,
            "y": -21.20119411178601
        },
        "_id": "66f68e4c2f74658a93bc8819",
        "node_id": "ImageGen-2",
        "app_id": "66e8671cce4d4101788faa2d",
        "__v": 0,
        "name": "ImageGen Node",
        "type": "imageGen"
    },
    {
        "data": {
            "inputs": [
                {
                    "id": "input-0",
                    "label": "prompt",
                    "value": "prompt",
                    "_id": "66f68f5f80a4c3491acfd1a6"
                }
            ],
            "outputs": [],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": 105.89367474205801,
            "y": 354.7235172997025
        },
        "_id": "66f68e672f74658a93bcc385",
        "node_id": "TextOutput-5",
        "app_id": "66e8671cce4d4101788faa2d",
        "__v": 0,
        "name": "TextOutput Node",
        "type": "textOutput"
    },
    {
        "data": {
            "inputs": [],
            "outputs": [
                {
                    "id": "output-0",
                    "label": "Generate puzzle",
                    "value": "Generate puzzle",
                    "_id": "66f68f5f80a4c3491acfd1a5"
                }
            ],
            "instruction": "",
            "memoryFields": []
        },
        "position": {
            "x": -763.517232818524,
            "y": 58.58807972210349
        },
        "_id": "66f68e672f74658a93bcc384",
        "app_id": "66e8671cce4d4101788faa2d",
        "node_id": "TriggerButton-4",
        "__v": 0,
        "name": "TriggerButton Node",
        "type": "triggerButton"
    }
]

Edges:
[
    {
        "_id": "66f68e9f2f74658a93bd51f2",
        "app_id": "66e8671cce4d4101788faa2d",
        "sourceHandle": "output-0",
        "targetHandle": "input-0",
        "source": "TriggerButton-4",
        "target": "LLMNode-3",
        "__v": 0
    },
    {
        "_id": "66f68f5f2f74658a93bef195",
        "target": "TextOutput-5",
        "app_id": "66e8671cce4d4101788faa2d",
        "targetHandle": "input-0",
        "source": "LLMNode-3",
        "sourceHandle": "output-0",
        "__v": 0
    },
    {
        "_id": "66f68f5f2f74658a93bef194",
        "source": "ImageGen-2",
        "sourceHandle": "output-0",
        "target": "ImageTiles-1",
        "app_id": "66e8671cce4d4101788faa2d",
        "targetHandle": "input-0",
        "__v": 0
    },
    {
        "_id": "66f68f5f2f74658a93bef197",
        "target": "ImageGen-2",
        "sourceHandle": "output-0",
        "source": "LLMNode-3",
        "targetHandle": "input-0",
        "app_id": "66e8671cce4d4101788faa2d",
        "__v": 0
    }
]

UIComponents:
[
    {
        "position": {
            "x": 375,
            "y": 135
        },
        "_id": "66f68e292f74658a93bc418e",
        "app_id": "66e8671cce4d4101788faa2d",
        "component_id": "ImageTiles-1",
        "__v": 0,
        "label": "ImageTiles Node",
        "type": "imageTiles"
    },
    {
        "position": {
            "x": 372,
            "y": 21
        },
        "_id": "66f68e672f74658a93bcc3e7",
        "app_id": "66e8671cce4d4101788faa2d",
        "component_id": "TextOutput-5",
        "__v": 0,
        "label": "TextOutput Node",
        "type": "textOutput"
    },
    {
        "position": {
            "x": 376,
            "y": 541
        },
        "_id": "66f68e672f74658a93bcc3e6",
        "component_id": "TriggerButton-4",
        "app_id": "66e8671cce4d4101788faa2d",
        "__v": 0,
        "label": "TriggerButton Node",
        "type": "triggerButton"
    }
]
`;
