import express from "express";
import { isAuthenticated } from "../middlewares/isAuth";

import { getReport ,getStudentQuizScore} from "../controllers/report";

const router = express.Router();

//GET /report/:reportId
router.get("/:reportId?", isAuthenticated, getReport);


router.get("/report/getStudentQuizScore", isAuthenticated, getStudentQuizScore);


router.post("/teacher", isAuthenticated, getReport);

export default router;
