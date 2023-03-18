import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middlewares/isAuth";
import { doesQuizExist, isValidAttempt, startExam, submitExam } from "../controllers/exam";
import { body } from "express-validator";
import { validateRequest } from "../helper/validateRequest";

// GET /exam/quizId
router.get("/:quizId", isAuthenticated, startExam);

// POST /exam
router.post("/", isAuthenticated,[
    body("quizId")
    .trim()
    .not()
    .isEmpty()
    .custom((quizId)=>{
        return doesQuizExist(quizId)
        .then((status:Boolean)=>{
            if(!status){
                return Promise.reject("Please provide a valid quiz id.");
            }
        })
        .catch((err)=>{
            return Promise.reject(err);
        })
    }),
],validateRequest , submitExam);

export default router;
