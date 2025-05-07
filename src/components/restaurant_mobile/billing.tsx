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

// Define column definitions for the main header (Order-related info)
export const columns: ColumnDef<Order>[] = [
  // Main Header (Order Info)
  {
    header: "Order Info",
    columns: [
      {
        header: "Order ID",
        accessorKey: "orderId",
      },
      {
        header: "Discount Rate",
        accessorKey: "discountRate",
        cell: ({ getValue }) => `${(getValue() * 100).toFixed(2)}%`, // Display as percentage
      },
      {
        header: "Tax Rate",
        accessorKey: "taxRate",
        cell: ({ getValue }) => `${(getValue() * 100).toFixed(2)}%`, // Display as percentage
      },
      {
        header: "Order Date",
        accessorKey: "orderDate",
        cell: ({ getValue }) => new Date(getValue()).toLocaleString(), // Format date
      },
      {
        header: "Processed By",
        accessorKey: "processedBy.name", // Nested property for processedBy
      },
    ],
  },

  // Sub Header (Items)
  {
    header: "Items",
    columns: [
      {
        header: "Item Name",
        accessorKey: "items", // We're dealing with an array of items
        cell: ({ row }) => row.original.items.map((item) => item.foodName).join(", "),
      },
      {
        header: "Quantity",
        accessorKey: "items",
        cell: ({ row }) => row.original.items.map((item) => item.quantity).join(", "),
      },
      {
        header: "Price",
        accessorKey: "items",
        cell: ({ row }) => row.original.items.map((item) => item.price).join(", "),
      },
    ],
  },

  // Footer (Total Money)
  {
    footer: "Total Money",
    accessorKey: "totalAmount",
    cell: ({ getValue }) => getValue(),
  },
];
