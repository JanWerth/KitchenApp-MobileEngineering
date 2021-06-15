import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { listitemProps } from '../../types';
import { deleteIngrediet } from '../../api/deleteIngredient';
import { LinearGradient } from 'expo-linear-gradient';
import Tag from './tag';

const Listitem = ({
	data,
	onPress,
	index,
	setTab,
	expiringSoonScreen,
}: listitemProps) => {
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
			return 0.05;
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
		<LinearGradient colors={['#4EC5F1', '#0df2c9']} style={styles.ingButton}>
			<Pressable
				onPress={() => {
					// clickEventListener(item);
					// checkIngredient(data.id);
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
						{expiringSoonScreen === false ? (
							<Pressable
								onPress={() => {
									deleteIngrediet(data.id);
								}}
							>
								<Ionicons
									style={styles.trashIcon}
									name='ios-trash-bin-sharp'
									size={22}
									color='black'
								/>
							</Pressable>
						) : (
							<Pressable
								onPress={() => {
									deleteIngrediet(data.id);
									setTab(index);
								}}
							>
								<Ionicons
									style={styles.trashIcon}
									name='ios-trash-bin-sharp'
									size={22}
									color='black'
								/>
							</Pressable>
						)}
					</View>
					{data.category != 'Not selected' &&
					data.location != 'Not selected' &&
					data.confectionType != 'Not selected' &&
					!data.brand ? (
						<></>
					) : (
						<View style={styles.tagRow}>
							{data.category != 'Not selected' && <Tag title={data.category} />}
							{data.location != 'Not selected' && <Tag title={data.location} />}
							{data.confectionType != 'Not selected' && (
								<Tag title={data.confectionType} />
							)}
							{data.brand != '' && <Tag title={data.brand} />}
						</View>
					)}
					{data.ripeness != 'Not selected' && (
						<View style={styles.infoRow}>
							<View style={styles.ripenessColumn}>
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
	ingButton: {
		marginTop: 10,
		padding: 5,
		borderColor: 'blue',
		borderRadius: 10,
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
	tagRow: {
		flexDirection: 'row',
	},
	infoRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	ripenessColumn: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		margin: 5,
	},
	ripenessRow: {
		flex: 1,
		flexDirection: 'row',
	},
	addedDateRow: {
		flex: 1,
		margin: 5,
	},
	addedOnDate: {
		fontStyle: 'italic',
		fontSize: 10,
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
});

export default Listitem;
