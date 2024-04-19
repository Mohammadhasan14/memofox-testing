import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { MongoDBSessionStorage } from '@shopify/shopify-app-session-storage-mongodb';
// import { FirebaseSessionStorage } from "./firebaseSessionStorage";

import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import dotenv from 'dotenv'
dotenv.config()
console.log('process.env.SHOPIFY_APP_URL',process.env.SHOPIFY_APP_URL);
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY || "9342b92fd72339c05a9b8b640b41ce2f",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "597122ef8067ae45019a2e3dd275906a",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(",") || "read_customers,write_customers,write_products".split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "https://memofox-app.vercel.app/",
  authPathPrefix: "/auth",
  sessionStorage: new MongoDBSessionStorage(
    process.env.MONGODB_URI || "mongodb+srv://info:RRhxjoutw1gzehLt@cluster0.jopyw9d.mongodb.net",
    'memofox-app',),
  // sessionStorage: new MongoDBSessionStorage(
  //   process.env.MONGODB_URI || 'mongodb://localhost:27017',
  //   'memofox-app',),
  // client atlas URL:  mongodb+srv://info:RRhxjoutw1gzehLt@cluster0.jopyw9d.mongodb.net/
  // sessionStorage: new FirebaseSessionStorage(),

  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ session }) => {
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
