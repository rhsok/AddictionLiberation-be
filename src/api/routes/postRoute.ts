import { Router } from 'express';
import postController from '../controllers/postController';

const router: Router = Router();

router.post('/posts', postController.createPost);
router.get('/post/:id', postController.getPostById);
router.put('posts/:id', postController.updatePostContent);
