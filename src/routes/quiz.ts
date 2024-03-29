import express from "express";
import { body } from "express-validator";

import { isAuthenticated } from "../middlewares/isAuth";
import {validateRequest} from "../helper/validateRequest";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  isValidQuiz,
  closeQuiz,
  getPublishQuiz,
  getNotPublishQuiz
} from "../controllers/quiz";


const router = express.Router();

// create
// POST /quiz/
router.post(
  "/",
  isAuthenticated,
  [
    body("questions_list").custom((questions_list, { req }) => {
      return isValidQuiz(questions_list, req.body["answers"])
        .then((status: Boolean) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz having atleast one question, and answers with correct options!"
            );
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
  ],
  validateRequest,
  createQuiz
);

// get
// GET /quiz/:quizId
router.get("/:quizId", isAuthenticated, getQuiz);

router.get("/quiz/getPublishQuiz", isAuthenticated, getPublishQuiz);


router.get("/quiz/getNotPublishQuiz", isAuthenticated, getNotPublishQuiz);

//

//update
//PUT /quiz
router.put(
  "/",
  isAuthenticated,
  [
    body("questions_list").custom((questions_list, { req }) => {
      return isValidQuiz(questions_list, req.body["answers"])
        .then((status: Boolean) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz having atleast one question, and answers with correct option!"
            );
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
  ],
  validateRequest,
  updateQuiz
);

router.patch(
  "/cancel",
  isAuthenticated,
  closeQuiz
);

//Delete
//DELETE quiz/:quizId
router.delete("/:quizId", isAuthenticated, deleteQuiz);

//Publish
// PATCH quiz/publish
router.patch("/publish", isAuthenticated, publishQuiz);

export default router;
