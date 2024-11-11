# Imagine Kit

A toolkit for creating and monetizing engaging AI-powered onchain experiences.

## Project Description

ImagineKit is a comprehensive toolkit designed for creators to build and monetize interactive AI-driven experiences on-chain. With an intuitive drag-and-drop interface, users can seamlessly connect AI chatbots, image generators, and various UI components to craft dynamic, engaging experiences. The toolkit allows for the creation of diverse applications, from games to educational tools, where the interactions are driven by AI and enriched by unique visual and conversational elements.

The core idea behind ImagineKit is to empower users, even those with minimal technical expertise, to leverage cutting-edge AI and blockchain technologies.

## How It's Made

ImagineKit is built with a combination of modern web technologies and blockchain integrations:

Frontend and Node-based Editor: Built using Next.js and React Flow, the front-end provides a user-friendly interface where creators can visually design their experiences by connecting various components. React Flow serves as the basis for the node-based editor, allowing users to define and connect inputs, outputs, and interactive elements.

AI Integration: At the moment we are leveraging open AI apis for text generation, image generation, text to speech and speech to text capabilities. our goal is to, in the future, include other models for the different functionalities and let the user choose what model they want to use.

Data Management: MongoDB is used to manage and store off-chain data related to user interactions, experiences, and configuration settings. This allows for efficient data handling and retrieval, ensuring smooth user experiences and quick response times.

Integration and Flexibility: The platform is designed to be extensible, allowing for integration with other third-party services and APIs. The flexibility of ImagineKit allows creators to combine multiple data sources, services, and AI tools to build unique, complex experiences.

## Running DrawDash Locally

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
