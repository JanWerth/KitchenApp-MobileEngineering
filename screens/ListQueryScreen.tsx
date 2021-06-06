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
	FontAwesome5,
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
import { RadioButton, ProgressBar } from 'react-native-paper';
import { formatDistanceToNow, add, format } from 'date-fns';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

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

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const today = new Date();
	const tomorrow = add(today, { days: 1 });
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

	const nothingSelected = (): boolean => {
		return value === '';
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
				setIsOpen(ingredient.open);
				if (ingredient.expirationDate === 'Not selected') {
					setDate(new Date());
				} else {
					setDate(new Date(ingredient.expirationDate));
				}
			});
	};

	//Use datefns
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
			open: isOpen,
		});
	};

	const checkIngredient = async (id: string) => {
		await firebase
			.database()
			.ref(`Ingredients/${id}`)
			.update({ editedOn: format(new Date(), "yyyy-MM-dd'T'HH:mm") });
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
				} else {
					const newData: ProductType[] = filteredProductsList.filter((item) => {
						const itemData: string =
							item.confectionType.toUpperCase() ||
							item.category.toUpperCase() ||
							item.location.toUpperCase() ||
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

	const progress = (p: string): number => {
		if (p === 'Barely Ripe') {
			return 0.25;
		}
		if (p === 'Ripe') {
			return 0.5;
		}
		if (p === 'Very Ripe') {
			return 0.75;
		}
		if (p === 'Overripe') {
			return 1;
		} else {
			return 0;
		}
	};

	const progressc = (p: string): string => {
		if (p === 'Barely Ripe') {
			return 'green';
		}
		if (p === 'Ripe') {
			return 'gold';
		}
		if (p === 'Very Ripe') {
			return 'darkorange';
		}
		if (p === 'Overripe') {
			return 'red';
		} else {
			return 'blue';
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
								<Pressable
									onPress={() => {
										filterFuntion('');
										setValue('');
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
				// keyExtractor={(item, id) => id.toString()}
				renderItem={({ item }) => (
					<Pressable
						style={styles.ingButton}
						onPress={() => {
							setModalVisible(!modalVisible);
							setId(item.id);
							setData(item.id);
							checkIngredient(item.id);
						}}
					>
						<View style={styles.listItem}>
							<View style={styles.titleRow}>
								<Text style={styles.itemName}>{item.name}</Text>
								{item.frozen ? (
									<Ionicons
										style={styles.frozenicon}
										name='ios-snow'
										size={24}
										color='black'
									/>
								) : (
									<></>
								)}
								{item.open ? (
									<FontAwesome5
										style={styles.openIcon}
										name='box-open'
										size={24}
										color='black'
									/>
								) : (
									<></>
								)}
								<Pressable onPress={() => delIngredient(item.id)}>
									<Ionicons
										style={styles.trashIcon}
										name='ios-trash-bin-sharp'
										size={22}
										color='black'
									/>
								</Pressable>
							</View>
							<View style={styles.addedDateRow}>
								<Text style={styles.addedOnDate}>
									<Text>
										Added{' '}
										{formatDistanceToNow(new Date(item.addedOn), {
											addSuffix: true,
										})}
									</Text>
								</Text>
							</View>
							{item.ripeness != 'Not selected' ? (
								<View>
									<View style={styles.infoRow}>
										<View style={styles.categoryColumn}>
											<Text>Ripeness:</Text>
											<View style={{ width: '90%' }}>
												<ProgressBar
													progress={progress(item.ripeness)}
													color={progressc(item.ripeness)}
												/>
											</View>
											<Text style={styles.category}>{item.ripeness}</Text>
										</View>
									</View>
								</View>
							) : (
								<></>
							)}

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
							<View style={styles.lastCheckedRow}>
								<Text style={styles.editedDate}>
									Last checked{' '}
									{formatDistanceToNow(new Date(item.editedOn), {
										addSuffix: true,
									})}
								</Text>
							</View>
							<View style={styles.expirationDateRow}>
								<Text style={styles.expirationDate}>
									{item.expirationDate != 'Not selected' && (
										<Text>
											Expires{' '}
											{formatDistanceToNow(new Date(item.expirationDate), {
												addSuffix: true,
											})}
										</Text>
									)}
									{item.expirationDate === 'Not selected' && (
										<Text>No expiration date selected</Text>
									)}
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
						<View style={{ width: '100%' }}>
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
											<RadioButton.Android value='Fruit' />
											<Text style={styles.radioButtonText}>Fruit</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Vegetable' />
											<Text style={styles.radioButtonText}>Vegetable</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Dairy' />
											<Text style={styles.radioButtonText}>Dairy</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Meat' />
											<Text style={styles.radioButtonText}>Meat</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Liquid' />
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
											<RadioButton.Android value='Fridge' />
											<Text style={styles.radioButtonText}>Fridge</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Freezer' />
											<Text style={styles.radioButtonText}>Freezer</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Pantry' />
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
											<RadioButton.Android value='Fresh' />
											<Text style={styles.radioButtonText}>Fresh</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Canned' />
											<Text style={styles.radioButtonText}>Canned</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Frozen' />
											<Text style={styles.radioButtonText}>Frozen</Text>
										</View>
										<View style={styles.radioButtonView}>
											<RadioButton.Android value='Cured' />
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
											<RadioButton.Android value='Not selected' />
											<Text style={styles.radioButtonText}>Missing Data</Text>
										</View>
									</RadioButton.Group>
								</View>
							)}
						</View>

						<View style={styles.filterModalButtonRow}>
							<Pressable
								style={[styles.button, styles.filterButtonClose]}
								onPress={() => {
									setfilterModalVisible(!filterModalVisible);

									filterFuntion(value);
								}}
								disabled={nothingSelected()}
							>
								<Text style={styles.textStyle}>Apply Filter</Text>
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
							{!isOpen ? (
								<Pressable onPress={() => setIsOpen(true)}>
									<FontAwesome5 name='box' size={24} color='black' />
								</Pressable>
							) : (
								<FontAwesome5 name='box-open' size={24} color='black' />
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
	frozenicon: {
		marginRight: 5,
	},
	openIcon: {
		marginRight: 5,
	},
	trashIcon: {
		flex: 1,
		marginRight: 5,
	},
	addedDateRow: {
		flex: 1,
		margin: 5,
	},
	addedOnDate: {
		fontStyle: 'italic',
		fontSize: 10,
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
	lastCheckedRow: {
		flex: 1,
		margin: 5,
	},
	editedDate: {
		fontStyle: 'italic',
		fontSize: 10,
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
		alignSelf: 'center',
	},
	radioButtonView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	radioButtonText: {
		fontSize: 18,
		alignSelf: 'center',
		justifyContent: 'center',
	},
	filterModalButtonRow: {
		position: 'absolute',
		bottom: 20,
		alignItems: 'center',
		width: '100%',
	},
	filterButtonClose: {
		width: '40%',
		height: 50,
		backgroundColor: '#353fcc',
		borderRadius: 75,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
