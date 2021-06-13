import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { listitemProps } from '../../types';
import { checkIngredient } from '../../api/checkIngredient';
import { deleteIngrediet } from '../../api/deleteIngredient';
import { LinearGradient } from 'expo-linear-gradient';

const Listitem = ({ data, onPress }: listitemProps) => {
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
		<LinearGradient
			// colors={['#5b86e5', '#d76d77', '#ffaf7b']}
			//Blue
			// colors={['#36d1dc', '#5b86e5']}
			//Red/Orange
			// colors={['#ff5f6d', '#ffc371']}
			//Grey
			// colors={['#bdc3c7', '#2c3e50']}
			colors={['#4EC5F1', '#0df2c9']}
			// Sexy blue
			// colors={['#7bd5f5', '#787ff6']}
			style={styles.ingButton}
		>
			<Pressable
				// style={styles.ingButton}
				onPress={() => {
					// clickEventListener(item);
					checkIngredient(data.id);
					onPress(data);
				}}
			>
				<View style={styles.listItem}>
					<View style={styles.titleRow}>
						<Text style={styles.itemName}>{data.name}</Text>
						{data.frozen && (
							<Ionicons
								style={styles.frozenIcon}
								name='ios-snow'
								size={24}
								color='black'
							/>
						)}
						{data.open && (
							<FontAwesome5
								style={styles.openIcon}
								name='box-open'
								size={24}
								color='black'
							/>
						)}
						<Pressable onPress={() => deleteIngrediet(data.id)}>
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
								{formatDistanceToNow(new Date(data.addedOn), {
									addSuffix: true,
								})}
							</Text>
						</Text>
					</View>
					{data.brand != '' && (
						<View style={styles.brandRow}>
							<Text style={{ margin: 5 }}>Brand: {data.brand}</Text>
						</View>
					)}
					{data.ripeness != 'Not selected' && (
						<View style={styles.infoRow}>
							<View style={styles.categoryColumn}>
								<View style={styles.ripenessRow}>
									<Text>Ripeness: </Text>
									<Text>{data.ripeness}</Text>
								</View>
								<View style={{ width: '100%' }}>
									<ProgressBar
										progress={progress(data.ripeness)}
										color={progressc(data.ripeness)}
									/>
								</View>
							</View>
						</View>
					)}
					<View style={styles.infoRow}>
						<View style={styles.categoryColumn}>
							<Text>Category:</Text>
							<Text style={styles.category}>{data.category}</Text>
						</View>
						<View style={styles.locationColumn}>
							<Text>Location: </Text>
							<Text style={styles.location}>{data.location}</Text>
						</View>
						<View style={styles.confectionTypeColumn}>
							<Text>Confection Type: </Text>
							<Text style={styles.confectionType}>{data.confectionType}</Text>
						</View>
					</View>
					<View style={styles.datesRow}>
						<Text style={styles.expirationDate}>
							{data.expirationDate != 'Not selected' && (
								<Text>
									Expires{' '}
									{formatDistanceToNow(new Date(data.expirationDate), {
										addSuffix: true,
									})}
								</Text>
							)}
							{data.expirationDate === 'Not selected' && (
								<Text>No expiration date selected</Text>
							)}
						</Text>
						<Text style={styles.editedDate}>
							<Text>
								Last checked{' '}
								{formatDistanceToNow(new Date(data.editedOn), {
									addSuffix: true,
								})}
							</Text>
						</Text>
					</View>
				</View>
			</Pressable>
		</LinearGradient>
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
	frozenIcon: {
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
	brandRow: {
		justifyContent: 'center',
	},
	infoRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	ripenessRow: {
		flex: 1,
		flexDirection: 'row',
	},
	ripenessText: {
		flex: 1,
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
	datesRow: {
		flex: 1,
		flexDirection: 'row',
		margin: 5,
	},
	expirationDate: {
		flex: 1,
		fontStyle: 'italic',
		fontSize: 10,
	},
	editedDate: {
		fontStyle: 'italic',
		fontSize: 10,
	},
	container: {
		flex: 1,
		alignItems: 'center',
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
	searchContainer: {
		backgroundColor: 'white',
		borderWidth: 0,
	},
	ingButton: {
		marginTop: 10,
		padding: 5,
		borderColor: 'blue',
		borderRadius: 10,
		// backgroundColor: '#CDEFFF',
		// backgroundColor: 'white',

		width: '98%',
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 3,
			height: 5,
		},
		shadowOpacity: 1,
		shadowRadius: 4,
		elevation: 5,
	},
});

export default Listitem;
