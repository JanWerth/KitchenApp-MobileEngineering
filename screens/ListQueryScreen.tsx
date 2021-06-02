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
import {
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons';
import { firebase } from '../api/fbconfig';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SearchBar, ButtonGroup } from 'react-native-elements';
import { categoryItems, categoryPlaceholder } from '../utils/categoryPicker';
import { locationItems, locationPlaceholder } from '../utils/locationPicker';
import {
	confectionItems,
	confectionPlaceholder,
} from '../utils/confectionPicker';
import { ProductType } from '../types';
import { RadioButton } from 'react-native-paper';
import { filterModalStyles } from '../constants/filterModalStyle';

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

	const buttons = ['Category', 'Location', 'Confection Type', 'Special'];
	const [activeTab, setActiveTab] = useState<string>('Category');
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const updateIndex = (index: number) => {
		setSelectedIndex(index);
		setActiveTab(buttons[index]);
	};

	const [value, setValue] = useState<string>('');

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
			}
		} else {
			setFilteredProductsList(masterProductsList);
			setSearch(text);
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
				} else {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						const itemData: string =
							item.confectionType.toUpperCase() &&
							item.category.toUpperCase() &&
							item.location.toUpperCase() &&
							item.expirationDate.toUpperCase();
						const filterData: string = text.toUpperCase();
						return itemData.indexOf(filterData) > -1;
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
									searchFilterFunction('');
								}}
								value={search}
								containerStyle={styles.searchContainer}
								onCancel={() => setSearch('')}
							/>
						</View>
						<View style={styles.filterIcon}>
							{!filterActive ? (
								// <Pressable onPress={() => categoryFilterFuntion('Fruit')}>
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
								<Pressable onPress={() => filterFuntion('')}>
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
				visible={filterModalVisible}
				onRequestClose={() => {
					setModalVisible(!filterModalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.filterModalView}>
						<View style={styles.filterModalTopRow}>
							<View style={styles.filterModalCloseIcon}>
								<Ionicons
									name={'ios-close-outline'}
									size={28}
									onPress={() => setfilterModalVisible(!filterModalVisible)}
								/>
							</View>
							<View style={styles.filterModalTitle}>
								<Text style={styles.filterModalTitleText}>Filter</Text>
							</View>
							<View style={styles.filterModalFilterIcon}>
								<MaterialCommunityIcons name={'filter-variant'} size={28} />
							</View>
						</View>
						<View style={styles.divider}></View>
						<View>
							<ButtonGroup
								buttons={buttons}
								selectedIndex={selectedIndex}
								onPress={updateIndex}
								containerStyle={{ width: '90%' }}
							/>
						</View>

						{activeTab === 'Category' && (
							<View style={styles.filterPicker}>
								<RadioButton.Group
									onValueChange={(newValue) => setValue(newValue)}
									value={value}
								>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Fruit'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Fruit</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Vegetable'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Vegetable</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Dairy'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Dairy</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Meat'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Meat</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Liquid'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Liquid</Text>
									</View>
								</RadioButton.Group>
							</View>
						)}
						{activeTab === 'Location' && (
							<View style={styles.filterPicker}>
								<RadioButton.Group
									onValueChange={(newValue) => setValue(newValue)}
									value={value}
								>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Fridge'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Fridge</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Freezer'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Freezer</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Pantry'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Pantry</Text>
									</View>
								</RadioButton.Group>
							</View>
						)}
						{activeTab === 'Confection Type' && (
							<View style={styles.filterPicker}>
								<RadioButton.Group
									onValueChange={(newValue) => setValue(newValue)}
									value={value}
								>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Fresh'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Fresh</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Canned'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Canned</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Frozen'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Frozen</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Cured'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Cured</Text>
									</View>
								</RadioButton.Group>
							</View>
						)}
						{activeTab === 'Special' && (
							<View style={styles.filterPicker}>
								<RadioButton.Group
									onValueChange={(newValue) => setValue(newValue)}
									value={value}
								>
									<View style={styles.radioButtonView}>
										<RadioButton.Android
											value='Not selected'
											style={styles.radioButton}
										/>
										<Text style={styles.radioButtonText}>Missing Data</Text>
									</View>
								</RadioButton.Group>
							</View>
						)}

						<View style={styles.modalButtonRow}>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => {
									setfilterModalVisible(!filterModalVisible);

									filterFuntion(value);
								}}
							>
								<Text style={styles.textStyle}>Hide Modal</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>

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
						<View style={styles.modalTopRow}>
							<View style={styles.modalCloseIcon}>
								<Ionicons
									name={'ios-close-outline'}
									size={28}
									onPress={() => setModalVisible(!modalVisible)}
								/>
							</View>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleText}>Edit Ingredient!</Text>
							</View>
							<View style={styles.modalEditIcon}>
								<MaterialIcons name={'edit'} size={25} />
							</View>
						</View>
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
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 20,
		alignItems: 'center',
		borderColor: 'black',
		borderWidth: 0,
		width: '90%',
		height: '90%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTopRow: {
		flexDirection: 'row',
		padding: 10,
	},
	modalCloseIcon: {
		flex: 1,
		alignSelf: 'flex-start',
		justifyContent: 'center',
	},
	modalTitle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalEditIcon: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
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
	filterModalView: {
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: '90%',
		height: '70%',
	},
	filterModalTopRow: {
		flexDirection: 'row',
		padding: 10,
	},
	filterModalCloseIcon: {
		flex: 1,
		alignSelf: 'flex-start',
	},
	filterModalTitle: {
		flex: 1,
		alignSelf: 'center',
	},
	filterModalTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 1,
		alignSelf: 'center',
	},
	filterModalFilterIcon: {
		flex: 1,
		alignItems: 'flex-end',
	},
	filterTabContainer: {
		width: '90%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		alignItems: 'center',
		marginTop: 10,
	},
	filterTabComponent: {
		fontSize: 18,
	},
	filterPicker: {
		width: '90%',
	},
	radioButtonView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	radioButton: {
		backgroundColor: 'yellow',
	},
	radioButtonText: {
		fontSize: 18,
		alignSelf: 'center',
		justifyContent: 'center',
	},
});
