var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

var acumulator = 0;

let proteinSubmit = $('#submit-protein');


var FNB = $('#fetch-nutrition-button');

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
  searchByIngredient(protein);
}

// Submit event on the form
proteinSubmit.on('click', handleFormSubmit);

function IngredientParser(ingredients) {
  return ingredients.calories;
  // console.log(ingredients);
  // let acumulator = 0;

  // for(let i=0; i < ingredients.length; i++){
  //   acumulator += ingredients.calories;
  // }
  // console.log(acumulator);
  // //console.log each ingredients as a string
}

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
    if(result[0].calories){
      acumulator += result[0].calories;
    }
  } catch (error) {
    console.error(error);
  }

}



async function ParseRecipeDetailsIngredients(ingredients) {

  //updateList now has the ingredient array, ready to be manipulated
  console.log(ingredients);
  //Code for turning ¼ into something readable by nutrition api

  // const ingredients = [
  //   '2  skinless, boneless chicken breast halves',
  //   '1 (1.27 ounce) packet dry fajita seasoning, divided',
  //   '1 tablespoon vegetable oil',
  //   '1 (15 ounce) can black beans, rinsed and drained',
  //   '1 (11 ounce) can Mexican-style corn',
  //   '½ cup salsa',
  //   '1 (10 ounce) package mixed salad greens',
  //   '1  onion, chopped',
  //   '1  tomato, cut into wedges'
  // ];
  
  const updatedIngredients = ingredients.map(ingredient => {
    // Regular expression to match different fractions (explicitly including spaces before and after)
    const fractionRegex = /\s*\/|\d+\/\d+\s*/g;
  
    // Replace each matched fraction with its decimal equivalent
    return ingredient.replace(fractionRegex, match => {
      if (match === "/") {
        return "0.5"; // Handle single slash as half
      } else {
        const [numerator, denominator] = match.trim().split("/"); // Trim spaces before splitting
        return (Number(numerator) / Number(denominator)).toFixed(2); // Convert and round
      }
    });
  });
  
  console.log(updatedIngredients);

  
  for(let i = 0; i < ingredients.length; i++){
    await getNutritionAPI(updatedIngredients[i]);

  }
  console.log(acumulator);
  // console.log(ingredients);
}




// var inclIngredients = ["chicken", "salt"];



function searchByIngredient(ingredients) {


  var inclIngredientsQuery = ingredients.join(", ");

  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://all-in-one-recipe-api.p.rapidapi.com/search',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '8362023de3msh764288503d79e22p14e4a6jsn3b9cda46e2b0',
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
      'X-RapidAPI-Key': '8362023de3msh764288503d79e22p14e4a6jsn3b9cda46e2b0',
      'X-RapidAPI-Host': 'all-in-one-recipe-api.p.rapidapi.com'
    }
  };

  $.ajax(settings).done(function (response) {
    ParseRecipeDetailsIngredients(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Name);
    console.log(response.recipe.data.Description);
    console.log(response.recipe.data.Directions);
    // console.log(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Time);



  });
};
