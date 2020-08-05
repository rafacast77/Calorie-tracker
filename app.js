/** @format */

// Storage Controller

////////////////////////////////////////////////////////////////////////////////
// ITEM CONTROLLER
////////////////////////////////////////////////////////////////////////////////
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // State Obj
  const ItemState = {
    itemList: [],
    currentItem: null,
    calorieTracker: 0,
  };

  // PUBLIC METHODS
  return {
    // Set the currentItem for edit
    // setCurrentItem: function(item){
    //   ItemState.currentItem = item;
    //   return currentItem;
    // },

    // Returns a item in the list based on it's ID
    getItemById: function (id) {
      id = parseInt(id);
      ItemState.itemList.forEach((item) => {
        if (item.id === id) {
          ItemState.currentItem = item;
        }
      });
      return ItemState.currentItem;
    },

    // getItemById: function(id){
    //  id = parseInt(id);
    //  let itemToReturn = null;
    //   ItemState.itemList.forEach((item)=>{
    //     if(item.id === id){
    //       itemToReturn = item;
    //     }
    //   })
    //   return itemToReturn;
    // },

    // Iterates through all list item, sums up their calories and returns them.
    sumTotalCalories: function () {
      let totalCalrories = 0;
      ItemState.itemList.forEach((item) => {
        totalCalrories += item.calories;
      });
      ItemState.calorieTracker = totalCalrories;
      return ItemState.calorieTracker;
    },

    // Creates a new Item; adds it to the state and returns it
    addNewItem: function (name, calories) {
      // Quick way of creating unique ID
      const id = new Date().getTime(),
        newItem = new Item(id, name, calories);
      // Adds new Item to state
      ItemState.itemList.push(newItem);

      return newItem;
    },

    // Returns an array list representing the list items
    getItems: function () {
      return ItemState.itemList;
    },

    // Returns the full state of the object
    dataLog: function () {
      return ItemState;
    },
  };
})();

////////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER
////////////////////////////////////////////////////////////////////////////////
const UICtrl = (function () {
  // Contains the reference to all DOM elements
  const UISelectors = {
    listItems: '#item-list',
    addBtn: '#add-item',
    itemNameInput: '#name',
    itemCaloriesInput: '#calories',
    totalCalories: '#total-calories',
    deleteMeal: '#delete-meal',
    updateMeal: '#update-meal',
    back: '#back',
    editItem: '#edit-item',
  };

  // PUBLIC METHODS
  return {
    // Back button
    backBtn: function () {
      UICtrl.clearEditState();
      UICtrl.clearInputs();
    },
    // Hides add button and shows update, delete, back.
    showEditState: function () {
      document.querySelector(UISelectors.deleteMeal).style.display = 'inline';
      document.querySelector(UISelectors.updateMeal).style.display = 'inline';
      document.querySelector(UISelectors.back).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    // Loads item to edit on DOM inputs
    loadItemEditOnDOM: function (itemToEdit) {
      document.querySelector(UISelectors.itemNameInput).value = itemToEdit.name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        itemToEdit.calories;
      UICtrl.showEditState();
    },

    // Clears editState
    clearEditState: function () {
      document.querySelector(UISelectors.deleteMeal).style.display = 'none';
      document.querySelector(UISelectors.updateMeal).style.display = 'none';
      document.querySelector(UISelectors.back).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'block';
    },

    // Clears meal and calories inputs
    clearInputs: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    // Displays the total calorie parameter number into the DOM
    refreshTotalCaloriesDOM: function (calories) {
      document.querySelector(UISelectors.totalCalories).textContent = calories;
    },
    // Adds new Item to DOM when ADD MEAL is clicked
    addNewItemToUI: function (newItme) {
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `${newItme.id}`;
      li.innerHTML = `
      <strong>${newItme.name}: </strong><em>${newItme.calories} Calories</em> <a href="#" class="secondary-content"><i class="fa fa-pencil" id="edit-item"></i></a>
      `;
      document.querySelector(UISelectors.listItems).appendChild(li);
    },
    // Returns an object with the current meal and calorie inputs
    getInputs: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: parseInt(
          document.querySelector(UISelectors.itemCaloriesInput).value
        ),
      };
    },

    // Loads all Items in the list to the DOM
    loadDOMItems: function (items) {
      let itemHTML = '';
      items.forEach((item) => {
        itemHTML += `<li class="collection-item" id="${item.id}"><strong>${item.name}: </strong><em>${item.calories} Calories</em> <a href="#" class="secondary-content"><i class="fa fa-pencil" id="edit-item"></i></a></li>`;
      });

      document.querySelector(UISelectors.listItems).innerHTML = itemHTML;
    },

    // Returns a reference to all UI DOM elements
    getUISelectors: function () {
      return UISelectors;
    },
  };
})();

////////////////////////////////////////////////////////////////////////////////
// APP CONTROLLER
////////////////////////////////////////////////////////////////////////////////
const AppCtrl = (function (ItemCtrl, UICtrl) {
  const UISelectors = UICtrl.getUISelectors();

  // Load event listeners
  const loadEventListeners = function () {
    // ADD MEAL event listener
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', addItemOnSubmit);

    // EDIT event listener
    document
      .querySelector(UISelectors.listItems)
      .addEventListener('click', editListItem);

    // Back button event listener
    document
      .querySelector(UISelectors.back)
      .addEventListener('click', UICtrl.backBtn);

    // update button event listener
    document
      .querySelector(UISelectors.updateMeal)
      .addEventListener('click', updateMeal);
  };

  // When ADD MEAL function
  const addItemOnSubmit = function (e) {
    const inputs = UICtrl.getInputs(),
      validateName = /^[a-zA-Z ]+$/;

    // If validate the input fields
    if (validateName.test(inputs.name) && inputs.calories) {
      // Adds new item to state
      newItem = ItemCtrl.addNewItem(inputs.name, inputs.calories);
      UICtrl.addNewItemToUI(newItem);

      // Adds the total calories; adds it to state and DOM
      const calories = ItemCtrl.sumTotalCalories();
      UICtrl.refreshTotalCaloriesDOM(calories);

      // Clear inputs
      UICtrl.clearInputs();
    } else {
      console.log('Invalid inputs');
    }

    e.preventDefault();
  };

  // When EDIT is clicked
  const editListItem = function (e) {
    if (e.target.id === 'edit-item') {
      const itemToEdit = ItemCtrl.getItemById(
        e.target.parentElement.parentElement.id
      );
      // const currentItemToEdit = ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.loadItemEditOnDOM(itemToEdit);
    }
  };

  // When UPDATE is clicked
  const updateMeal = function (e) {
    const currentItem = ItemCtrl.updateItem;
  };

  // // When BACK is clicked
  // const backBtn = function (e) {};
  return {
    init: function () {
      console.log('Initializing app...');

      // Clears editState
      UICtrl.clearEditState();
      // Get items from list and load them to the DOM on init
      const items = ItemCtrl.getItems();
      UICtrl.loadDOMItems(items);

      // Get calories and load it to Total Calories on init
      const calories = ItemCtrl.sumTotalCalories();
      UICtrl.refreshTotalCaloriesDOM(calories);

      // Load even listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

AppCtrl.init();
