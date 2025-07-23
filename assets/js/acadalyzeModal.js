function loadAcadalyzeModal() {
    // Remove existing modal if present
    $('#projectModal').remove();

    // Load modal content from external file
    $.get('assets/modals/acadalyze.html')
        .done(function (modalHTML) {
            // Add modal to body
            $('body').append(modalHTML);

            // Show the modal
            $('#projectModal').modal('show');
        })
        .fail(function () {
            console.error('Error loading modal');
            alert('Could not load project details');
        });
}