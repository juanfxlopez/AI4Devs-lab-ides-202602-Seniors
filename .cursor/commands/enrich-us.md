Analyze and fix the following user story ticket: $ARGUMENTS.

Note: The user story ticket can be given either using Jira MCP or directly on the chat. 
In case the user story ticket is given directly, there is no need to connect Jira MCP.

Follow these steps:

1. If the story was fetched from Jira MCP, use Jira MCP to get the ticket details, whether it is the ticket id/number, keywords referring to the ticket or indicating status, like "the one in progress"
2. You will act as a product expert with technical knowledge
3. Understand the problem described in the ticket
4. Decide whether or not the User Story is completely detailed according to product's best practices: Include a full description of the functionality, a comprehensive list of fields to be updated, the structure and URLs of the necessary endpoints, the files to be modified according to the architecture and best practices, the steps required for the task to be considered complete, how to update any relevant documentation or create unit tests, and non-functional requirements related to security, performance, etc
5. If the user story lacks the technical and specific detail necessary to allow the developer to be fully autonomous when completing it, provide an improved story that is clearer, more specific, and more concise in line with product best practices described in step 4. Use the technical context you will find in 
@documentation. Return it in markdown format.
6. If the story was fetched from Jira MCP, update the Jira ticket by appending the new content after the old one and mark each section with h2 tags [original] and [enhanced]. Apply proper formatting (lists, code snippets, etc.).
7. If the story was fetched from Jira MCP and the ticket status is "To refine", move it to "Pending refinement validation".
8. If the story is provided directly (no Jira MCP), return only the enhanced Markdown in chat and skip Jira update/transition steps.