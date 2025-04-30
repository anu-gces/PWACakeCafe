import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { DataTable } from "../ui/dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { OrderProps } from "../restaurant/orders";
import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  dashboardQueryOptions,
  Route as dashboardRoute,
} from "@/routes/home/dashboard";
import { useLoadingSpinner } from "@/lib/utils";
import { getOrdersInRange } from "@/firebase/firestore";

export function Reports() {
  const search = useSearch({ from: "/home/dashboard" });
  const queryClient = useQueryClient();
  const {
    data: getOrdersInRangeQuery,
    isLoading,
    isError,
  } = useSuspenseQuery(
    dashboardQueryOptions({ from: search.from!, to: search.to! })
  );

  // const {
  //   data: getOrdersInRangeQuery,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["orderHistory"],
  //   queryFn: () =>
  //     getOrdersInRange(
  //       search.from ||
  //         new Date(
  //           new Date().setDate(new Date().getDate() - 1)
  //         ).toLocaleDateString("en-CA"),
  //       // yesterday

  //       search.to || new Date().toLocaleDateString("en-CA")
  //       // todays date
  //     ),
  //   staleTime: Infinity,
  //   gcTime: Infinity,
  // });

  const dateRangeInvalidator = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orderHistory"] });
    },
  });

  useEffect(() => {
    dateRangeInvalidator.mutate();
  }, [search.from, search.to]);

  useLoadingSpinner(isLoading);

  const columns: ColumnDef<OrderProps>[] = [
    {
      header: "S/N",
      id: "serial",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Receipt Number",
      accessorKey: "receiptNumber",
    },
    {
      header: "Receipt Date",
      accessorKey: "receiptDate",
      cell: (info) => {
        // Asserting the value to be of type string for the Date constructor
        const dateValue = new Date(info.getValue() as string);
        return dateValue.toLocaleDateString("en-US");
      },
    },
    {
      header: "Subtotal",
      accessorKey: "subtotal",
      cell: (info) => {
        // Asserting the value to be of type number for toFixed method
        const numValue = info.getValue() as number;
        return `Rs.${numValue.toFixed(2)}`;
      },
    },
    {
      header: "Discount Rate (%)",
      accessorKey: "discountRate",
    },
    {
      header: "Tax Rate (%)",
      accessorKey: "taxRate",
    },
    {
      header: "Processed By",
      accessorKey: "processedBy",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={getOrdersInRangeQuery || []}
      filterColumnId="processedBy"
    />
  );
}
