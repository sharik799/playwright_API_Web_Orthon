export const ENDPOINTS = {
  /* =========================
   * AUTH APIs
   * ========================= */
  AUTH: {
    LOGIN: {
      BASE: `APIHandler/login`,
      V1: `APIHandler/v1/login`,
      V2: `APIHandler/v2/login`,
      SSO: {
        BASE: `APIHandler/ssoLogin`,
        V1: `APIHandler/v1/ssoLogin`,
      },
    },
    LOGOUT: `/test/logout`,
    FORGOT_PASSWORD: `/test/forgot`,
  },

  /* =========================
   *  STORE LOCATION /
   * ========================= */
  LOCATION: {
      BASE: `test/google1`,
      V1: `test/v1/googlelist`,
      V2: `APIHandler/v2/locationList`,
  },

 
} as const;
