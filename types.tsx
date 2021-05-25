/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
	Root: undefined;
	NotFound: undefined;
};

export type BottomTabParamList = {
	AddIngredientScreen: undefined;
	ListQueryScreen: undefined;
	ExpiringSoonScreen: undefined;
};

export type AddIngredientParamList = {
	AddIngredientScreen: undefined;
};

export type ListQueryParamList = {
	ListQueryScreen: undefined;
};

export type ListParamList = {
	ExpiringSoonScreen: undefined;
};

export type Product = {
	id: string;
	name: string;
	category?: string;
	location?: string;
	confectionType?: string;
	expirationDate?: string;
	dateAdded?: string;
};
