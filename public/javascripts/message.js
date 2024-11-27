function showAlert(title, text, icon, showCancelButton = false) {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
    });
}