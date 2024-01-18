export function createFormData(formValues, files = null) {
  const formData = new FormData();

  if (formValues) {
    for (const [key, value] of Object.entries(formValues)) {
      if (key === "works" || key === "prompts") {
        formData.append(key, JSON.stringify(value));
      }else {

        formData.append(key, value);
      }
    }
  }

  if (files) {
    files.map((file, index)=> {
      formData.append(`img-${file.id}`, file.image)
    })
  }

  return formData;
}
