# Imagine Kit

A toolkit for creating and monetizing engaging AI-powered onchain experiences.

## Project Description

ImagineKit is a comprehensive toolkit designed for creators to build and monetize interactive AI-driven experiences on-chain. With an intuitive drag-and-drop interface, users can seamlessly connect AI chatbots, image generators, and various UI components to craft dynamic, engaging experiences. The toolkit allows for the creation of diverse applications, from games to educational tools, where the interactions are driven by AI and enriched by unique visual and conversational elements.

The core idea behind ImagineKit is to empower users, even those with minimal technical expertise, to leverage cutting-edge AI and blockchain technologies. ImagineKit also includes a token-gating mechanism, implemented via Solidity smart contracts, allowing creators to monetize their experiences. This feature ensures that only users with the required tokens can access certain experiences, adding a layer of exclusivity and potential revenue generation for creators.

## How It's Made

ImagineKit is built with a combination of modern web technologies and blockchain integrations:

Frontend and Node-based Editor: Built using Next.js and React Flow, the front-end provides a user-friendly interface where creators can visually design their experiences by connecting various components. React Flow serves as the basis for the node-based editor, allowing users to define and connect inputs, outputs, and interactive elements.

AI Integration: Galadriel powers the AI assistants integrated into ImagineKit, enabling natural language processing and understanding for chatbot components. For image generation, the platform leverages custom AI models capable of producing unique and contextually relevant visuals.

Chat Interface: ImagineKit uses XMPt MessageKit in combination with Converse to create a seamless chat interface, allowing end-users to interact with AI-driven bots in real time. This interaction can be customized further depending on the experience being created.

Blockchain and Token Gating: ImagineKit includes a token-gating mechanism powered by a Solidity smart contract. This feature is built on an Ethereum-compatible blockchain, allowing creators to restrict access to their experiences based on token ownership. This creates an ecosystem where experiences can be monetized, and users can earn from their creations.

Data Management: MongoDB is used to manage and store off-chain data related to user interactions, experiences, and configuration settings. This allows for efficient data handling and retrieval, ensuring smooth user experiences and quick response times.

Integration and Flexibility: The platform is designed to be extensible, allowing for integration with other third-party services and APIs. The flexibility of ImagineKit allows creators to combine multiple data sources, services, and AI tools to build unique, complex experiences.

## Smart Contracts

**AssistantBot** contract deployed to 0xBeA27901a93469fd0F096F3150E56511C186983f - Galadriel Devnet

**ImagineKitRegistry** contract deployed to 0xe222dfCD63076757Ed009EDC0C8a5A71f788DD31 - Chhills Spicy testnet

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

