import { Router } from "express";
import {
  getDepartment,
  listDepartments,
} from "../controllers/departmentsController";

export const router = Router();

router.get("/", listDepartments);
router.get("/:id", getDepartment);

