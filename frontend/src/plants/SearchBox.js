import React, { useState } from 'react';
// Material UI Components
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

/** Component rendered in ./Search Component. It is
 * the form element which the user types their search
 * query into it. Component passes the final submitted
 * query value up to parent.
 * 
 * Authorization: none, accessible to all
 */
function SearchBox({ setFxn, query }) {
	const [ formData, setFormData ] = useState(query);

	async function handleSubmit(evt) {
		evt.preventDefault();
		await setFxn(formData);
		setFormData('');
	}

	return (
		<form onSubmit={handleSubmit} class="Search">
			<FormControl variant="filled">
				<InputLabel htmlFor="input-search">Search keywords: </InputLabel>
				<FilledInput
					name="search"
					id="input-search"
					value={formData}
					onChange={(evt) => setFormData(evt.target.value)}
				/>
				{formData === '' || formData.match(/^[a-z\s]+$/i) ? null : (
					<FormHelperText error className="component-error-text">
						Must contain only English letters and spaces!
					</FormHelperText>
				)}
			</FormControl>
			<br />
			<Button variant="contained" color="primary" type="submit">
				Search Plants
			</Button>
		</form>
	);
}

export default SearchBox;
