import { firebase } from './fbconfig';

export const addIngredient = (
	name: string,
	brand: string,
	category: string,
	location: string,
	confection: string,
	expirationDate: string,
	ripeness: string,
	editedOn: string,
	frozen: boolean,
	open: boolean,
	added: string
) => {
	const ingredientRef = firebase.database().ref(`/Ingredients`);
	const ing = {
		name: name,
		brand: brand,
		category: category,
		location: location,
		confectionType: confection,
		expirationDate: expirationDate,
		ripeness: ripeness,
		editedOn: editedOn,
		frozen: frozen,
		open: open,
		addedOn: added,
	};
	ingredientRef.push(ing);
};
