import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { filterModalProps } from '../../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ButtonGroup } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import { filterModalButtons } from '../../utils/filterModalButtons';

const FilterModal = ({
	isVisible,
	setFilterModalVisibility,
	activeTab,
	selectedIndex,
	updateIndex,
	filterFunction,
}: filterModalProps) => {
	const [value, setValue] = useState<string>('');
	const nothingSelected = (): boolean => {
		return value === '';
	};
	return (
		<Modal
			animationType='none'
			transparent={true}
			visible={isVisible}
			onRequestClose={() => {
				!isVisible;
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.filterModalView}>
					<View style={styles.filterModalTopRow}>
						<View style={styles.filterModalCloseIcon}>
							<Ionicons
								name={'ios-close-outline'}
								size={28}
								onPress={() => setFilterModalVisibility()}
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
								textStyle={{ textAlign: 'center' }}
								buttons={filterModalButtons}
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
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Spice' />
										<Text style={styles.radioButtonText}>Spice</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Sweet' />
										<Text style={styles.radioButtonText}>Sweet</Text>
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
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Cabinet' />
										<Text style={styles.radioButtonText}>Cabinet</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Breadbasket' />
										<Text style={styles.radioButtonText}>Breadbasket</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Shelf' />
										<Text style={styles.radioButtonText}>Shelf</Text>
									</View>
									<View style={styles.radioButtonView}>
										<RadioButton.Android value='Spice Shelf' />
										<Text style={styles.radioButtonText}>Spice Shelf</Text>
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
								setFilterModalVisibility();
								filterFunction(value);
								setValue('');
							}}
							disabled={nothingSelected()}
						>
							<Text style={styles.textStyle}>Apply Filter</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: 'lightgray',
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
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

export default FilterModal;
