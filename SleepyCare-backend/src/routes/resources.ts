import { NextFunction, Router, Request, Response } from "express";

import { addResource, getAllResource, getResourceById, updateResourceById, deleteResource } from "../controllers/resources";

const router = Router()

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void;

router.post("/", addResource as RouteHandler)
router.get("/", getAllResource as RouteHandler)
router.get("/:id", getResourceById as RouteHandler)
router.put("/:id", updateResourceById as RouteHandler)
router.delete("/:id", deleteResource as RouteHandler)


export default router;