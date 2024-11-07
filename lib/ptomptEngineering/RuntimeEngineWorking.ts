export const RuntimeEngineWorking = `
Node Execution Flow in the RuntimeEngine:
1. Node Activation:
    * A node becomes ready to execute when it receives the necessary input data or an event triggers it (e.g., a user clicks a button).
    * It is added to the nodeExecutionStack, ensuring it's scheduled for execution while preventing duplicates.
2. Execution Loop:
    * The system processes each node in the nodeExecutionStack sequentially.
    * Each node is removed from the stack before execution to avoid reprocessing.
3. Node Processing:
    * The node performs its specific function based on its type (e.g., generates text, creates an image).
    * It processes its inputs and produces outputs accordingly.
    * The node updates its internal outputs with the results.
4. Data Propagation:
    * The node's outputs are passed to all connected nodes via edges.
    * For each connected node:
        * The corresponding input fields are updated with the data from the current node's outputs.
        * The connected node is added to the nodeExecutionStack if it's not already scheduled for execution.
5. Recursive Execution:
    * Steps 2 to 4 repeat for each new node added to the stack.
    * This continues recursively until the nodeExecutionStack is empty, ensuring all dependent nodes execute in the correct order.
6. Completion:
    * The execution flow concludes when all nodes have been processed and data has fully propagated through the network.
    * Final outputs are available in their respective nodes, and the application reflects all updates.
`;
