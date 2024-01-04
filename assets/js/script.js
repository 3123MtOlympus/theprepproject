var formEl = $('#pizza-form');
var firstNameEl = $('input[name="first-name"]');
var lastNameEl = $('input[name="last-name"]');
var emailEl = $('input[name="email"]');
var githubEl = $('input[name="github"]');

function handleFormSubmit(event) {
  // Prevent the default behavior
  event.preventDefault();

  console.log('First Name:', firstNameEl.val());
  console.log('Last Name:', lastNameEl.val());
  console.log('Email:', emailEl.val());
  console.log('GitHub:', githubEl.val());

  // Select all checked options
  var checkedEl = $('input:checked');
  var selected = [];

  // Loop through checked options to store in array
  $.each(checkedEl, function () {
    selected.push($(this).val());
  });
  console.log('Toppings: ', selected.join(', '));

  // Clear input fields
  $('input[type="text"]').val('');
  $('input[type="email"]').val('');
  $('input[type="checkbox"]').prop('checked', false);
}

// Submit event on the form
formEl.on('submit', handleFormSubmit);


var inclIngredients = ["chicken", "salt"];
var inclIngredientsQuery = inclIngredients.join(", ");

console.log(inclIngredientsQuery)


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
}