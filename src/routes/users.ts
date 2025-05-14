import { Router } from "express";
import { getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser } from "../controllers/users";
import { celebrate } from "celebrate";
import { updateAvatarSchema, updateUserSchema, userIdSchema } from "middlewares/validators";

const router = Router();

router.get('/', getUsers);

router.get('/me', getCurrentUser)

router.get('/:userId', celebrate({params: userIdSchema}) ,getUserById);

router.patch('/me', celebrate({body: updateUserSchema}) ,updateUser);

router.patch('/me/avatar', celebrate({body: updateAvatarSchema}) ,updateUserAvatar);

export default router;