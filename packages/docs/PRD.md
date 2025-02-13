Below is a concise Product Requirements Document (PRD) tailored for your MVP demo. It outlines the high‑level objectives, user flows (via chat), core features (AI evaluation, blockchain payouts), and technical requirements.

---

# Product Requirements Document (PRD)

## 1. Overview

**Product Name:** SpeakToEarn Agent
**Description:**  
A demo platform where users contribute high‑quality text data via a chat-based interface. Contributions are evaluated by an AI (using GPT‑4o with function calling) against preset criteria. If the submission passes, a smart contract on the Celo Alfajores testnet automatically triggers a token payment. The MVP focuses on two tasks:
- Paraphrase a financial report sentence.
- Correct a misstated fact.

## 2. Objectives

- **Data Quality:** Collect diverse, accurate English language contributions (paraphrasing and factual corrections) for language data.
- **Automated Evaluation:** Use GPT‑4o to automatically evaluate submissions with structured, JSON‑formatted outputs.
- **Incentivization:** Automate payouts through a smart contract that releases Celo tokens upon successful evaluation.
- **User Engagement:** Deliver an intuitive, chat‑based user experience that guides contributors through task instructions, submission, evaluation, and feedback.

## 3. Target Audience

- Contributors interested in language data and content creation.
- Early adopters curious about AI evaluation and crypto payouts.
- Developers and testers assessing the integration of AI, blockchain, and chat-based UIs.

## 4. Key Features

### A. Chat-Based Interaction Flow

- **Task Selection:**  
  - The chat greets the user and prompts for task selection (1 for Paraphrase, 2 for Factual Verification).
- **Task Instructions:**  
  - Once a task is selected, the system sends detailed instructions along with a realistic example.
- **User Submission:**  
  - The chat interface collects the user’s text response.
- **Real-Time Feedback:**  
  - After submission, the backend processes the text via GPT‑4o and sends a structured response (Pass/Fail, score, qualitative feedback) back to the chat.
- **Payout Confirmation:**  
  - If the evaluation passes, the system confirms that a smart contract function has been called and displays a payment confirmation.
- **Follow-Up Options:**  
  - The chat asks if the user wants to complete another task.

### B. AI Evaluation Module

- **Functionality:**  
  - Accept a text submission and a task type as inputs.
  - Construct a tailored prompt (including criteria such as accuracy, relevance, coherence, and fluency).
  - Invoke GPT‑4o with function calling to receive structured evaluation (e.g. JSON: `{ decision, score, feedback }`).
- **Output Format:**  
  - Returns a binary decision (Pass/Fail), a numeric score (0–100), and a brief qualitative feedback message.

### C. Smart Contract Payment Module

- **Payment Contract (Solidity):**  
  - **Functions:**  
    - `depositFunds()` – Owner funds the contract.
    - `sendPayment(address recipient, uint256 amount, string memory taskId)` – Called upon a “Pass” evaluation to transfer a fixed token amount.
  - **Events:**  
    - `PaymentSent(address recipient, uint256 amount, string taskId)`
- **Integration:**  
  - The backend calls the smart contract’s payment function upon receiving a “Pass” result.
  - Confirmations are tracked via blockchain events.

## 5. Functional Requirements

- **User Input & Chat Flow:**  
  - Implement a conversational chat interface (no separate dashboard) to guide the user through task selection and submission.
  - The chat must support dynamic messaging and context switching (e.g. “Would you like to try another task?”).
- **Backend Services:**  
  - API endpoint to receive text submissions.
  - Module to call GPT‑4o (with function calling) and parse the structured output.
  - Logic to trigger smart contract payment upon a “Pass.”
- **Blockchain Interaction:**  
  - Deploy a Payment Contract on Celo Alfajores.
  - Backend integration to call `sendPayment()` using a library like ethers.js.
- **Testing & Evaluation:**  
  - Provide sample test cases (see examples below) to verify the evaluation function.
  - Ensure error handling (e.g., short submissions, spam, AI timeouts).

## 6. Non-Functional Requirements

- **Performance:**  
  - The AI evaluation and blockchain payment processes should complete within a few seconds to keep the conversation fluid.
