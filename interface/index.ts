export interface IOrder {
    _id: string;
    restaurantId:string;
    orderId: string;
    transactionId?: string | null;
    salutation: "Mr." | "Mrs." | "Not Specified";
    firstName: string;
    lastName: string;
    company?: string;
    department?: string;
    street: string;
    number: string;
    additionalDetails?: string;
    postalCode: string;
    city: string;
    phoneNumber: string;
    emailAddress: string;
    paymentMethod: "Cash" | "PayPal" | "Credit Card";
    specialNotes?: string;
    preferredDeliveryTime: string;
    acceptTerms: boolean;
    totalPrice: number;
    lieferung: string;
    paymentStatus: "Unpaid" | "Pending" | "Paid" | "Failed"; // وضعیت پرداخت
    order?: Array<{
      name: string;
      no: string;
      type: "Full" | "Half" | "Food";
      items: Array<{
        top?: string[];
        bottom?: string[];
        general?: Array<{
          title: string;
          items: string[];
        }>;
      }>;
      totalPrice: number;
      quantity: number;
    }>;
   
    couponCode?: string;            // کد کوپن
    deliveryFee: number;            // هزینه لیفرونگ
    discountAmount?: number; 
    isCanceled?: boolean; // ✅ سفارش لغو شده یا نه
    createdAt: string;
    updatedAt: string;
  }
  
  export type TOrder = Partial<IOrder>;