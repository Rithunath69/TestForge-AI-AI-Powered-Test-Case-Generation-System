    import express from "express";
    import { generateTestCases } from "../controllers/testController.js";

    const router = express.Router();
    /*
    WHY ROUTES EXIST:
    - define API endpoints
    - keep URL structure clean
    - separate HTTP layer from logic
    */

    router.post("/generate", generateTestCases);

    export default router;