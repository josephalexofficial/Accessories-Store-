import { BRAND } from "./constants";

interface WhatsAppProduct {
  title: string;
  brand: string;
  price: string;
  url: string;
  isDeal?: boolean;
  originalPrice?: string;
}

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${BRAND.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export function buildProductInquiryMessage(product: WhatsAppProduct): string {
  if (product.isDeal) {
    return `Hello Whimsey Accessories! 👋

I want to secure this special DEAL item before it sells out:

📦 Product: ${product.title}
🏷️ Brand: ${product.brand}
🔥 Deal Price: ${product.price}
❌ Original Price: ${product.originalPrice ?? "N/A"}
🔗 Item Link: ${product.url}

Please confirm if this promotional stock is still available for processing. Thank you!`;
  }

  return `Hello Whimsey Accessories! 👋

I am interested in ordering this accessory directly:

📦 Product: ${product.title}
🏷️ Brand: ${product.brand}
💰 Price: ${product.price}
🔗 Item Link: ${product.url}

Please let me know if this item is currently available for delivery. Thank you!`;
}

export function buildGeneralInquiryMessage(): string {
  return "Hello Whimsey Accessories! I have a general inquiry regarding your products";
}

export function buildOrderStatusMessage(
  customerName: string,
  orderId: string,
  status: string
): string {
  return `Hello ${customerName}! This is Whimsey Technologies. Your order #${orderId} has been updated to ${status}. Thank you for shopping with us!`;
}
