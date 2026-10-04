// Poster handling happens fully in the browser: validate, shrink, and turn into a small data URL.
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function posterFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!TYPES.includes(file.type)) return reject(new Error('Choose a JPG, PNG or WEBP image.'));
    if (file.size > 8 * 1024 * 1024) return reject(new Error('The image must be under 8 MB.'));

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 600 / img.height, 400 / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; // PNG transparency becomes white in the JPEG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image.'));
    };
    img.src = url;
  });
}
