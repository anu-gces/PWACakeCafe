import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AddToCart } from "./editMenu";

export const columns: ColumnDef<
  AddToCart & {
    processedBy: string;
    receiptId: string;
    receiptDate: string;
    subTotalAmount: number;
    totalAmount: number;
  }
>[] = [
  {
    accessorKey: "receiptId",
    id: "receiptId",
    header: "Receipt ID",
  },
  {
    accessorKey: "subTotalAmount",
    id: "subTotalAmount",
    header: "Sub Total Amount",
    cell: ({ getValue }) => `Rs. ${getValue<number>().toFixed(2)}`, // Format the value with "Rs." and two decimal places
  },
  {
    accessorKey: "discountRate",
    id: "discountRate",
    header: "Discount Rate",
    cell: ({ getValue }) => `${getValue<number>()}%`, // Format the value as a percentage
  },
  {
    accessorKey: "taxRate",
    id: "taxRate",
    header: "Tax Rate",
    cell: ({ getValue }) => `${getValue<number>()}%`, // Format the value as a percentage
  },

  {
    accessorKey: "totalAmount",
    id: "totalAmount",
    header: "Total Amount",
    cell: ({ getValue }) => `Rs. ${getValue<number>().toFixed(2)}`, // Format the value with "Rs." and two decimal places
  },

  {
    accessorKey: "receiptDate",
    id: "receiptDate",
    header: "Receipt Date",
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return date ? format(new Date(date), "dd MMM yyyy, hh:mm a") : "N/A"; // Format the date
    },
  },
  {
    accessorKey: "processedBy",
    id: "processedBy",
    header: "Processed By",
  },
];
