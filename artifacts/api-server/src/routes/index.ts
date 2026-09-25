import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vaultCapturesRouter from "./vault-captures";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vaultCapturesRouter);

export default router;
