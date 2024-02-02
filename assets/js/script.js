// 
var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

// sets the calorie total on page load to 0
var calorieAcumulator = 0;

// element selector for the submit button
let proteinSubmit = $('#submit-protein');

// selects all checkboxes on page for saving/loading local storage
var checkboxEl = $('input');
console.log(checkboxEl)

// function for when the submit button is pressed
function handleFormSubmit(event) {
  // Prevent the default behavior
  event.preventDefault();

  // creates an empty array which will be populated with the selected ingredients
  var protein = [];

  // Select all checked options
  var checkedEl = $('input:checked');

  console.log(checkedEl);


  // Loop through checked options to store in array
  $.each(checkedEl, function () {
    protein.push($(this).val());
  });

  console.log(protein);

  //API call for first API to get a recipe id based on ingredients
  searchByIngredient(protein);

  // saves checkbox inputs to local storage
  save(checkboxEl);
}

// element selector for the mmodal body which will be populated by the recipe
var modalBody = $('.modal-body');


// local storage function to save checkbox inputs
function save(event) {
  // uses this to save the state of each checkbox to local storage with the associated checkbox name
  $.each(event, function () {
    localStorage.setItem($(this).attr("value"), JSON.stringify($(this).prop('checked')));
  }
  )
};

// local storage function on page load to populate the checkboxes
function load(event) {
  // parses and loads the state of each checkbox from local storage then sets the checkbox state to match
  $.each(event, function () {
    var checkboxInput = JSON.parse(localStorage.getItem($(this).attr("value")));
    $(this).prop('checked', checkboxInput);
  }
  )
};

// on click event on the submit button, had to be changed from submit due to unintended behavior
proteinSubmit.on('click', handleFormSubmit);



// Nutrition API call using the ingredient array recieved from the All in one Recipe API as an input
// Input is first parsed to remove unicode fractions for better results
async function getNutritionAPI(ingredient) {
  const url = 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition?query=' + ingredient;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8362023de3msh764288503d79e22p14e4a6jsn3b9cda46e2b0',
      'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // totals calories to the calorie acumuulator over multiple API calls
    // other nutritional information was availible as part of the response
    if (result[0].calories) {
      calorieAcumulator += result[0].calories;
    }
  } catch (error) {
    console.error(error);
  }

}



// ingredients output from All in one Recipe API is first passed through here before being passed to the Nutririton API
async function ParseRecipeDetailsIngredients(ingredients) {
  //Code for turning ¼ into something readable by nutrition api
  // makes a new array that will be updated when we replace unicode elements
  var updateIngredients = ingredients;
  // Checks each element of the ingreients array for unicode fractions and replaces them with decimal value if found
  for (let i = 0; i < updateIngredients.length; i++) {
    ingredients[i] = updateIngredients[i].replace("¼", "0.25");
    ingredients[i] = updateIngredients[i].replace("½", "0.5");
    ingredients[i] = updateIngredients[i].replace("⅓", "0.333");
    ingredients[i] = updateIngredients[i].replace("⅔", "0.666");
    ingredients[i] = updateIngredients[i].replace("¾", "0.75");
    ingredients[i] = updateIngredients[i].replace("⅛", "0.125");
  }

  // calls the nutrition API for each element of the ingredients array
  for (let i = 0; i < ingredients.length; i++) {
    await getNutritionAPI(updateIngredients[i]);

  }
  // appends the calorie total to the page in the modal body
  var calories = $('<h4>').text('Calories: ' + calorieAcumulator);
  modalBody.append(calories);
  // sets the calorie accumulator back to 0 so that the next time the submit button is pushed the total calories displayed are only for the most recently called recipe
  calorieAcumulator = 0;
};

// first API call to the All in one Recipe API using the selected checkbox elements as an input
function searchByIngredient(ingredients) {


  var inclIngredientsQuery = ingredients.join(", ");
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://all-in-one-recipe-api.p.rapidapi.com/search',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'b4b0019b9dmshd4af1eb6ee26458p139185jsn6473de9e6386',
      'X-RapidAPI-Host': 'all-in-one-recipe-api.p.rapidapi.com'
    },
    processData: false,
    data: '{\r\n    "ingredients": "' + inclIngredientsQuery + '"\r\n}'
  };

  $.ajax(settings).done(function (response) {
    console.log(response.recipe.data.length)
    var randomIndex = Math.floor(response.recipe.data.length * Math.random());
    console.log(randomIndex)
    console.log(response.recipe.data[randomIndex].id);
    // API returns an array of 20 recipe ids that potentially match the query
    // function randomly selects a recipe then calls the All in one API again, this time using the recipe id
    recipeDetails(response.recipe.data[randomIndex].id);
  });
};

// API call to All in one Recipe again, this time using a recipe id as an input
function recipeDetails(id) {
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://all-in-one-recipe-api.p.rapidapi.com/details/' + id,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b4b0019b9dmshd4af1eb6ee26458p139185jsn6473de9e6386',
      'X-RapidAPI-Host': 'all-in-one-recipe-api.p.rapidapi.com'
    }
  };

  $.ajax(settings).done(function (response) {
    // Calls the recipe parser function with the ingredients array as an input
    ParseRecipeDetailsIngredients(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Name);
    console.log(response.recipe.data.Description);
    console.log(response.recipe.data.Directions);
    console.log(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Time);

    // API returns an object that includes: Recipe Name, descriptiion, directions, ingredients, prep time
    // API returns more information that was not used
    // Recipe details were then added to the modal body
    var recipeName = $('<h1>').text(response.recipe.data.Name);
    var recipeDesc = $('<h4>').text(response.recipe.data.Description);
    var recipeDir = $('<ul>');
    var recipeIng = $('<ul>');
    var recipeTime = $('<ul>');

    $.each(response.recipe.data.Directions, function () {
      var getDirections = $('<li>').text(this);
      recipeDir.append(getDirections);
    }
    );

    $.each(response.recipe.data.Ingredients, function () {
      var getIngredients = $('<li>').text(this);
      recipeIng.append(getIngredients);
    }
    );

    $.each(response.recipe.data.Time, function () {
      var getTime = $('<li>').text(this);
      recipeTime.append(getTime);
    }
    );

    modalBody.append(recipeName);
    modalBody.append(recipeDesc);
    modalBody.append(recipeDir);
    modalBody.append(recipeIng);
    modalBody.append(recipeTime);




  });
};

// calls the getlocalstorage function on page load
load(checkboxEl);

