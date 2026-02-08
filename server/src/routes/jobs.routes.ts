import { Router } from "express";
import InternshipsController from "../controllers/jobs.controller";
import { asyncWrapper } from "../helpers/async-wrapper";

export default class InternshipsRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", asyncWrapper(InternshipsController.getInternships));
    this.router.post("/", asyncWrapper(InternshipsController.createInternship));
    this.router.get("/:id", asyncWrapper(InternshipsController.getInternship));
    this.router.put("/:id", asyncWrapper(InternshipsController.updateInternship));
    this.router.delete("/:id", asyncWrapper(InternshipsController.deleteInternship));
  }
}
