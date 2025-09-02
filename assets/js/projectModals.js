function loadProjectModal(project) {
    $('#projectModal').remove();

    let modalPath;

    switch (project) {
        case 'acadalyze':
            modalPath = 'assets/modals/acadalyze.html';
            break;
        case 'tubeline':
            modalPath = 'assets/modals/tubeline.html';
            break;
        case 'caltron':
            modalPath = 'assets/modals/caltron.html';
            break;
        default:
            console.error('Unknown project:', project);
            alert('Invalid project selected.');
            return;
    }

    $.get(modalPath)
        .done(function (modalHTML) {
            $('body').append(modalHTML);
            $('#projectModal').modal('show');
        })
        .fail(function () {
            console.error('Error loading modal from:', modalPath);
            alert('Could not load project details.');
        });
}
