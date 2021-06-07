import { format } from 'date-fns';
import { firebase } from './fbconfig';

export const checkIngredient = async (id: string) => {
	await firebase
		.database()
		.ref(`Ingredients/${id}`)
		.update({ editedOn: format(new Date(), "yyyy-MM-dd'T'HH:mm") });
};
