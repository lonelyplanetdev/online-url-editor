import { z } from 'zod';
const validHosts = [
  'arb-tools-images.s3.us-east-1.amazonaws.com',
  'dcs-media-library-uploads.s3.us-west-1.amazonaws.com',
];

// Define the imageUrls array schema with bubbled-up errors
const imageUrlsArray = z
  .array(z.string())
  .refine(
    (urls) => {
      // Ensure there's at least one URL
      return urls.length > 0;
    },
    {
      message: 'At least one image URL is required',
      path: [], // Assigns the error to the entire array
    },
  )
  .refine(
    (urls) => {
      // Validate that all URLs are well-formed
      return urls.every((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });
    },
    {
      message: 'All image URLs must be valid URLs',
      path: [], // Assigns the error to the entire array
    },
  )
  .refine(
    (urls) => {
      // Ensure all URLs use HTTPS protocol
      return urls.every((url) => {
        try {
          const urlInstance = new URL(url);
          return urlInstance.protocol === 'https:';
        } catch {
          return false;
        }
      });
    },
    {
      message: 'All image URLs must use HTTPS protocol',
      path: [], // Assigns the error to the entire array
    },
  )
  .refine(
    (urls) => {
      // Ensure all URLs have allowed hosts
      return urls.every((url) => {
        try {
          const urlInstance = new URL(url);
          return validHosts.includes(urlInstance.host);
        } catch {
          return false;
        }
      });
    },
    {
      message: 'All image URLs must have an allowed host',
      path: [], // Assigns the error to the entire array
    },
  );

export const createTemplateSchema = z.object({
  id: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string().min(1)),
  imageUrls: imageUrlsArray,
});

export const updateTemplateSchema = z.object({
  id: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string().min(1)),
  imageUrls: imageUrlsArray,
});

export const deleteTemplateIdSchema = z.string().min(1);
