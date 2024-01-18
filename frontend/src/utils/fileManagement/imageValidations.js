const validateImage = (file) => {

    if (!file) {
        return { valid: false, message: 'No file selected' };
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
        return { valid: false, message: 'Image size should below 5MB)' };
    }

    const allowedImageTypes = ['image/jpeg', 'image/png'];
    if (!allowedImageTypes.includes(file.type)) {
        return { valid: false, message: 'Invalid image type' };
    }

    return { valid: true };
};

export default validateImage