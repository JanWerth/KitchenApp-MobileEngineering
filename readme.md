# Mobile Engineering Project

- [Mobile Engineering Project](#mobile-engineering-project)
  - [About](#about)
  - [Setup](#setup)
  - [The App](#the-app)
    - [Add Ingredient Screen](#add-ingredient-screen)
      - [Inserting Written Data](#inserting-written-data)
      - [Inserting data by scanning a barcode](#inserting-data-by-scanning-a-barcode)
    - [List Screen](#list-screen)
      - [Updating a Product](#updating-a-product)
      - [Textual Search and filtering products](#textual-search-and-filtering-products)
    - [Expiring Soon Screen](#expiring-soon-screen)
      - [Expiring Soon](#expiring-soon)
      - [Open](#open)
      - [Ripe](#ripe)
      - [To be checked](#to-be-checked)
  - [API and Components](#api-and-components)
    - [Firebase Realtime Database](#firebase-realtime-database)
    - [Expo Barcode Scanner](#expo-barcode-scanner)
    - [Open Food Facts](#open-food-facts)
    - [Custom components](#custom-components)
  - [Known Bugs and Errors](#known-bugs-and-errors)
  - [Expo](#expo)
  - [Tests](#tests)

## About

Mobile Application Project of Jan Werth for UniBZ's [Engineering of Mobile Systems](https://github.com/rrobbes/EngineeringOfMobileSystemsV2) course.

## Setup

To run this project you have to follow several steps:

1. Install [NodeJS](https://nodejs.org/en/).
2. Install [expo-cli](https://docs.expo.io/get-started/installation/) with the Node Package Manager. To do this run `npm install --global expo-cli` on the command line.
3. Clone the project in your IDE of choice .
4. Run `npm install` or `yarn install` in the cloned folder.
5. Run `expo-go` to start the app.

## The App

This application is to track kitchen ingredients. You can insert and modify inserted ingredients, search for them or filter them based on extra information you provided. The application consists of three screen, an `Add Ingredient` Screen, a `List` Screen and an `Expiring Soon` Screen.

### Add Ingredient Screen

In the `Add Ingredient` Screen you can insert data in two ways. The traditional way by inserting data in written format or by scanning a barcode on a Product.

#### Inserting Written Data

To insert data in the written format you are presented with a form. Of all the fields, which at first are hidden and can be shown by clicking on the `Add more information` button, only the Name field is necessary and it also says so in the Application.

<img src="https://user-images.githubusercontent.com/64210185/122637108-3336fb80-d0ed-11eb-8446-4455075aafe1.jpg" width="500">
<img src="https://user-images.githubusercontent.com/64210185/122637115-37631900-d0ed-11eb-847d-bb2720b8334c.jpg" width="500">

When you click on the `Add more information` button you are presented with the full form. The form consist of an additional text input field for the product's `brand name`, three pickers for the `category`, the `location` where the product is stored and the `onfection type`. Additionally, you can select an `expiration date` and set the item to `open`. This will automatically open the expiration date picker with a maximum date set in week. (By selecting today's date in the expiration date picker the date will be set to `Not selected`). Furthermore, fresh products (selected `Fresh` in the confection type picker) will provide you with two additional fields: a `ripeness` picker to selects the item's ripeness and a `frozen` switch. By switching it to frozen the expiration date will be set to in 6 months from today.

https://user-images.githubusercontent.com/64210185/122636930-1ea63380-d0ec-11eb-95c8-b8a5bf220f48.mp4

#### Inserting data by scanning a barcode

You can also insert a product by scanning its barcode. To use this feature you have to agree to the usage of you camera asked by the app the first time you launch it (if you decline it will ask you everytime you open the app, except if you choose `Deny and don't ask again`).

<img src="https://user-images.githubusercontent.com/64210185/122636949-3aa9d500-d0ec-11eb-9d61-d63c76181efc.jpg" width="500">

https://user-images.githubusercontent.com/64210185/122667368-cbe37f00-d1b2-11eb-91b8-29796bcffc28.mp4

Once you scanned a barcode an Alert will pop up providing you with information on the scanned product and giving you three options to choose from:

- Cancel. Clicking on this will close the Alert without inserting the scanned product to the database.
- Scan again. The Barcode scanner will open once again so you can scan a product again in case the wrong bardcode got scanned.
- Save. This will save the scanned product to the database.

### List Screen

This screen shows all inserted products in different views based on the provided data. Depending on how much information is provided the item will be displayed differently. Some data that will always be shown is the `name`, the `added date`, the `expiration date` (if no expiration date is selected it will show `No expiration date selected` and the `Last checked date`. Furtermore, in the top right corner the will always be an icon to `delete` the product and depending on provided information it will also show an open box if the product is `open` or a snowflake if the item is `frozen`. If it is neither `open` nor `frozen` only the `delete` icon is shown in the top right corner.

<img src="https://user-images.githubusercontent.com/64210185/122636954-4b5a4b00-d0ec-11eb-8c5e-0508eb692020.jpg" width="500">

If a product is provided with additional information the appearance of the listitem will change. `Category`, `Location`, `Confection Type` and `Brand` are shown as `tags` right under the product's name. And if there is also a `ripeness` selected it will be displayed in written format (e.g. "barely ripe", "ripe", "very ripe", etc.) and in graphical format as a `Progress bar`.

<img src="https://user-images.githubusercontent.com/64210185/122636956-50b79580-d0ec-11eb-95bf-b5e90e3c3647.jpg" width="500">

#### Updating a Product

By clicking on a product a modal pops up where all of the product's data can be edited. The presented form is very similar to the `Add product form`, but this time it is not possible to close an item once it is open (Except if you clicked on the box to open it, but then do not save it). To update the `Last checked date` you can open the `Edit Ingredient Modal` and simply click on `Update`. This will set the last `Last checked date` to now.

https://user-images.githubusercontent.com/64210185/122636996-92484080-d0ec-11eb-96e3-64349aa9503c.mp4

#### Textual Search and filtering products

At the top of the list you are provided with a `searchbar` and a `filter button`.

<img src="https://user-images.githubusercontent.com/64210185/122636969-64fb9280-d0ec-11eb-886d-6a72b0a94e60.jpg" width="500">

The searchbar allows you to search for the name of an item.

https://user-images.githubusercontent.com/64210185/122636973-6af17380-d0ec-11eb-8aab-74a46f17a0cc.mp4

By clicking on the filter button a modals pops up with 4 different tabs, namely:

- `Category`
- `Location`
- `Confection Type` and
- `Special`

While the first three are self-explanatory, in the special tab you can filter for products with `Missing data`. This will show all products where one of all the different possibilites of data insertion is missing.

https://user-images.githubusercontent.com/64210185/122637040-ccb1dd80-d0ec-11eb-968f-0d7688733e93.mp4

When you search for a product or filter the list the `Filter icon` will change to a filter remove icon. By clicking on this icon the search and/or the filter will be reseted.

### Expiring Soon Screen

While the name of this screen indicates that this screen will only show you a list of all items which are going to `expire soon`, in reality this screen provides you with four additional filters.

#### Expiring Soon

The `Expiring soon` filter will show a list of all items which are going to expire in the next three days or are already expired.

<img src="https://user-images.githubusercontent.com/64210185/122637048-d5a2af00-d0ec-11eb-9735-ac9732bb31c2.jpg" width="500">

#### Open

The `Open filter` will show a list of all items which are open.

<img src="https://user-images.githubusercontent.com/64210185/122637050-d9cecc80-d0ec-11eb-96ae-37481a35c8e0.jpg" width="500">

#### Ripe

The `Ripe filter` will show a list of all ripe products.

<img src="https://user-images.githubusercontent.com/64210185/122637056-ddfaea00-d0ec-11eb-835c-dbabd36af724.jpg" width="500">

#### To be checked

The `To be checked filter` will show a list of all prodcuts which have to be checked. An item has to be checked if they have not been checked for at least three and have a ripeness selected.

<img src="https://user-images.githubusercontent.com/64210185/122637060-e3f0cb00-d0ec-11eb-9171-ec4f9765d5c1.jpg" width="500">

## API and Components

The Application makes use of three different APIs and several React Native and custom Components.

### Firebase Realtime Database

The [Firebase Realtime Database API](https://rnfirebase.io/database/usage) is used to store inserted data persistently. The Firebase API is free to use (up to a certain point) and provides several different features. For this Application the Firebase Realtime Database has been selected as database since it allows users to see the inserted and/or updated products immediately.

### Expo Barcode Scanner

The [Expo Barcode Scanner API](https://docs.expo.io/versions/v40.0.0/sdk/bar-code-scanner/) is used to scan the barcodes of products. It allows the user to use their camera in the application and scan product's barcodes with it.

### Open Food Facts

Since scanning a barcode alone is not providing the user with enough information about the product. The [Open Food Facts API](https://world.openfoodfacts.org/) is called. This allows the application to read out the scanned product's name and brand.

### Custom components

For the application several custom components have been build, such as:

- `Filter Modal`
- `Add Ingredient Form`
- `Item Modal`
- `List Item` for Flatlist
- `Tag` and
- `Label`

## Known Bugs and Errors

Currently there are two known errors in the application.

- Adding a product will set its `Added date` and `Last checked date` in two hours from now.
- An item will not be visually updated in the `Expiring Soon Screen` until the filter is reloaded. (e.g. If you change the expiration date of a product in the `Expiring Soon Filter` and update the product the list visually not be updated until you select another filter and reselect the `Expiring Soon Filter`).

## Expo 

[Link to the expo snack](https://snack.expo.io/@git/github.com/JanWerth/KitchenApp-MobileEngineering) which, however, does not work. 

## Tests

The App has been tested on Android 10 (Mobile Phone) and Android 11 (Virtual Device).
