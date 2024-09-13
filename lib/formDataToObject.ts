function formDataToObject(
  formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
  const formDataObject: Record<
    string,
    FormDataEntryValue | FormDataEntryValue[]
  > = {};

  formData.forEach((value, key) => {
    // Check if the key already exists in the formDataObjectect
    if (formDataObject[key]) {
      // Convert to an array if not already an array
      if (!Array.isArray(formDataObject[key])) {
        formDataObject[key] = [formDataObject[key]];
      }
      // Type assertion here since formDataObject[key] is now definitely an array
      (formDataObject[key] as FormDataEntryValue[]).push(value);
    } else {
      formDataObject[key] = value;
    }
  });

  return formDataObject;
}

export default formDataToObject;
