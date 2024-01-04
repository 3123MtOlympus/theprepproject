$(".food-entry-btn").on("click", function () {
    // Use DOM traversal to get the "hour-x" id of the time-block containing the button
    var userInput = $(this).closest(".food-entry").attr("id");
    
    // Save the user input in local storage using the time-block id as a key
    var userDescription = $(this).siblings(".food-entry").val().trim();
    localStorage.setItem(userInput, userDescription);
  });