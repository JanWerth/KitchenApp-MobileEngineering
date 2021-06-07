import { firebase } from './fbconfig';

export const deleteIngrediet = async (id: string) => {
	await firebase.database().ref(`/Ingredients/${id}`).remove();
};
