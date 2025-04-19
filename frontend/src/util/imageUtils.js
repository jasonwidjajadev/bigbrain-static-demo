// import imageToBase64 from "image-to-base64/browser";

// TODO: This does not work as expected, i need to figure out

// Converts a File object to base64 string
export async function convertFileToBase64(file, stripPrefix = false) {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const result = await readFileAsDataURL(file);

    // If stripPrefix is true, remove the data URL prefix
    if (stripPrefix && result.includes(",")) {
      return result.split(",")[1];
    }

    return result;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw error;
  }
}

// Helper function that wraps FileReader in a promise
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const formatBase64Image = (base64String, mimeType = "image/jpeg") => {
  if (!base64String) return null;
  if (base64String.startsWith("data:image")) return base64String;
  return `data:${mimeType};base64,${base64String}`;
};
