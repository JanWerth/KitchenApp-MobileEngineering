import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	FlatList,
	ActivityIndicator,
	Platform,
} from 'react-native';
import { ProductType } from '../types';
import { firebase } from '../api/fbconfig';
import { add, format, isBefore } from 'date-fns';
import { ButtonGroup } from 'react-native-elements';
import { expirationButtons } from '../utils/expirationButtons';
import ItemModal from '../components/itemModal/itemModal';
import Listitem from '../components/listitem/listitem';

export default function ExpiringSoonScreen() {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [itemData, setItemData] = useState<ProductType>();
	const [masterProductsList, setMasterProductsList] = useState<ProductType[]>(
		[]
	);
	const [filteredProductsList, setFilteredProductsList] = useState<
		ProductType[]
	>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const today = new Date();
	const oneDay = format(add(today, { days: 1 }), "yyyy-MM-dd'T'HH:mm");
	const threeDays = format(add(today, { days: 3 }), "yyyy-MM-dd'T'HH:mm");
	const oneWeek = format(add(today, { weeks: 1 }), "yyyy-MM-dd'T'HH:mm");

	const buttons = ['1 day', '3 days', '7 days'];
	const [activeTab, setActiveTab] = useState<string>('1 day');
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const updateIndex = (index: number) => {
		setSelectedIndex(index);
		setActiveTab(expirationButtons[index]);
		expirationDateFilterFunction(expirationButtons[index]);
	};

	const expirationDateFilterFunction = (range: string) => {
		if (filteredProductsList) {
			if (range === buttons[0]) {
				const newData: ProductType[] = masterProductsList.filter((item) => {
					if (isBefore(new Date(item.expirationDate), new Date(oneDay))) {
						return item.expirationDate;
					}
				});
				setFilteredProductsList(newData);
			}
			if (range === buttons[1]) {
				const newData: ProductType[] = masterProductsList.filter((item) => {
					if (isBefore(new Date(item.expirationDate), new Date(threeDays))) {
						return item.expirationDate;
					}
				});
				setFilteredProductsList(newData);
			}
			if (range === buttons[2]) {
				const newData: ProductType[] = masterProductsList.filter((item) => {
					if (isBefore(new Date(item.expirationDate), new Date(oneWeek))) {
						return item.expirationDate;
					}
				});
				setFilteredProductsList(newData);
			}
		}
	};

	const setInitialData = (list: ProductType[]) => {
		const newData: ProductType[] = list.filter((item) => {
			if (isBefore(new Date(item.expirationDate), new Date(oneDay))) {
				return item.expirationDate;
			}
		});
		setFilteredProductsList(newData);
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
			setInitialData(productsList);
			setLoading(false);
		});
	}, []);

	const clickEventListener = (item: ProductType) => {
		setItemData(item), setModalVisible(!modalVisible);
	};

	return (
		<SafeAreaView style={styles.centeredView}>
			<FlatList
				ListHeaderComponent={
					<View style={styles.filterRow}>
						<ButtonGroup
							buttons={buttons}
							selectedIndex={selectedIndex}
							onPress={updateIndex}
							containerStyle={{ width: '90%' }}
						/>
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
				// keyExtractor={(item, id) => id.toString()}
				renderItem={({ item }) => (
					<Listitem data={item} onPress={clickEventListener} />
				)}
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
		marginTop: 5,
	},

	list: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		// borderWidth: 1,
		backgroundColor: 'white',
	},
	loadingStyle: {
		padding: 10,
		color: 'lightgrey',
		alignSelf: 'center',
		fontStyle: 'italic',
	},
});
