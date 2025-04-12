import imageToBase64 from "image-to-base64/browser";

// TODO: This does not work as expected, i need to figure out
// how to save and upload photos
export async function convertImageToBase64(imagePath) {
  // Just a note for code style:
  // This package is a little old and their docs used a promise creation,
  // rather than async await, so I decided to follow to be safe.
  return new Promise((resolve, reject) => {
    imageToBase64(imagePath) // Path to the image
      .then((response) => {
        resolve(response); // "cGF0aC90by9maWxlLmpwZw=="
      })
      .catch((error) => {
        // TODO: Handle error nicely
        reject(error); // Passes along any errors
      });
  });
}

export const formatBase64Image = (base64String, mimeType = "image/jpeg") => {
  if (!base64String) return null;
  if (base64String.startsWith("data:image")) return base64String;
  return `data:${mimeType};base64,${base64String}`;
};
