export const APIS = {
  USER: {
    FETCH_USER_LISTINGS_URL: "/api/user/listings",
    FIND_URL: "/api/user/find",
    UPDATE_URL: "/api/user/update",
    DELETE_URL: "/api/user/delete",
  },
  LISTING: {
    FETCH_LISTING_URL: "/api/listing/find",
    SEARCH_URL: "/api/listing/search",
    CREATE_URL: "/api/listing/create",
    UPDATE_URL: "/api/listing/update",
    DELETE_URL: "/api/listing/delete",
  },
  AUTH: {
    SIGN_IN_URL: "/api/auth/signin",
    SIGN_UP_URL: "/api/auth/signup",
    SIGN_OUT_URL: "/api/auth/signout",
    GOOGLE_AUTH_URL: "/api/auth/google",
  },
};

export const ERROR_MESSAGES = {
  MAX_IMAGES_UPLOAD_ERROR: "You can only upload 6 images per listing",
  IMAGE_MAX_SIZE_ERROR: "Image upload failed (2 mb max per image)",
  MIN_ONE_IMAGE_REQUIRED_ERROR: "You must upload at least one image",
  DISCOUNT_PRICE_CHECK_ERROR: "Discount price must be lower than regular price",
  GOOGLE_AUTH_FAILURE_ERROR: "Could not sign in with google",
};
