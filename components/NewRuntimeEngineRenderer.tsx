import { FC, useCallback, useEffect, useState } from "react";
import TextInput from "./imaginekit/ui/textinput/TextInput";
import { RuntimeEngine } from "./NewRuntimeEngine";
import { useForm, UseFormReturn } from "react-hook-form";
import { find, findIndex, get, set } from "lodash";
import ky from "ky";
import { Form } from "./ui/form";
import TextOutput from "./imaginekit/ui/textoutput/TextOutput";

const renderUIComponent: FC<{
  component: any;
  node: any;
  form: UseFormReturn;
}> = ({ component, form, node }): React.ReactNode => {
  switch (component.type) {
    case "textInput":
      return <TextInput node={node} form={form} />;
    case "textOutput":
      return <TextOutput node={node} form={form} />;

    default:
      return <div>Unsupported component type: {component.type}</div>;
  }
};

export function useRuntimeEngine(appId?: string) {
  const [engine, setEngine] = useState<RuntimeEngine>(new RuntimeEngine());
  const [uiComponents, setUIComponents] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (appId) {
      engine
        .load(appId)
        .then(() => {
          engine.compile();
        })
        .then(() => {
          setIsReady(true);
        });
      const uiComponents = ky
        .get(`/api/uicomponents?appId=${appId}`)
        .json<any>()
        .then((_) => setUIComponents(_));
    }
  }, []);

  const form = useForm({});

  useEffect(() => {
    const subscription = form.watch((value, info) => {
      // We can try something like each node is an object and has nested inputs
      // like and llm node would be:
      // {
      // 	[node.id]: {
      // 		"input1": "value1",
      // 		"input2": "value2"
      // 	}
      // }

      const { name, type, values } = info;

      if (name && type == "change") {
        const [node_id, label_id] = name?.split(".") || [];
        const inputValue = get(values, name);

        // Get the node

        const node = find(engine?.nodes, { state: { node_id } });
        if (!node) {
          return;
        }

        // Get the inputs
        const input = { [label_id]: inputValue };

        // Set the node's input values
        // Run the node
        node.setInputs((prevInputs) => {
          //   const prevInputs = [..._];
          let label;
          if ("label" in input) {
            label = input.label;
          } else {
            label = Object.keys(input)[0];
          }

          if (!prevInputs) {
            return [input];
          }

          const index = findIndex(prevInputs, (input) => {
            if ("label" in input) {
              return label == input.label;
            } else {
              return label == Object.keys(input)[0];
            }
          });

          if (index > -1) {
            prevInputs?.splice(index, 1, input);
          } else {
            prevInputs?.push(input);
          }

          return [...prevInputs];
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  //   engine?.nodes.forEach((node) => {
  //     form.watch(node.state.node_id);
  //   });

  // form.register("node_id.label_id")

  const renderer = useCallback(() => {
    const onSubmit = useCallback(() => {
      engine?.run();
    }, [engine]);

    if (!isReady) {
      return <div></div>;
    }

    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          className=""
          style={{
            position: "relative", // Makes children position relative to this parent
            width: "600px", // Set width based on your design
            height: "400px", // Set height based on your design
          }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onReset={() => form.reset()}
            >
              {uiComponents.map((component) => {
                const position = component.position;
                console.log(engine.nodes);
                console.log(component.component_id);
                console.log(
                  find(engine.nodes, {
                    state: { node_id: component.component_id },
                  })
                );
                return (
                  <div
                    key={component.component_id}
                    style={{
                      position: "absolute",
                      left: position.x,
                      top: position.y,
                      width: position.width,
                      height: position.height,
                    }}
                  >
                    {renderUIComponent({
                      component,
                      node: find(engine.nodes, {
                        state: { node_id: component.component_id },
                      }),
                      form,
                    })}
                  </div>
                );
              })}
            </form>
          </Form>
        </div>
      </div>
    );
  }, [engine, uiComponents, form, isReady]);

  return [form, engine, renderer] as const;
}
