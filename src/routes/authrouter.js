import router from 'express';
import * as authController from '../controllers/authcontroller.js';



const   Authrouter = express.Router();    


Authrouter.post('/register', authController.registerUser);
Authrouter.get('/get-me', authController.getMe);
Authrouter.get('/refresh-token', authController.refreshToken);

export default Authrouter;