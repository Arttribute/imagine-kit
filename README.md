# Imagine Kit

A toolkit for creating and monetizing engaging AI-powered onchain experiences.

## Project Description

ImagineKit is a comprehensive toolkit designed for creators to build and monetize interactive AI-driven experiences on-chain. With an intuitive drag-and-drop interface, users can seamlessly connect AI chatbots, image generators, and various UI components to craft dynamic, engaging experiences. The toolkit allows for the creation of diverse applications, from games to educational tools, where the interactions are driven by AI and enriched by unique visual and conversational elements.

The core idea behind ImagineKit is to empower users, even those with minimal technical expertise, to leverage cutting-edge AI and blockchain technologies.

## Try it Live:

### Create a flow on Imagine Kit

#### Creating Hadithi AI: African Storytelling Workflow with ImagineKit

![hadithi](https://github.com/user-attachments/assets/dc47e579-56e5-44fe-a1ec-0d5f4a17869b)

This tutorial walks you through building a workflow on ImagineKit that generates African short stories, complete with images and audio. Follow these steps to bring your storytelling experience to life.

##### 1. Set Up the Project

- **Create a New World**: Start by creating a new world in ImagineKit, naming it "Hadithi AI" (or any name that resonates with your project).
- **Add a Trigger Button**: From the **UI Elements** section, drag a **Trigger Button** into your workflow. This button will initiate the storytelling experience.

##### 2. Create the Storytelling Logic

1. **Add an Assistant Node**:

   - Drag the **Assistant** node into the workflow and configure it to act as the storyteller.
   - Set the **Instruction** field to: _"You are a storyteller. Tell intriguing African tales accompanied by images."_
   - (Optional) Upload a knowledge base to provide the Assistant with more context if desired.

2. **Define Inputs and Outputs**:
   - Connect the **Trigger Button** to the **Assistant** node’s input labeled **Run**.
   - Add outputs:
     - **Story**: The main text of the generated story.
     - **Story Image Prompt**: A prompt to generate an image that matches the story’s theme.

##### 3. Display the Story Text

- **Add a Text Output Node**:
  - Drag the **Text Output** node to display the generated story.
  - Connect the `Story` output from the **Assistant** node to the **Text Output** node to show the storytelling result.

##### 4. Convert Text to Speech

1. **Add a Text-to-Speech Node**:

   - Place the **Text-to-Speech** node to convert the story into audio.
   - Connect the `Story` output as the text source to be converted to audio.

2. **Add an Audio Player**:
   - Use the **Audio Player** node to play the generated audio.
   - Connect it to the **Text-to-Speech** node’s audio output.

##### 5. Generate and Display Story Images

1. **Add an Image Generator Node**:

   - Insert the **Image Generator** node to create an image based on the story.
   - Connect it to the `Story Image Prompt` output from the **Assistant** node.
   - Adjust the **Image Generator** settings to align with the storytelling theme.

2. **Add an Image Display Node**:
   - Place an **Image Display** node to show the generated image.
   - Link it to the output from the **Image Generator** node.
  
Your flow should look something like this by now

![Flow](https://github.com/user-attachments/assets/b7e03820-aedc-462e-8424-359543ab0409)

##### 6. Finalize and Publish

- **Test the Workflow**: Click on the **Experience** button to test the storytelling flow.
- **Adjust Configurations**: Make any necessary adjustments to nodes or settings to ensure a smooth experience.
- **Publish the Workflow**: Once satisfied, publish your Hadithi AI experience for users to explore and enjoy.

## How It's Made

ImagineKit is built with a combination of modern web technologies and blockchain integrations:

Frontend and Node-based Editor: Built using Next.js and React Flow, the front-end provides a user-friendly interface where creators can visually design their experiences by connecting various components. React Flow serves as the basis for the node-based editor, allowing users to define and connect inputs, outputs, and interactive elements.

AI Integration: At the moment we are leveraging open AI apis for text generation, image generation, text to speech and speech to text capabilities. our goal is to, in the future, include other models for the different functionalities and let the user choose what model they want to use.

Data Management: MongoDB is used to manage and store off-chain data related to user interactions, experiences, and configuration settings. This allows for efficient data handling and retrieval, ensuring smooth user experiences and quick response times.

Integration and Flexibility: The platform is designed to be extensible, allowing for integration with other third-party services and APIs. The flexibility of ImagineKit allows creators to combine multiple data sources, services, and AI tools to build unique, complex experiences.

## Running Imagine Kit Locally

1. **Install the required packages:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file and configure it according to the provided `env.example`.

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser to play DrawDash locally.

## License

MIT
