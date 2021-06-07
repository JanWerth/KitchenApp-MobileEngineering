import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Pressable,
	FlatList,
	ActivityIndicator,
	SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from '../api/fbconfig';
import { SearchBar } from 'react-native-elements';
import { ProductType } from '../types';
import FilterModal from '../components/filterModal/filterModal';
import ItemModal from '../components/itemModal/itemModal';
import Listitem from '../components/listitem/listitem';
import { filterModalButtons } from '../utils/filterModalButtons';

export default function ListQueryScreen() {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [filterModalVisible, setfilterModalVisible] = useState<boolean>(false);
	const [filterActive, setFilterActive] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	const [masterProductsList, setMasterProductsList] = useState<
		ProductType[] | undefined
	>([]);
	const [filteredProductsList, setFilteredProductsList] = useState<
		ProductType[] | undefined
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [itemData, setItemData] = useState<ProductType>();

	const [activeTab, setActiveTab] = useState<string>('Category');
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const updateIndex = (index: number) => {
		setSelectedIndex(index);
		setActiveTab(filterModalButtons[index]);
	};

	useEffect(() => {
		const productsRef = firebase.database().ref('Ingredients');
		productsRef.on('value', (snapshot) => {
			const products = snapshot.val();
			const productsList: ProductType[] = [];
			for (let id in products) {
				productsList.push({ id, ...products[id] });
			}
			setMasterProductsList(productsList);
			setFilteredProductsList(productsList);
			setLoading(false);
		});
	}, []);

	const searchFilterFunction = (text: string) => {
		if (text && text != '') {
			if (filteredProductsList) {
				const newData: ProductType[] = filteredProductsList.filter((item) => {
					const itemData: string = item.name
						? item.name.toUpperCase()
						: ''.toUpperCase();
					const textData: string = text.toUpperCase();
					return itemData.indexOf(textData) > -1;
				});
				setFilteredProductsList(newData);
				setSearch(text);
				setFilterActive(true);
			}
		} else {
			setFilteredProductsList(masterProductsList);
			setSearch(text);
			setFilterActive(false);
		}
	};

	const filterFuntion = (text: string) => {
		if (text) {
			if (filteredProductsList) {
				if (activeTab === 'Category') {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						const itemData: string = item.category?.toUpperCase();
						const filterData: string = text.toUpperCase();
						return itemData.indexOf(filterData) > -1;
					});
					setFilteredProductsList(newData);
					setFilterActive(!filterActive);
				}
				if (activeTab === 'Location') {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						const itemData: string = item.location?.toUpperCase();
						const filterData: string = text.toUpperCase();
						return itemData.indexOf(filterData) > -1;
					});
					setFilteredProductsList(newData);
					setFilterActive(!filterActive);
				}
				if (activeTab === 'Confection Type') {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						const itemData: string = item.confectionType?.toUpperCase();
						const filterData: string = text.toUpperCase();
						return itemData.indexOf(filterData) > -1;
					});
					setFilteredProductsList(newData);
					setFilterActive(!filterActive);
				}
				if (activeTab === 'Special') {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						if (
							item.category === 'Not selected' ||
							item.location === 'Not selected' ||
							item.confectionType === 'Not selected' ||
							item.expirationDate === 'Not selected'
						) {
							return item.name;
						}
					});
					setFilteredProductsList(newData);
					setFilterActive(!filterActive);
				}
			}
		} else {
			setFilteredProductsList(masterProductsList);
			setFilterActive(!filterActive);
		}
	};

	const clickEventListener = (item: ProductType) => {
		setItemData(item), setModalVisible(!modalVisible);
	};

	return (
		<SafeAreaView style={styles.centeredView}>
			<FlatList
				ListHeaderComponent={
					<View style={styles.filterRow}>
						<View style={styles.searchBar}>
							<SearchBar
								placeholder='Type Here...'
								round
								lightTheme
								platform={'ios'}
								onChangeText={(text: string) => {
									searchFilterFunction(text);
									setSearch(text);
								}}
								onClear={() => {
									setSearch('');
								}}
								value={search}
								containerStyle={styles.searchContainer}
								onCancel={() => setSearch('')}
							/>
						</View>
						<View style={styles.filterIcon}>
							{!filterActive ? (
								<Pressable
									onPress={() => setfilterModalVisible(!filterModalVisible)}
								>
									<MaterialCommunityIcons
										name='filter-variant'
										size={32}
										color='black'
									/>
								</Pressable>
							) : (
								<Pressable
									onPress={() => {
										filterFuntion('');
										setSearch('');
									}}
								>
									<MaterialCommunityIcons
										name='filter-variant-remove'
										size={32}
										color='black'
									/>
								</Pressable>
							)}
						</View>
					</View>
				}
				ListHeaderComponentStyle={styles.filterRow}
				ListFooterComponent={
					loading ? (
						<ActivityIndicator size='large' color='#0000ff' />
					) : (
						<Text style={styles.loadingStyle}>All Items loaded</Text>
					)
				}
				style={styles.list}
				data={filteredProductsList}
				renderItem={({ item }) => (
					<Listitem data={item} onPress={clickEventListener} />
				)}
			/>
			<FilterModal
				isVisible={filterModalVisible}
				setFilterModalVisibility={() => {
					setfilterModalVisible(!filterModalVisible);
				}}
				activeTab={activeTab}
				selectedIndex={selectedIndex}
				updateIndex={updateIndex}
				filterFunction={filterFuntion}
			/>
			<ItemModal
				isVisible={modalVisible}
				setItemModalVisibility={() => {
					setModalVisible(!modalVisible);
				}}
				data={itemData}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	filterRow: {
		flex: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	searchBar: {
		flex: 4,
	},
	filter: {
		flex: 1,
	},
	filterIcon: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	search: {
		paddingTop: 15,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	searchInput: {
		flex: 1,
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		width: '75%',
		fontSize: 16,
		padding: 10,
		color: 'black',
		alignSelf: 'flex-start',
	},
	searchContainer: {
		backgroundColor: 'white',
		borderWidth: 0,
	},
	list: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: 'white',
	},
	loadingStyle: {
		padding: 10,
		color: 'lightgrey',
		alignSelf: 'center',
		fontStyle: 'italic',
	},
});
