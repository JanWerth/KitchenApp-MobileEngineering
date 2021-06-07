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

export type ProductType = {
	id: string;
	name: string;
	brand: string;
	category: string;
	location: string;
	confectionType: string;
	expirationDate: string;
	ripeness: string;
	editedOn: string;
	frozen: boolean;
	open: boolean;
	addedOn: string;
};

export type filterModalProps = {
	isVisible: boolean;
	setFilterModalVisibility: () => void;
	activeTab: string;
	selectedIndex: number;
	updateIndex: (index: number) => void;
	filterFunction: (text: string) => void;
};

export type itemModalProps = {
	isVisible: boolean;
	setItemModalVisibility: () => void;
	itemID?: string;
	data: ProductType;
};

export type listitemProps = {
	data: ProductType;
	onPress: (item: ProductType) => void;
};
