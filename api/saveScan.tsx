import { format } from 'date-fns';
import { addIngredient } from './addIngredient';

let now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

const saveScan = (name: string) => {
	addIngredient(
		name,
		'Not selected',
		'Not selected',
		'Not selected',
		'Not selected',
		'Not selected',
		'Not selected',
		now,
		false,
		false,
		now
	);
};

export default saveScan;
