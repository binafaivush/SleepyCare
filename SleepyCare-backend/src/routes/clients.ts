import { Router } from "express";

import { getClients,addClient,deleteClient,updateClient, getClientsByUserID,getClientsByCounselorID} from "../controllers/clients";
import checkCounselor from "../middlewares/checkCounselor";
 
const clientRouter = Router()

clientRouter.get("/parent/:user_id", getClientsByUserID);
clientRouter.get("/counselor/:counselor_id",
    // checkCounselor,
     getClientsByCounselorID);
clientRouter.get("/", getClients);
clientRouter.post("/", addClient);
clientRouter.delete("/:id",deleteClient);
clientRouter.put("/:id",updateClient);

export default clientRouter;