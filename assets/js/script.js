var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

var checkboxEl = $('input');
console.log(checkboxEl)

let proteinSubmit = $('#submit-protein');

// Test var for ingredients array
var ingredientsList = ["4  skinless, boneless chicken breasts", "2 sprigs fresh oregano", "1 sprig fresh rosemary", "2 ounces feta cheese in brine, with 2 ounces of brine reserved", "1 cup water", "1 clove garlic", "2 tablespoons olive oil", "freshly cracked black pepper to taste", "4 slices  lemon"]

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
  // searchByIngredient(protein);

save(checkboxEl);
}

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

function IngredientParser(ingredients) {
  console.log(ingredients);
  //console.log each ingredients as a string
}


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
    console.log(result);
    // IngredientParser(result);
  } catch (error) {
    console.error(error);
  }

}

function ParseRecipeDetailsIngredients(ingredients) {
  // manually setting ingredients to the array of ingredients from Recipe API
  ingredients = ingredientsList;

  //updateList now has the ingredient array, ready to be manipulated
  let updateList = ingredients;
  console.log(updateList);

  

  for(let i = 0; i < ingredients.length; i++){
    getNutritionAPI(ingredients[i]);
  }

  // console.log(ingredients);
}

function searchByIngredient(ingredients) {


  var inclIngredientsQuery = ingredients.join(", ");

  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://all-in-one-recipe-api.p.rapidapi.com/search',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'fd4e7eb6e0mshcf9ac3dfb85202bp1cca0djsnca41d4a32995',
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
      'X-RapidAPI-Key': 'fd4e7eb6e0mshcf9ac3dfb85202bp1cca0djsnca41d4a32995',
      'X-RapidAPI-Host': 'all-in-one-recipe-api.p.rapidapi.com'
    }
  };

  $.ajax(settings).done(function (response) {
    // ParseRecipeDetailsIngredients(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Name);
    console.log(response.recipe.data.Description);
    console.log(response.recipe.data.Directions);
    console.log(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Time);



  });
};
load(checkboxEl);