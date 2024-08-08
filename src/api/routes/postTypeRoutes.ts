import { Router } from 'express';
import postTypeController from '../controllers/postTypeController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PostTypes
 *   description: Post type management
 */

/**
 * @swagger
 * /api/post-types:
 *   post:
 *     summary: Create a new post type
 *     tags: [PostTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - order
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the post type
 *               description:
 *                 type: string
 *                 description: Description of the post type (optional)
 *               order:
 *                 type: integer
 *                 description: Display order of the post type
 *     responses:
 *       201:
 *         description: Post type created successfully
 *       500:
 *         description: Server error
 */
router.post('/', postTypeController.createPostType);

/**
 * @swagger
 * /api/post-types:
 *   get:
 *     summary: Get all post types
 *     tags: [PostTypes]
 *     responses:
 *       200:
 *         description: A list of post types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostType'
 *       500:
 *         description: Server error
 */
router.get('/', postTypeController.getPostTypes);

/**
 * @swagger
 * /api/post-types/{id}:
 *   get:
 *     summary: Get a single post type by ID
 *     tags: [PostTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post type to retrieve
 *     responses:
 *       200:
 *         description: Post type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostType'
 *       404:
 *         description: Post type not found
 *       500:
 *         description: Server error
 */
router.get('/:id', postTypeController.getPostType);

/**
 * @swagger
 * /api/post-types/{id}:
 *   put:
 *     summary: Update a post type by ID
 *     tags: [PostTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the post type
 *               description:
 *                 type: string
 *                 description: Description of the post type (optional)
 *               order:
 *                 type: integer
 *                 description: Display order of the post type
 *     responses:
 *       200:
 *         description: Post type updated successfully
 *       404:
 *         description: Post type not found
 *       500:
 *         description: Server error
 */
router.put('/:id', postTypeController.updatePostType);

/**
 * @swagger
 * /api/post-types/{id}:
 *   delete:
 *     summary: Delete a post type by ID
 *     tags: [PostTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the post type to delete
 *     responses:
 *       204:
 *         description: Post type deleted successfully
 *       404:
 *         description: Post type not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', postTypeController.deletePostType);

export default router;
