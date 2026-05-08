// import { Mistral } from "@mistralai/mistralai";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
// const mistral = new Mistral({
//   apiKey: process.env.API_KEY,
//   timeout: 240000,
// });
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// ⚡ MODEL CREATION (fixed scope usage)
const createGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
};
console.log("hi",process.env.API_KEY)

export const generateTestCasesService = async ({
  input,
  modules,
  purpose,
  uielements,
  Api,
  type,
  coverage,
}) => {

  const prompt = `
You are a Senior QA Engineer.

Generate professional software test cases.

Application Requirement:
${input}

Feature or Module Names:
${modules}

Feature Description:
${purpose}

UI Elements:
${uielements}

API Endpoints:
${Api}

Testing Environment:
${type}

Required Coverage:
${coverage}

Generate:
1. Functional Test Cases
2. Negative Test Cases
3. Positive Test Cases
4. Edge Cases
5. UI Validation Cases
6. API Validation Cases (if APIs exist)
7. Client/Server Test Cases
8. Security Test Cases
9. Performance Test Cases

Return structured professional QA test cases.
Output Format (CSV/Excel-friendly):
ID,Title,Description,Precondition,Test Steps,Expected Result,Priority,Test Type,Test Data,Notes,Automation Status

Example:
TC-001,Successful Login,Verify login with valid credentials,User on login page,1. Enter email: test@example.com <br> 2. Enter password: Secure123! <br> 3. Click Login,Redirect to dashboard,P1,Positive,Email: test@example.com | Password: Secure123!,,Automated

Constraints:
Columns: Separated by commas (,).
Line Breaks Within a Cell: Use <br> (e.g., "Step 1<br>Step 2").
Separating Test Data: Use | (e.g., "Email: user@example.com | Password: pass123").
ID: Unique (e.g., TC-001).
Priority: P1 (Critical), P2 (High), P3 (Medium), P4 (Low).
Test Type: Positive, Negative, Edge Case, API, UI, Security, Performance.
Automation Status: Automated, Manual, To Be Automated.
Instructions:

Generate Maximum Test cases.
Cover all critical paths.
Ensure all columns are filled (use "N/A" if not applicable).
Use consistent formatting for easy copy-paste.
IMPORTANT:
Return ONLY valid JSON.

Format:
[
  {
    "id": "TC-001",
    "title": "Successful Login",
    "description": "Verify login with valid credentials",
    "precondition": "User is on login page",
    "steps": [
      "Enter valid email",
      "Enter valid password",
      "Click login"
    ],
    "expectedResult": "User redirected to dashboard",
    "priority": "P1",
    "testType": "Positive",
    "testData": "email=test@test.com,password=123456",
    "automationStatus": "Automated"
  }
]

Rules:
- Return ONLY JSON
- No need of any introduction and closing statements just the output json in correct format is needed don't any single word other than that
`;
console.log("above model")
  // const response =
  //   await mistral.chat.complete({
  //     model: "mistral-small-latest",
  //     messages: [
  //       {
  //         role: "user",
  //         content: prompt,
  //       },
  //     ],
  //   });

    

  // return response.choices[0].message.content;
 try {
    // ⚡ CREATE MODEL INSIDE FUNCTION (important for stability)
    const model = createGeminiModel();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;

    return response.text();

  } catch (err) {
    console.error("Gemini error:", err);
    throw new Error("LLM failed");
  }
};
// 