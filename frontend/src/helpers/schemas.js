import * as Yup from 'yup';

/** Schemas for the most input heavy portion of the app, the
 * user information
 */
const registerSchema = Yup.object({
	email: Yup.string().email().min(5).max(50).required(),
	name: Yup.string().min(2).max(50).matches(/^[a-z]+$/i).required(),
	password: Yup.string().min(2).max(100).required()
});

const loginSchema = Yup.object({
	email: Yup.string().email().min(5).max(50).required(),
	password: Yup.string().min(2).max(100).required()
});

const editSchema = Yup.object({
	// email: Yup.string().email().min(5).max(50).required(),
	name: Yup.string().min(2).max(50).matches(/^[a-z]+$/i).required(),
	password: Yup.string().min(2).max(100),
	passwordConfirm: Yup.string().min(2).max(100).required()
});

export {
	registerSchema,
	loginSchema,
	editSchema
};
