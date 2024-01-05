var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

let proteinSubmit = $('#submit-protein');


var FNB = $('#fetch-nutrition-button');
var uniqueEl = $('#unique');
console.log(uniqueEl);
console.log(FNB);
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
  console.log(ingredients);
  //console.log each ingredients as a string
}

async function getNutritionAPI() {
  var ingredients = "4  skinless, boneless chicken breasts";
  const url = 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition?query=' + ingredients;
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
    // console.log(result);
    IngredientParser(result);
  } catch (error) {
    console.error(error);
  }

}

FNB.on('click', getNutritionAPI);




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
    console.log(response.recipe.data.Name);
    console.log(response.recipe.data.Description);
    console.log(response.recipe.data.Directions);
    console.log(response.recipe.data.Ingredients);
    console.log(response.recipe.data.Time);



  });
};
