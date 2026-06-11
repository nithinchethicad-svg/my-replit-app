import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generatorRouter from "./generator";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/generator", generatorRouter);

export default router;
