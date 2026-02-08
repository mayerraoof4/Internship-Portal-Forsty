import { Router } from "express";
import InternshipApplicationsController from "../controllers/job-applications.controller";
import { asyncWrapper } from "../helpers/async-wrapper";

export default class InternshipApplicationsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/applications",
      asyncWrapper(InternshipApplicationsController.getUserApplications)
    );
    this.router.post(
      "/:internshipId/apply",
      asyncWrapper(InternshipApplicationsController.applyForInternship)
    );
    this.router.get(
      "/:internshipId/applications",
      asyncWrapper(InternshipApplicationsController.getInternshipApplications)
    );
    this.router.put(
      "/applications/:applicationId",
      asyncWrapper(InternshipApplicationsController.updateInternshipApplication)
    );
  }
}
