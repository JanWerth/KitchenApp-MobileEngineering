# Mobile Engineering Project

Application Project of Jan Werth for UniBZ's [Engineering of Mobile Systems](https://github.com/rrobbes/EngineeringOfMobileSystemsV2) course.

## Setup

To run this project you have to follow several steps:

1. Install [NodeJS](https://nodejs.org/en/).
2. Install [expo-cli](https://docs.expo.io/get-started/installation/) with the Node Package Manager. To do this run `https://docs.expo.io/get-started/installation/` on the command line.
3. Clone the project in your IDE of choice .
4. Run `npm install` or `yarn install` in the cloned folder.
5. Run `expo-go` to start the app.

## The App

This application is to track kitchen ingredients. You can insert and modify inserted ingredients, search for them or filter them based on extra information you provided. The application consists of three screen, an `Add Ingredient` Screen, a `List` Screen and an `Expiring Soon` Screen.

### Add Ingredient Screen

In the `Add Ingredient` Screen you can insert data in two ways. The traditional way by inserting data in written format or by scanning a barcode on a Product.

#### Inserting Written Data

To insert data in the written format you are presented with a form. Of all the fields, which at first are hidden and can be shown by clicking on the `Add more information` button, only the Name field is necessary and it also says so in the Application.

_Screenshot of TextInput and of Alert_

When you click on the `Add more information` button you are presented with the full form. The form consist of an additional text input field for the product's brand name, three pickers for the category, the location where the product is stored and the confection type. Additionally, you can select an expiration date and set the item to open. This will automatically open the expiration date picker with a maximum date set in week. (By selecting today's date in the expiration date picker the date will be set to `Not selected`). Furthermore, fresh products (selected `Fresh` in the confection type picker) will provide you with two additional fields: a ripeness picker to selects the item's ripeness and a Frozen switch. By switching it to on the expiration date will be set to in 6 months from today.

_Gif of the insertion Process in written format_

#### Inserting data by scanning a barcode

You can also insert a product by scanning its barcode. To use this feature you have to agree to the usage of you camera asked by the app the first time you launch it (if you decline it will ask you everytime you open the app).

_Screenshot of the permission question_

_Gif of Scanning a barcode_

Once you scanned a barcode an Alert will pop open providing you with information on the scanned product and giving you three options to choose from:

- Cancel. Clicking on this will close the Alert without inserting the scanned product to the database.
- Scan again. The Barcode scanner will open once again so you can scan a product again in case the wrong bardcode got scanned.
- Save. This will save the scanned product to the database.

## List Screen

This screen shows all inserted products in different views based on the provided data.

_Screenshot of a simple (baguette) and a complex product (banana)_

### Updating a Product

By clicking on a product a modal pops up where all of the product's data can be edited.

_Screenshot/Gif of the Modal_

### Textual Search and filtering products

At the top of the list you are provided with a searchbar and a filter button.

_Screenshot of the topbar_

The searchbar allows you to search for the name of an item.

_Using Search bar gif_

By clicking on the filter button a modals pops up with 4 different tabs, namely:

- Category
- Location
- Confection Type and
- Special

While the first three are self-explanatory, in the special tab you can filter for products with missing data. This will show all products where one of all the different possibilites of data insertion is missing.

_Gif of the filtermodal_

When search for a product or filter the list the filter Icon will change to a filter remove icon. By clicking on this icon all the search or the filter will be reseted.

## Expiring Soon Screen

While the name of this screen indicates that this screen will only show you a list of all items which are going to expire soon, in reality this screen provides you with four additional filters.

### Expiring Soon

The expiring soon filter will show a list of all items which are going to expire in the next three days or are already expired.

_Screenshot_

### Open

The open filter will show a list of all items which are open.

_Screenshot_

### Ripe

The ripe filter will show a list of all ripe products.

_Screenshot_

### To be checked

The to be checked filter will show a list of all prodcuts which have to be checked. An item has to be checked if they have not been checked for at least three and have a ripeness selected.

_Screenshot_

## Tests

The App has been tested on Android 10 (Mobile Phone) and Android 11 (Virtual Device).
