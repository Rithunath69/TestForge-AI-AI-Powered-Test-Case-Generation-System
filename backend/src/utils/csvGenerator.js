import { Parser } from "json2csv";

export const generateCSV = (data) => {

  // Remove markdown wrappers
  const cleanedResponse = data
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Convert string → JSON
  const parsedData = JSON.parse(cleanedResponse);

  // CSV columns
  const fields = [
    "id",
    "title",
    "description",
    "precondition",
    "steps",
    "expectedResult",
    "priority",
    "testType",
    "testData",
    "automationStatus",
  ];

  // Format steps array
  const formattedData = parsedData.map((item) => ({
    ...item,
    steps: Array.isArray(item.steps)
      ? item.steps.join(" | ")
      : item.steps,
  }));

  // Convert JSON → CSV
  const json2csvParser = new Parser({
    fields,
  });

  return json2csvParser.parse(formattedData);
};