export const BRAND = {
  name: "Whimsey Technologies",
  tagline: "Premium hardware ecosystems engineered for elite digital setups.",
  email: "whimseytech@gmail.com",
  whatsapp: "0769591223",
  whatsappIntl: "254769591223",
  colors: {
    blue: "#0056d2",
    white: "#ffffff",
    black: "#0a0a0a",
    inkMuted: "#525252",
    brandLight: "#f0f6ff",
    brandTint: "#e8f1fc",
  },
  blue: "#0056d2",
  white: "#ffffff",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/deals", label: "Deals" },
  { href: "/contact", label: "Contact" },
] as const;

export const CATEGORIES = [
  "All Products",
  "Laptops",
  "Smartphones",
  "Audio & Speakers",
  "Mobile Accessories",
  "Tablets",
  "TV & Home Appliances",
  "Computer & Accessories",
  "Apple",
  "Cables",
  "Students Deals",
  "Printers",
  "Storage",
] as const;

/** Store categories shown in shop navigation and homepage showcases */
export const SHOP_CATEGORIES = CATEGORIES.filter(
  (category): category is Exclude<(typeof CATEGORIES)[number], "All Products"> =>
    category !== "All Products"
);

export const SOCIAL_LINKS = [
  {
    name: "X",
    href: "https://x.com/whimseytech",
    color: "#FFFFFF",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@whimseyofficialke",
    color: "#00F2EA",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@whimseytech",
    color: "#FF0000",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/whimseytech",
    color: "#1877F2",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/whimseytech/",
    color: "#E1306C",
  },
] as const;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PICKUP_ADDRESS =
  "Whimsey Business Plaza, Moi Avenue, Nairobi";

export const PICKUP_HOURS =
  "Open Mon–Fri 8am–5:30pm, Sat–Sun & public holidays 8am–12pm.";
