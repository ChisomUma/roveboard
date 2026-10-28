// Saved demo data stores only a sample image's name (e.g. 'thumb-pompeii'), so those files keep their names.
// Bump this whenever a sample photo is replaced, so browsers fetch the new file instead of a cached old one.
const SAMPLE_IMAGE_VERSION = 2;

export const sampleImage = name => `/images/${name}.jpg?v=${SAMPLE_IMAGE_VERSION}`;
