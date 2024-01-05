var proteinFormEl = $('.group-protein');
var carbsFormEl = $('.group-carbs');
var fatsFormEl = $('.group-fats');

let proteinSubmit = $('#submit-protein');


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

}

// Submit event on the form
proteinSubmit.on('click', handleFormSubmit);