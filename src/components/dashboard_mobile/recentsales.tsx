import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const salesData = [
  {
    receiptId: "CAKE-MYITWK",
    receiptDate: "2025-05-08T08:32:47.116Z",
    processedBy: "Anu",
    items: [
      {
        foodName: "Ice Cream",
        foodCategory: "Appetizers",
        foodPrice: 300,
        qty: 1,
        foodId: "37b3627b1e5f3",
      },
    ],
    discountRate: 10,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
  {
    receiptId: "PIZZA-XRTY89",
    receiptDate: "2025-05-07T17:14:32.000Z",
    processedBy: "Ravi",
    items: [
      {
        foodName: "Cheese Pizza",
        foodCategory: "Main Course",
        foodPrice: 850,
        qty: 2,
        foodId: "pizza123",
      },
    ],
    discountRate: 5,
    taxRate: 13,
  },
];

function calculateTotal(item: any, discountRate: number, taxRate: number): number {
  const baseTotal = item.foodPrice * item.qty;
  const discounted = baseTotal * (1 - discountRate / 100);
  const taxed = discounted * (1 + taxRate / 100);
  return Math.round(taxed);
}

export function RecentSales() {
  return (
    <div className="space-y-6 w-full h-[400px] overflow-y-auto">
      {salesData.map((sale) => (
        <div key={sale.receiptId} className="pb-4 border-b">
          <p className="text-muted-foreground text-xs">
            {new Date(sale.receiptDate).toLocaleString()} · Processed by {sale.processedBy}
          </p>
          {sale.items.map((item, index) => (
            <div key={item.foodId + index} className="flex justify-between items-center mt-1">
              <div className="text-sm">
                <span className="font-medium">{item.foodName}</span>{" "}
                <span className="text-muted-foreground text-xs">x{item.qty}</span>
              </div>
              <div className="font-medium text-sm">NPR {calculateTotal(item, sale.discountRate, sale.taxRate)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
