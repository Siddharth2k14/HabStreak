1. **Define the Specs: Before coding, clearly explain to the AI exactly what needs to be built, how it should be built, what to avoid, and which edge cases to handle. A detailed specification reduces AI hallucination.**
2. **Manage Context: Create a specific file (e.g., agents.md or a project rules file) that defines your project's architectural rules. This prevents the AI from losing track or suffering from "context collapse."**
3. **Read the Diffs: This is non-negotiable. Always review the code changes (diffs) that the AI generates, especially in sensitive areas like authentication and data access controls, to catch errors early.**
4. **Test Everything: Never ship code without testing. You must verify that your logic holds, such as ensuring logged-in users can access their data while unauthorized users cannot. This final check is boring but essential to prevent security disasters.**

