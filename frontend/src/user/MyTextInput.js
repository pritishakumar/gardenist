import { useField } from 'formik';
// Material UI Components
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';

/** Component rendered by ./UserForm and utilized by the
 * Formik library. It provides a customizable text input
 * field.
 * 
 * Authorization: none
 */
function MyTextInput({ label, ...props }) {
	const [ field, meta ] = useField(props);
	return (
		<FormControl variant="filled">
			<InputLabel htmlFor={props.id || props.name}>{label}</InputLabel>
			<FilledInput className="text-input" {...field} {...props} />
			{meta.touched && meta.error ? (
				<FormHelperText error className="component-error-text">
					{meta.error}
				</FormHelperText>
			) : // <div className="error">{meta.error}</div>
			null}
		</FormControl>
	);
}

export default MyTextInput;
