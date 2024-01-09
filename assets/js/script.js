var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

var calorieAcumulator = 0;

let proteinSubmit = $('#submit-protein');

var checkboxEl = $('input');
console.log(checkboxEl)

function handleFormSubmit(event) {
  // Prevent the default behavior
  event.preventDefault();

  // Protein Section 
  var protein = [];

  // Select all checked options
  var checkedEl = $('input:checked');

  console.log(checkedEl);


  // Loop through checked options to store in array
  $.each(checkedEl, function () {
    protein.push($(this).val());
  });

  console.log(protein);

  //API call
  searchByIngredient(protein);

  save(checkboxEl);
}

var modalBody = $('.modal-body');



function save(event) {
  // uses DOM traversal to select the text content of the corresponding save button
  $.each(event, function () {
    localStorage.setItem($(this).attr("value"), JSON.stringify($(this).prop('checked')));
  }
  )
};

function load(event) {
  // uses DOM traversal to select the text content of the corresponding save button
  $.each(event, function () {
    var checkboxInput = JSON.parse(localStorage.getItem($(this).attr("value")));
    $(this).prop('checked', checkboxInput);
  }
  )
};

// Submit event on the form
proteinSubmit.on('click', handleFormSubmit);



// Nutrition API 
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

    if (result[0].calories) {
      calorieAcumulator += result[0].calories;
    }
  } catch (error) {
    console.error(error);
  }

}




async function ParseRecipeDetailsIngredients(ingredients) {
  //Code for turning ¼ into something readable by nutrition api
  var updateIngredients = ingredients;

  for (let i = 0; i < updateIngredients.length; i++) {
    ingredients[i] = updateIngredients[i].replace("¼", "0.25");
    ingredients[i] = updateIngredients[i].replace("½", "0.5");
    ingredients[i] = updateIngredients[i].replace("⅓", "0.333");
    ingredients[i] = updateIngredients[i].replace("⅔", "0.666");
    ingredients[i] = updateIngredients[i].replace("¾", "0.75");
    ingredients[i] = updateIngredients[i].replace("⅛", "0.125");
  }

  for (let i = 0; i < ingredients.length; i++) {
    await getNutritionAPI(updateIngredients[i]);

  }
  var calories = $('<h4>').text('Calories: ' + calorieAcumulator);
  modalBody.append(calories);
  calorieAcumulator = 0;
};


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
    recipeDetails(response.recipe.data[randomIndex].id);
  });
};


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
    ParseRecipeDetailsIngredients(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Name);
    console.log(response.recipe.data.Description);
    console.log(response.recipe.data.Directions);
    console.log(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Time);

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

load(checkboxEl);

