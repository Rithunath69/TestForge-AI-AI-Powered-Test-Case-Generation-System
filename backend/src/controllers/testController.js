// import { generateTestCasesService } from "../services/aiservice.js";
// import { generateCSV } from "../utils/csvGenerator.js";

// /*
// WHY CONTROLLERS EXIST:
// - handle request/response
// - keep API logic clean
// - connect routes → services
// */

// const generateTestCases = async (req, res) => {
//   try {
//     const {
//       input,
//       modules,
//       purpose,
//       uielements,
//       Api,
//       type,
//       coverage,
//     } = req.body;

//     // validation
//     if (!input) {
//       return res.status(400).json({
//         success: false,
//         error: "Input is required",
//       });
//     }

//     // 🔥 HARD SAFETY TIMEOUT (prevents server freeze)
//     const timeout = new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("Request timeout")), 240000)
//     );

//     // 🔥 race LLM call vs timeout
//     const result = await Promise.race([
//       generateTestCasesService({
//         input,
//         modules,
//         purpose,
//         uielements,
//         Api,
//         type,
//         coverage,
//       }),
//       timeout,
//     ]);

//     const csv = await generateCSV(result);

//     return res.status(200).json({
//       success: true,
//       data: csv,
//     });

//   } catch (error) {
//     console.error("Controller error:", error.message);

//     return res.status(500).json({
//       success: false,
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

// export { generateTestCases };
import { generateTestCasesService } from "../services/aiservice.js";
import { generateCSV } from "../utils/csvGenerator.js";

const generateTestCases = async (req, res) => {
  let finished = false;

  try {
    const {
      input,
      modules,
      purpose,
      uielements,
      Api,
      type,
      coverage,
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Input is required",
      });
    }

    // 🔥 HARD SAFETY TIMEOUT (prevents server freeze)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout (LLM took too long)"));
      }, 240000);
    });

    // 🔥 LLM CALL
    const llmPromise = generateTestCasesService({
      input,
      modules,
      purpose,
      uielements,
      Api,
      type,
      coverage,
    });

    // 🔥 RACE CONDITION (IMPORTANT FIX)
    const result = await Promise.race([llmPromise, timeoutPromise]);

    finished = true;

    const csv = await generateCSV(result);

    return res.status(200).send(csv);

  } catch (error) {
    console.error("Controller error:", error.message);

    // 🔥 IMPORTANT: prevent hanging response
    if (!finished) {
      return res.status(500).json({
        success: false,
        error: error.message || "LLM failed or timed out",
      });
    }

    // fallback safety
    return res.status(500).json({
      success: false,
      error: "Unexpected error",
    });
  }
};

export { generateTestCases };