- **Security:**  
  - Secure API endpoints, protect user submissions, and ensure safe interaction with the smart contract.
- **Scalability:**  
  - Design the evaluation module to be extendable (support additional languages or tasks later).
- **Reliability:**  
  - Ensure fallback/error messaging if GPT‑4o or the blockchain transaction fails.

## 7. User Stories

1. **As a contributor,** I want to select a task via chat so that I can contribute quality text data.
2. **As a contributor,** I want to receive clear instructions and examples so that I know how to complete the task correctly.
3. **As a contributor,** I want to see immediate evaluation feedback (pass/fail, score, and suggestions) so that I understand my performance.
4. **As a contributor,** I want to receive a confirmation of token payment if my submission passes, so that I know I’ve earned a reward.
5. **As a contributor,** I want to easily choose to do another task via chat to continue contributing.

## 8. Technical Architecture & Flow

- **Frontend (Chat UI):**  
  - Built using React+Vite.
  - Implements a chat interface that handles user inputs and displays system messages.
- **Backend:**  
  - Receives chat submissions, calls the AI evaluation module (using GPT‑4o with function calling), and triggers smart contract payments.
  - Integrates with ethers.js to interact with the deployed Payment Contract on Celo Alfajores.
- **Blockchain:**  
  - Deployed Payment Contract (with functions to send payment and log events).
- **Integration Flow:**  
  1. User selects a task and submits text via chat.
  2. Backend sends the text to GPT‑4o with a task-specific prompt.
  3. GPT‑4o returns a structured JSON result.
  4. Backend evaluates the result; if “Pass,” it calls `sendPayment(recipient, amount, taskId)`.
  5. Smart contract processes the payment and emits an event.
  6. Backend returns the evaluation result and payment confirmation to the chat UI.
  7. Chat UI displays the result and asks if the user wants another task.

## 9. Sample Test Cases for AI Evaluation

- **Paraphrase Task Example:**  
  - **Input:**  
    > "According to the company's quarterly report, revenue grew by 12% compared to the previous quarter despite a downturn in global markets."  
  - **Expected AI Evaluation:**  
    ```json
    {
      "decision": "Pass",
      "score": 88,
      "feedback": "Your paraphrase accurately captures the original meaning. The sentence is clear and grammatically sound."
    }
    ```
- **Factual Verification Task Example:**  
  - **Input:**  
    > "The capital of Australia is Sydney."  
  - **Expected AI Evaluation:**  
    ```json
    {
      "decision": "Pass",
      "score": 90,
      "feedback": "Correct – The capital of Australia is Canberra. Your explanation is clear and accurate."
    }
    ```

## 10. Milestones & Timeline

- **Week 1:**  
  - Set up project environment, deploy Payment Contract on Celo Alfajores.
- **Week 2:**  
  - Build and test AI evaluation module with GPT‑4o integration.
- **Week 3:**  
  - Integrate backend payment trigger logic and simulate token transfers.
- **Week 4:**  
  - Develop and test the chat-based flow for task selection, submission, and evaluation.
- **Week 5:**  
  - End-to-end testing and documentation.

## 11. Success Metrics

- **Functional:**  
  - 90%+ of valid submissions receive correct AI evaluations.
  - Successful token transfers logged on-chain for approved tasks.
- **User Experience:**  
  - Chat flow response time under 5 seconds per step.
  - Positive qualitative user feedback in demo trials.
- **System Reliability:**  
  - Minimal errors in integration between chat UI, AI evaluation, and blockchain payment.

## 12. Risks & Dependencies

- **AI Evaluation Consistency:**  
  - Mitigate by refining prompts and testing with multiple examples.
- **Blockchain Transaction Delays:**  
  - Use testnet and monitor event logs; implement fallback messages.
- **Integration Complexity:**  
  - Ensure modular design so that AI, backend, and blockchain layers can be updated independently.

---

This PRD should serve as a comprehensive guide for setting up your MVP demo using a chat-based interface with two tasks, AI evaluation via GPT‑4o function calling, and Celo smart contract payments—all without relying on a separate dashboard.