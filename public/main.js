document.addEventListener("DOMContentLoaded", function () {
  const applyButton = document.getElementById("applyButton");
  if (applyButton) {
    applyButton.addEventListener("click", function (event) {
      const jobId = event.currentTarget.getAttribute("data-job-id"); // Get the job ID
      // Send a request to check the application deadline
      axios
        .get(`/check-application-deadline/${jobId}`)
        .then((response) => {
          if (response.data.error) {
            // Show an alert with the error message
            alert(response.data.message);
          } else {
            // Trigger the modal if the deadline has not passed
            const applyModal = new bootstrap.Modal(
              document.getElementById("applyModal")
            );
            applyModal.show();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "An error occurred while checking the application deadline. Please try again later."
          );
        });
    });
  }
});
