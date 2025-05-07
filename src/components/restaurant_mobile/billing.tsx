import type { ColumnDef } from "@tanstack/react-table";

type Item = {
  foodName: string;
  quantity: number;
  price: number;
};

type Order = {
  orderId: string;
  discountRate: number;
  taxRate: number;
  items: Item[];
  totalAmount: number;
  orderDate: string; // ISO string
  processedBy: { name: string };
};

const orders = [
  {
    orderId: "order123",
    discountRate: 0.1,
    taxRate: 0.13,
    items: [
      { foodName: "Waffle Cone", quantity: 2, price: 5 },
      { foodName: "Blueberry Cheesecake", quantity: 1, price: 6 },
    ],
    totalAmount: 15.7,
    orderDate: "2025-05-06T12:00:00Z",
    processedBy: "John Doe",
  },
  {
    orderId: "order456",
    discountRate: 0.15,
    taxRate: 0.1,
    items: [
      { foodName: "Pasta", quantity: 1, price: 8 },
      { foodName: "Garlic Bread", quantity: 2, price: 4 },
    ],
    totalAmount: 18.2,
    orderDate: "2025-05-06T14:00:00Z",
    processedBy: "Jane Smith",
  },
];

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    id: "Order ID",
    header: "Order ID",
  },
  {
    accessorKey: "discountRate",
    id: "Discount Rate",
    header: "Discount Rate",
    cell: ({ getValue }) => `${getValue<number>() * 100}%`, // Format the value as a percentage
  },
  {
    accessorKey: "taxRate",
    id: "Tax Rate",
    header: "Tax Rate",
    cell: ({ getValue }) => `${getValue<number>() * 100}%`, // Format the value as a percentage
  },
  {
    accessorKey: "totalAmount",
    id: "Total Amount",
    header: "Total Amount",
    cell: ({ getValue }) => `Rs. ${getValue<number>().toFixed(2)}`, // Format the value with "Rs." and two decimal places
  },
  {
    accessorKey: "orderDate",
    id: "Order Date",
    header: "Order Date",
  },
  {
    accessorKey: "processedBy.name",
    id: "Processed By",
    header: "Processed By",
  },
];
