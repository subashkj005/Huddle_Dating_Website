export function createFormData(formValues, files) {
    const formData = new FormData();
   
    if (formValues) {
      for (const [key, value] of Object.entries(formValues)) {
        formData.append(key, value);
      }
    }
   
    if (files) {
      for (const file of files) {
        formData.append("files", file);
      }
    }
   
    return formData;
   }