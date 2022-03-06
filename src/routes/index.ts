import fp from "fastify-plugin";
import assignmentService from "./assignment/assignment.service";
import authService from "./auth/auth.service";
import classService from "./class/class.service";
import courseService from "./course/course.service";
import departmentService from "./department/department.service";
import feedbackCategoryService from "./feedback-category/feedback-category.service";
import feedbackService from "./feedback/feedback.service";
import submissionService from "./submission/submission.service";
import userService from "./user/user.service";

export const routeServices = fp(async (server) => {
  server.register(departmentService);
  server.register(userService);
  server.register(authService);
  server.register(classService);
  server.register(courseService);
  server.register(assignmentService);
  server.register(feedbackCategoryService);
  server.register(feedbackService);
  server.register(submissionService);
});

export { default as assignmentRoute } from "./assignment/assignment.controller";
export { default as authRoute } from "./auth/auth.controller";
export { default as classRoute } from "./class/class.controller";
export { default as courseRoute } from "./course/course.controller";
export { default as departmentRoute } from "./department/department.controller";
export { default as feedbackCategoryRoute } from "./feedback-category/feedback-category.controller";
export { default as feedbackRoute } from "./feedback/feedback.controller";
export { default as submissionRoute } from "./submission/submission.controller";
export { default as userRoute } from "./user/user.controller";
