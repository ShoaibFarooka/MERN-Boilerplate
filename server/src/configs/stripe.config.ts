import Stripe from 'stripe';

// Initialize Stripe with your API key
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export default stripe;
