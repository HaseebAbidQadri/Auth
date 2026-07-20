import router from 'express';
import * as authController from '../controllers/authcontroller.js';



const   Authrouter = express.Router();    


Authrouter.post('/register', authController.registerUser);
