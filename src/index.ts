// Req -> Get Json -> Create State Machine -> Run State Machine -> Get Response -> Send Response

import { HandlerContext, run } from "@xmtp/message-kit";
import EventEmitter from "events";
import { get } from "lodash-es";
import OpenAI from "openai";

// Engine

interface State {
  endAtStart: boolean;
  loop: boolean;
  flow: Array<{ id: string; props: any[]; module?: any }>;
}
class LLM {
  private openai;
  private input: undefined | string = undefined;

  constructor(private systemPrompt: string) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async useInput(input: string) {
    console.log(`LLM < ${input}`);
    this.input = input;
    // this.output = request();
  }

  async getOutput() {
    if (!this.input) {
      return undefined;
    }
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: this.systemPrompt,
        },
        { role: "user", content: this.input },
      ],
      temperature: 1,
      max_tokens: 1600,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    const story = (response.choices[0].message.content as any)["story"];

    console.log(`LLM > ${response.choices[0].message.content}`);
    return (
      response.choices[0].message.content &&
      JSON.parse(response.choices[0].message.content)
    );
  }
}

class Accessor {
  private value: any;
  constructor(private key: string) {}

  async useInput(input: string) {
    console.log(`Accessor < ${input}`);
    this.value = get(input, this.key);
  }

  async getOutput() {
    console.log(`Accessor > ${this.value}`);
    return this.value;
  }
}

class Bot {
  private context: HandlerContext | undefined;

  private eventEmitter: EventEmitter = new EventEmitter();
  private runPromise;

  constructor() {
    this.runPromise = run(async (context: HandlerContext) => {
      this.context = context;
      this.eventEmitter.emit("message", context);
    });
  }

  async getOutput() {
    return new Promise((resolve) => {
      this.eventEmitter.once("message", (context: HandlerContext) => {
        console.log(`Bot > ${context?.message.content.content}`);
        resolve(context?.message.content.content);
      });
    });
  }

  async useInput(input: string) {
    console.log(`Bot < ${input}`);
    return await this.context?.reply(input);
  }
}

class Constant {
  constructor(private value: string) {}

  async getOutput() {
    console.log(`Constant > ${this.value}`);
    return this.value;
  }

  async useInput(input?: string) {
    input && (this.value = input);
    console.log(`Constant < ${this.value}`);
    return this.value;
  }
}

const ModuleMap = {
  bot: Bot,
  constant: Constant,
  llm: LLM,
  accessor: Accessor,
};

class Machine {
  constructor(private state: State) {}

  async resolve() {
    while (this.state.loop) {
      console.log(this.state.flow);
      let resolution = this.state.flow.reduce((acc, curr: any) => {
        return acc.then(async (val) => {
          curr.module ||= new ((ModuleMap as any)[curr.id] as any)(
            ...curr.props
          );
          if (val) {
            await curr.module.useInput(val);
          }
          return await curr.module.getOutput();
        });
      }, Promise.resolve(undefined));

      if (this.state.endAtStart) {
        resolution = resolution.then(async (val) => {
          return await this.state.flow[0].module.useInput(val);
        });
      }
      await resolution;
    }
  }
}

const state: State = {
  endAtStart: true,
  loop: true,
  flow: [
    {
      id: "bot",
      props: [{}],
    },
    {
      id: "llm",
      props: [
        "You are an assistant whose goal is to generate stories. \
		  The format of your JSON response as given in the example below:\
        {\
          'story': 'Once upon a time',\
        }\
		Generate a story that is related to the theme given.",
      ],
    },
    {
      id: "accessor",
      props: ["story"],
    },
    // { id: "constant", props: ["Hello"] },
  ],
};

import express from "express";
import ky from "ky";

const app = express();
const port = 3200;

let botPromise;
let bot: Bot;

app.use(express.json());

app.post("/xmtp", (req, res) => {
  bot = new Bot();
  const body = req.body;
  botPromise = new Promise(async (res) => {
    while (true) {
      const output = await bot.getOutput();
      // send a request to Engine, response is the input
      const { response } = await ky
        .post("http://localhost:3000/api/xmtp", {
          json: { appId: body.appId, input: output },
          timeout: false,
        })
        .json<{ response: string }>();

      await bot.useInput(response);
    }
  });
  res.send("Bot listening");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const machine = new Machine(state);

// machine.resolve();

// function module(privateKey: string = "") {
//   const wallet = new Wallet("");

//   process.env.KEY = wallet.privateKey;
// 	process.env.XMTP_ENV = "dev";

// 	// Gets all the messages from the conversation

//   run(async (context: HandlerContext) => {
//     const {
//       client,
//       message: {
//         content: { content: text },
//         typeId,
//         sender,
//       },
//     } = context;

//     //   {text}   ->  {interface}
// 	// User Input -> Default Output

//     // {response} <-  {interface}
//     //    User    <- Bot Output

//     await context.reply("Test");
//     return;
//   }, {});
// }
