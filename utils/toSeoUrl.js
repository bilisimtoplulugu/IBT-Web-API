function preparingToSeo(url) {
  return url
    .toString() // Convert to string
    .normalize('NFD') // Change diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove illegal characters
    .replace(/\s+/g, '-') // Change whitespace to dashes
    .toLowerCase() // Change to lowercase
    .replace(/&/g, '-ve-') // Replace ampersand
    .replace(/[^a-z0-9\-]/g, '') // Remove anything that is not a letter, number or dash
    .replace(/-+/g, '-') // Remove duplicate dashes
    .replace(/^-*/, '') // Remove starting dashes
    .replace(/-*$/, ''); // Remove trailing dashes
}

export default (url) => {
  const newUrl = preparingToSeo(url);
  var encodedUrl = newUrl.toString().toLowerCase();

  // replace & with and
  encodedUrl = encodedUrl.split(/\&+/).join('-ve-');

  // remove invalid characters
  encodedUrl = encodedUrl.split(/[^a-z0-9]/).join('-');

  // remove duplicates
  encodedUrl = encodedUrl.split(/-+/).join('-');

  // trim leading & trailing characters
  encodedUrl = encodedUrl.trim('-');

  return encodedUrl;
};
