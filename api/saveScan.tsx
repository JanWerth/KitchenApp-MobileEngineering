import { format } from 'date-fns';
import { showMessage } from 'react-native-flash-message';
import { addIngredient } from './addIngredient';

let now = format(new Date(), "yyyy-MM-dd'T'HH:mm");

const saveScan = (name: string, brand?: string) => {
	let scannedBrand = 'Not selected';
	{
		brand ? (scannedBrand = brand) : (scannedBrand = 'Not selected');
	}
	addIngredient(
		name,
		scannedBrand,
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
	showMessage({
		message: 'Success',
		description: 'Ingredient Saved',
		type: 'success',
		icon: 'success',
	});
};

export default saveScan;
