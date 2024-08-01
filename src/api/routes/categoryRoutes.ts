import { Router } from 'express';
import CategoryController from '../controllers/categoryController';
import categoryController from '../controllers/categoryController';
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
 * /categories:
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
 * /categories/{id}
 * get:
 *  summary: Get the category by id
 *  tags: [Categories]
 *  parameters:
 *    - in: path
 *      name: id
 *      scheam:
 *        type: integer
 *      required: true
 *      description: The category id
 *    responses:
 *      200:
 *        description: The category description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *       404:
 *         description: The category was not found
 */

router.get('/:id', categoryController.getById);

/**
 * @swagger
 * /categories:
 *  post:
 *    summary: Create a new category
 *    tags: [Categories]
 *    requestBoy:
 *      required: true
 *      content:
 *        applicatioin/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    response:
 *      201:
 *        description: The category was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      500:
 *        description: Some server error
 */
router.post('/', categoryController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *  put:
 *    summary: Update the category by the id
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The category id
 *    requestbody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    response:
 *      200:
 *        description: The category was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      404:
 *        description: The category was not found
 *      500:
 *        description: Some error happend
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /categoires/{id}:
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
router.delete('/:id', categoryController.deleteCategory);
