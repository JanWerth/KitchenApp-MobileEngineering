import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Modal,
	Pressable,
	FlatList,
	TextInput,
	Keyboard,
	Platform,
	ScrollView,
	ActivityIndicator,
	SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../api/fbconfig';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SearchBar } from 'react-native-elements';
import { categoryItems, categoryPlaceholder } from '../utils/categoryPicker';
import { locationItems, locationPlaceholder } from '../utils/locationPicker';
import {
	confectionItems,
	confectionPlaceholder,
} from '../utils/confectionPicker';
import fil from 'date-fns/esm/locale/fil/index.js';
import { ProductType } from '../types';

export default function ListQueryScreen() {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');
	const [masterProductsList, setMasterProductsList] = useState<
		ProductType[] | undefined
	>([]);
	const [filteredProductsList, setFilteredProductsList] = useState<
		ProductType[] | undefined
	>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [id, setId] = useState<string>();
	const [name, setName] = useState<string>('');
	const [selectedCategory, setSelectedCategory] =
		useState<string>('Not selected');

	const [selectedLocation, setSelectedLocation] =
		useState<string>('Not selected');

	const [selectedConfectionType, setSelectedConfectionType] =
		useState<string>('Not selected');

	const today = new Date();
	//DateTimePicker
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

	const onChange = (event: any, selectedDate: any) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showMode = () => {
		setShow(true);
		setMode('date');
	};

	const showDatepicker = () => {
		showMode();
	};

	//Dismiss Keyboard when click outside of TextInput
	const dismissKeyboard = () => {
		Keyboard.dismiss();
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

	const setData = async (iid: string) => {
		await firebase
			.database()
			.ref(`Ingredients/${iid}`)
			.once('value')
			.then((snapshot) => {
				const ingredient = snapshot.val();
				setName(ingredient.name);
				setSelectedCategory(ingredient.category);
				setSelectedLocation(ingredient.location);
				setSelectedConfectionType(ingredient.confectionType);
				if (ingredient.expirationDate === 'Not selected') {
					setDate(new Date());
				} else {
					setDate(new Date(ingredient.expirationDate));
				}
			});
	};

	const updateIngredient = async () => {
		let dateString;
		if (
			date.toDateString() === today.toDateString() ||
			date.toDateString() === 'Invalid Date'
		) {
			dateString = 'Not selected';
		} else {
			dateString = date.toDateString();
		}
		await firebase.database().ref(`Ingredients/${id}`).update({
			name: name,
			category: selectedCategory,
			location: selectedLocation,
			confectionType: selectedConfectionType,
			expirationDate: dateString,
		});
	};

	const delIngredient = async (id: string) => {
		await firebase.database().ref(`/Ingredients/${id}`).remove();
	};

	const searchFilterFunction = (text: string) => {
		if (text) {
			if (filteredProductsList) {
				const newData: ProductType[] = filteredProductsList.filter(function (
					item
				) {
					const itemData: string = item.name
						? item.name.toUpperCase()
						: ''.toUpperCase();
					const textData: string = text.toUpperCase();
					return itemData.indexOf(textData) > -1;
				});
				setFilteredProductsList(newData);
				setSearch(text);
			}
		} else {
			setFilteredProductsList(masterProductsList);
			setSearch(text);
		}
	};

	return (
		<SafeAreaView style={styles.centeredView}>
			<FlatList
				ListHeaderComponent={
					<SearchBar
						placeholder='Type Here...'
						round
						lightTheme
						platform={'ios'}
						onChangeText={(text: string) => {
							searchFilterFunction(text);
							setSearch(text);
							console.log(text);
						}}
						onClear={() => {
							setSearch('');
							searchFilterFunction('');
						}}
						value={search}
						containerStyle={styles.searchContainer}
						onCancel={() => setSearch('')}
					/>
				}
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
					<Pressable
						style={styles.ingButton}
						onPress={() => {
							setModalVisible(!modalVisible);
							setId(item.id);
							setData(item.id);
							console.log(item.id);
						}}
					>
						<View style={styles.listItem}>
							<View style={styles.titleRow}>
								<Text style={styles.itemName}>{item.name}</Text>
								<Pressable onPress={() => delIngredient(item.id)}>
									<Ionicons
										style={styles.trashIcon}
										name='ios-trash-bin-sharp'
										size={22}
										color='black'
									/>
								</Pressable>
							</View>
							<View style={styles.infoRow}>
								<View style={styles.categoryColumn}>
									<Text>Category:</Text>
									<Text style={styles.category}>{item.category}</Text>
								</View>
								<View style={styles.locationColumn}>
									<Text>Location: </Text>
									<Text style={styles.location}>{item.location}</Text>
								</View>
								<View style={styles.confectionTypeColumn}>
									<Text>Confection Type: </Text>
									<Text style={styles.confectionType}>
										{item.confectionType}
									</Text>
								</View>
							</View>
							<View style={styles.expirationDateRow}>
								<Text style={styles.expirationDate}>
									Expires on: {item.expirationDate}
								</Text>
							</View>
						</View>
					</Pressable>
				)}
			/>
			<Modal
				animationType='none'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalTitleText}>Edit Ingredient!</Text>
						<View style={styles.divider}></View>
						<ScrollView style={styles.scrollStyle}>
							<Text style={styles.Label}>Enter Item Name:</Text>
							<TextInput
								placeholder='Name'
								style={styles.NameInput}
								onChangeText={(text) => setName(text)}
								value={name}
							/>
							<Text style={styles.Label}>Select Category:</Text>
							<View>
								<RNPickerSelect
									placeholder={categoryPlaceholder}
									onValueChange={(value) => setSelectedCategory(value)}
									// style={styles.pickerSelectStyles}
									items={categoryItems}
									useNativeAndroidPickerStyle={false}
									value={selectedCategory}
									style={{
										...pickerSelectStyles,
										iconContainer: { top: 15, right: 12 },
									}}
									Icon={() => {
										return (
											<Ionicons name='md-arrow-down' size={24} color='gray' />
										);
									}}
								/>
							</View>
							<Text style={styles.Label}>Select Location:</Text>
							<View>
								<RNPickerSelect
									placeholder={locationPlaceholder}
									onValueChange={(value) => setSelectedLocation(value)}
									items={locationItems}
									useNativeAndroidPickerStyle={false}
									value={selectedLocation}
									style={{
										...pickerSelectStyles,
										iconContainer: { top: 15, right: 12 },
									}}
									Icon={() => {
										return (
											<Ionicons name='md-arrow-down' size={24} color='gray' />
										);
									}}
								/>
							</View>
							<Text style={styles.Label}>Select Confection:</Text>
							<View>
								<RNPickerSelect
									placeholder={confectionPlaceholder}
									onValueChange={(value) => setSelectedConfectionType(value)}
									// style={styles.pickerSelectStyles}
									items={confectionItems}
									useNativeAndroidPickerStyle={false}
									value={selectedConfectionType}
									style={{
										...pickerSelectStyles,
										iconContainer: { top: 15, right: 12 },
									}}
									Icon={() => {
										return (
											<Ionicons name='md-arrow-down' size={24} color='gray' />
										);
									}}
								/>
							</View>
							<Pressable style={styles.dateButton} onPress={showDatepicker}>
								<Text style={styles.dateText}>Select Expiration Date!</Text>
							</Pressable>
							{show && (
								<DateTimePicker
									testID='dateTimePicker'
									value={date}
									mode='date'
									display='default'
									onChange={onChange}
									minimumDate={today}
								/>
							)}
						</ScrollView>
						<View style={styles.modalFooter}>
							<View style={styles.divider}></View>
							<View style={styles.modalButtonRow}>
								<Pressable
									style={[styles.button, styles.buttonClose]}
									onPress={() => setModalVisible(!modalVisible)}
								>
									<Text style={styles.textStyle}>Close</Text>
								</Pressable>
								<Pressable
									style={[styles.button, styles.buttonSave]}
									onPress={() => {
										updateIngredient();
										setModalVisible(!modalVisible);
									}}
								>
									<Text style={styles.textStyle}>Save</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30,
		marginTop: 5,
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'black',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30,
		marginTop: 5,
	},
});

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	search: {
		// backgroundColor: 'black',
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
	listItem: {
		flex: 1,
	},
	titleRow: {
		flex: 1,
		flexDirection: 'row',
		margin: 5,
		marginBottom: 0,
	},
	itemName: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold',
	},
	trashIcon: {
		flex: 1,
		marginRight: 5,
	},
	infoRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryColumn: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		margin: 5,
	},
	category: {
		flex: 1,
		alignItems: 'center',
	},
	locationColumn: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		margin: 5,
	},
	location: {
		flex: 1,
		alignItems: 'center',
	},
	confectionTypeColumn: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		margin: 5,
	},
	confectionType: {
		flex: 1,
		alignItems: 'center',
	},
	expirationDateRow: {
		flex: 1,
		margin: 5,
	},
	expirationDate: {
		fontStyle: 'italic',
		fontSize: 10,
	},
	container: {
		flex: 1,
		backgroundColor: 'blue',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		borderColor: 'black',
		borderWidth: 0,
		height: '100%',
		width: '100%',
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		padding: 10,
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: 'lightgray',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	ingButton: {
		marginTop: 10,
		padding: 5,
		// borderWidth: 1,
		borderColor: 'blue',
		borderRadius: 10,
		backgroundColor: '#CDEFFF',
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
	Label: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		paddingTop: 20,
	},
	NameInput: {
		fontSize: 20,
		fontWeight: 'bold',
		borderBottomWidth: 1,
		width: 300,
		height: 45,
		borderRadius: 10,
		padding: 10,
	},
	datepicker: {
		marginTop: 100,
	},
	dateButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'blue',
		margin: 15,
	},
	dateText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
	modalFooter: {},
	modalButtonRow: {
		width: '100%',
		flexDirection: 'row',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		// backgroundColor: 'blue',
	},
	buttonClose: {
		width: '17.5%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonSave: {
		width: '65%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		marginLeft: '4.5%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollStyle: {
		// backgroundColor: 'grey',
		width: '100%',
		paddingLeft: '10%',
		paddingRight: '10%',
	},
	loadingStyle: {
		padding: 10,
		color: 'lightgrey',
		alignSelf: 'center',
		fontStyle: 'italic',
	},
	searchContainer: {
		backgroundColor: 'white',
		borderWidth: 0,
	},
	searchIcon: { fontSize: 200 },
});
