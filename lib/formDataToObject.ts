// function formDataToObject(
//   formData: FormData
// ): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
//   const formDataObject: Record<
//     string,
//     FormDataEntryValue | FormDataEntryValue[]
//   > = {};

//   formData.forEach((value, key) => {
//     // Check if the key already exists in the formDataObjectect
//     if (formDataObject[key]) {
//       // Convert to an array if not already an array
//       if (!Array.isArray(formDataObject[key])) {
//         formDataObject[key] = [formDataObject[key]];
//       }
//       // Type assertion here since formDataObject[key] is now definitely an array
//       (formDataObject[key] as FormDataEntryValue[]).push(value);
//     } else {
//       formDataObject[key] = value;
//     }
//   });

//   return formDataObject;
// }

/**
 * this function converts a FormData object into a regular JavaScript object
 * @param formData the formdata to be modified
 * @returns modified formData object
 */

function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};

  formData.forEach((value, key) => {
    setValue(obj, key, value);
  });

  return obj;
}

function setValue(
  obj: Record<string, any>,
  path: string,
  value: FormDataEntryValue
) {
  const keys = path.replace(/\]/g, '').split('[');
  keys.reduce((acc, key, index) => {
    if (index === keys.length - 1) {
      // If it's the last key, assign the value
      if (acc[key]) {
        // If the key already exists and is not an array, convert it to an array
        if (!Array.isArray(acc[key])) {
          acc[key] = [acc[key]];
        }
        acc[key].push(value);
      } else {
        acc[key] = value;
      }
    } else {
      // If the key doesn't exist, create an empty object/array
      if (!acc[key]) {
        acc[key] = isNaN(Number(keys[index + 1])) ? {} : [];
      }
    }
    return acc[key];
  }, obj);
}

export default formDataToObject;
