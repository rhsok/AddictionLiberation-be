import { Router } from 'express';
import CategoryController from '../controllers/categoryController';
const router: Router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: integer
 *          description: The auto-generated id of category
 *        name:
 *          type: string
 *          description: the name of the category.
 *        description:
 *          type: string
 *          description: The description of the category.
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: The date when the category was created.
 *        updatedAt:
 *          type: string;
 *          format: date-time
 *          description: The date when the category was alst updated.
 */

/**
 * @swagger
 * tag:
 *  name: Categories
 *  description: The categories managing API
 */

/**
 * @swagger
 *  get:
 *    summary: Returns the list of all the categories
 *    tags: [Categories]
 */

/**
 * @swagger
 * /api/categories:
 *  get:
 *    summary: Returns the list of all the categories
 *    tags: [Categories]
 *    responses:
 *      200:
 *        description: The list of the categories
 *        content:
 *          application/json:
 *            schema:
 *              type: array`
 *              items:
 *                $ref: '#/components/schemas/Category'
 */
router.get('/', CategoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get the category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category id
 *     responses:
 *       200:
 *         description: The category description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: The category was not found
 */
router.get('/:id', CategoryController.getById);

/**
 * @swagger
 * /api/categories:
 *  post:
 *    summary: Create a new category
 *    tags: [Categories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The name of the category
 *                example: "Technology"
 *              description:
 *                type: string
 *                description: Teh description of the category
 *                example: "All about technology"
 *    responses:
 *      201:
 *        description: The category was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      500:
 *        description: Some server error
 */
router.post('/', CategoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update the category by the id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The category was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: The category was not found
 *       500:
 *         description: Some error happend
 */
router.put('/:id', CategoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *  delete:
 *    summary: Remove the category by id
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The category id
 *    responses:
 *      204:
 *        description: The category was deleted
 *      404:
 *        description: The category was not found
 */
router.delete('/:id', CategoryController.deleteCategory);

export default router;
