/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AddIngredientScreen from '../screens/AddIngredientScreen';
import ListQueryScreen from '../screens/ListQueryScreen';
import ExpiringSoonScreen from '../screens/ExpiringSoonScreen';
import {
	BottomTabParamList,
	AddIngredientParamList,
	ListQueryParamList,
	ListParamList,
} from '../types';
import { Button } from 'react-native';
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName='AddIngredient'
			tabBarOptions={{
				style: {
					borderTopWidth: 0,
					backgroundColor: 'white',
					elevation: 0,
				},
				activeTintColor: Colors[colorScheme].tint,
				keyboardHidesTabBar: true,
			}}
		>
			<BottomTab.Screen
				name='Add Ingredient'
				component={AddIngredientNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name='ios-add' size={24} color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name='List'
				component={ListQueryNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon name='ios-list' color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name='Expiring Soon'
				component={ExpiringSoonNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon name='ios-calendar-sharp' color={color} />
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof Ionicons>['name'];
	color: string;
}) {
	return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const AddIngredientStack = createStackNavigator<AddIngredientParamList>();

function AddIngredientNavigator() {
	return (
		<AddIngredientStack.Navigator>
			<AddIngredientStack.Screen
				name='AddIngredientScreen'
				component={AddIngredientScreen}
				options={{
					headerTitle: 'Add Ingredient',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: 'white',
						shadowColor: 'black',
						shadowRadius: 0,
					},
					headerTitleStyle: {
						color: 'black',
					},
				}}
				// options={{ headerShown: false}}
			/>
		</AddIngredientStack.Navigator>
	);
}

const ListQueryStack = createStackNavigator<ListQueryParamList>();

function ListQueryNavigator() {
	return (
		<ListQueryStack.Navigator>
			<ListQueryStack.Screen
				name='ListQueryScreen'
				component={ListQueryScreen}
				options={{
					headerTitle: 'Ingredients',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: 'white',
						shadowColor: 'black',
						shadowRadius: 0,
					},
					headerTitleStyle: {
						color: 'black',
					},
				}}
			/>
		</ListQueryStack.Navigator>
	);
}

const ExpiringSoonStack = createStackNavigator<ListParamList>();

function ExpiringSoonNavigator() {
	return (
		<ExpiringSoonStack.Navigator>
			<ExpiringSoonStack.Screen
				name='ExpiringSoonScreen'
				component={ExpiringSoonScreen}
				options={{
					headerTitle: 'Expiring Soon Ingredients',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: 'white',
						shadowColor: 'black',
						shadowRadius: 0,
					},
					headerTitleStyle: {
						color: 'black',
					},
				}}
			/>
		</ExpiringSoonStack.Navigator>
	);
}
