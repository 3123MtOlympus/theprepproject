var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');


function handleFormSubmit(event) {
  // Prevent the default behavior
  event.preventDefault();

// Protein Section 

  // Select all checked options
  var checkedEl = $('input:checked');
  var protein = [];

  // Loop through checked options to store in array
  $.each(checkedEl, function () {
    protein.push($(this).val());
  });
  console.log('Protein: ', selected.join(', '));

// Submit event on the form
proteinFormEl.on('submit', handleFormSubmit);


// Carbs Section

 // Select all checked options
var checkedEl = $('input:checked');
var carbs = [];

// Loop through checked options to store in array
$.each(checkedEl, function () {
  carbs.push($(this).val());
});
console.log('Carbs: ', selected.join(', '));

// Submit event on the form
carbsFormEl.on('submit', handleFormSubmit);


// Fats section

 // Select all checked options
var checkedEl = $('input:checked');
var fats = [];

// Loop through checked options to store in array
$.each(checkedEl, function () {
  fats.push($(this).val());
});
console.log('Fats: ', selected.join(', '));

// Submit event on the form
fatsFormEl.on('submit', handleFormSubmit);

}

// Trying to set up action after submit button is pressed, action should go to the next questiomn
let proteinSubmit = document.getElementById('#submit-protein');
let carbsSubmit = document.getElementById('#submit-carbs');
let fatsSubmit = document.getElementById('#submit-fats');


// Submit and go to to next slide - unsure how to print
optionsElement.innerHTML = "";
for (let proteinSubmit) {
  const button = document.createElement(".submit-protein");
  button.textContent = option;
  button.submit = () => checkAnswer(option);
  optionsElement.appendChild(button);
}