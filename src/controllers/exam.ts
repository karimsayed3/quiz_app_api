import { RequestHandler } from "express";

import Quiz from "../models/quiz";
import Report from "../models/report";

import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";
import { Mongoose } from "mongoose";
import { validationResult } from "express-validator";
import User from "../models/user";

const startExam: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questions_list: 1,
      timer: 1,
      is_published: 1,
    });


    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    if (!quiz.is_published) {
      const err = new ProjectError("Quiz is not published!");
      err.statusCode = 405;
      throw err;
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz",
      data: quiz,
    };
    res.status(200).send(resp);
   
  } catch (error) {
    next(error);
  }
};

const submitExam: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.body.quizId;
    const attempted_question = req.body.attempted_question;

    const quiz = await Quiz.findById(quizId, { answers: 1 });
    const quiz2 = await Quiz.findById(quizId);
    const user = await User.findById(req.userId);
    const teacher = await User.findById(quiz2!.created_by);

    const teacherName = teacher!.name;

    const quizName = quiz2!.name;
    const createdBy = quiz2!.created_by;
    const studentName = user!.name;

    const answers = quiz!.answers;

    const userId = req.userId;
    const allQuestions = Object.keys(answers);
    const total = allQuestions.length;

    let score = 0;

    for (let i = 0; i < total; i++) {
      let question_number = allQuestions[i];
      if (
        !!attempted_question[question_number] &&
        answers[question_number] == attempted_question[question_number]
      ) {
        score = score + 1;
      }
    }



    let kk = await Report.find({quizId: quizId,userId : req.userId});
   
 
     if (kk.length === 0) {
      const report = new Report({ userId, quizId, score, total, quizName, createdBy, studentName, teacherName });
      const data = await report.save();
      const resp: ReturnResponse = {
        status: "success",
        message: "Quiz submitted",
        data: { total, score, ReportId: data._id },
      };
      res.status(200).send(resp);
   
     }
     else {
       const err = new ProjectError("you have tested yourself before!");
       err.statusCode = 401;
       throw err;
     }
 


  } catch (error) {
    next(error);
  }
};

const doesQuizExist = async (quizId: Mongoose["Types"]["ObjectId"]) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz)
    return false;
  return true;
}


const isValidAttempt = async (attempted_question: {}, quizId: Mongoose["Types"]["ObjectId"]) => {
  const quiz = await Quiz.findById(quizId);
  const answers = quiz!.answers;
  const questions = Object.keys(answers);
  const attemptQ = Object.keys(attempted_question);
  if (attemptQ.length != questions.length)
    return false;

  let flag = 0;
  attemptQ.forEach((e) => {
    if (questions.indexOf(e) < 0) {
      flag = 1;
    }
  });
  if (flag) {
    return false;
  }
  return true;
}

export { startExam, submitExam, doesQuizExist, isValidAttempt };
