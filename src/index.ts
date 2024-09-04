// Req -> Get Json -> Create State Machine -> Run State Machine -> Get Response -> Send Response

import { HandlerContext, run } from "@xmtp/message-kit";

// Engine

interface State {
  endAtStart: boolean;
  loop: boolean;
  flow: Array<{ id: string; props: any[]; module?: any }>;
}

const state: State = {
  endAtStart: true,
  loop: true,
  flow: [
    {
      id: "bot",
      props: [{}],
    },
    { id: "constant", props: ["Hello"] },
  ],
};

// class LLM {
// 	private endpoint = ""
// 	output = ""
// 	constructor() {

// 	}

// 	private request() {
// 		return fetch(this.endpoint)
// 	}

// 	async useInput(input: string) {
// 		this.output = request()
// 	}

// 	getOutput() {
// 		return this.output;
// 	}
// }

class Bot {
  private context: HandlerContext | undefined;

  constructor() {}

  async getOutput() {
    return new Promise((resolve) => {
      run(async (context: HandlerContext) => {
        this.context = context;
        console.log(`Bot > ${this.context?.message.content.content}`);
        resolve(this.context?.message.content.content);
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
};

class Machine {
  constructor(private state: State) {}

  async resolve() {
    while (state.loop) {
      console.log(state.flow);
      let resolution = state.flow.reduce((acc, curr: any) => {
        return acc.then(async (val) => {
          curr.module = new ((ModuleMap as any)[curr.id] as any)();
          if (val) {
            await curr.module.useInput(val);
          }
          return await curr.module.getOutput();
        });
      }, Promise.resolve(undefined));

      if (state.endAtStart) {
        resolution = resolution.then(async (val) => {
          return await state.flow[0].module.useInput(val);
        });
      }
      await resolution;
    }
  }
}

const machine = new Machine(state);

machine.resolve();

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
