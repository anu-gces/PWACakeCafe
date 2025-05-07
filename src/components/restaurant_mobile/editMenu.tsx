import CakeCafeLogo from "@/assets/Logo.png";
import { NotebookPenIcon, PlusIcon, RotateCwIcon, SearchIcon } from "lucide-react";

import { type MenuCategory, Route as editMenuRoute } from "@/routes/home/editMenu";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MenuCard } from "./menuCard";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadMenuItemImage } from "@/firebase/firebase_storage";
import { enterFoodItem, getFoodItems } from "@/firebase/firestore";
import { cn, useLoadingSpinner } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { OriginTabs, OriginTabsList, OriginTabsTrigger } from "../ui/originTabs";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { NumberInput } from "../ui/number-input";

export type FoodItemProps = {
  foodId: string;
  foodName: string;
  foodPrice: number;
  foodCategory: string;
  foodPhoto: File | string | null;
};

type CartItem = Omit<FoodItemProps, "foodPhoto"> & {
  qty: number;
};

export const validationSchema = Yup.object({
  foodName: Yup.string().required("Required"),
  foodCategory: Yup.string().required("Required"),
  foodPrice: Yup.number().required("Required"),
  foodPhoto: Yup.mixed().nullable(),
});

const categories: MenuCategory[] = ["appetizers", "main_courses", "desserts", "beverages", "hard_drinks", "specials"];

function CategoryTabs() {
  return (
    <OriginTabs defaultValue="appetizers" className="mb-2 w-full">
      <OriginTabsList className="before:bottom-0 before:absolute relative before:inset-x-0 gap-0.5 bg-transparent p-0 before:bg-border w-full h-auto before:h-px">
        {categories.map((category) => (
          <OriginTabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:z-10 bg-muted data-[state=active]:shadow-none border-x border-t border-border rounded-b-none overflow-hidden capitalize"
          >
            <Link
              to="/home/editMenu"
              search={{ category: category }}
              className="flex rounded-full w-full h-full text-[10px]"
            >
              {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              {/* remove underscore capitalize first letter */}
            </Link>
          </OriginTabsTrigger>
        ))}
      </OriginTabsList>
    </OriginTabs>
  );
}

function editMenu() {
  const { category } = editMenuRoute.useSearch();

  const [foods, setFoods] = useState<FoodItemProps[]>([]);
  const [addToCart, setAddToCart] = useState<{
    items: CartItem[];
    discountRate: number;
    taxRate: number;
  }>({
    items: [],
    discountRate: 0,
    taxRate: 0,
  });
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<FoodItemProps[]>({
    queryKey: ["foods"],
    queryFn: getFoodItems,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  useLoadingSpinner(isLoading);

  useEffect(() => {
    if (data) {
      setFoods(data);
    }
  }, [data]);

  const handleAddToCart = (food: FoodItemProps) => {
    setAddToCart((prev) => {
      const existing = prev.items.find((item) => item.foodName === food.foodName);
      let updatedItems;

      if (existing) {
        updatedItems = prev.items.map((item) =>
          item.foodName === food.foodName ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updatedItems = [...prev.items, { ...food, qty: 1 }];
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  return (
    <div className="">
      <div className="w-full">
        <div className="right-4 bottom-28 absolute flex justify-center items-center bg-white/40 hover:bg-white/60 dark:bg-black/40 dark:hover:bg-black/60 shadow-xl backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full w-10 h-10 text-gray-800 dark:text-white align-middle">
          <RotateCwIcon
            className="text-rose-600 dark:text-white"
            onClick={() => {
              setAddToCart({
                items: [],
                discountRate: 0,
                taxRate: 0,
              });
            }}
          />
        </div>
        <CreateOrderDrawer addToCart={addToCart} setAddToCart={setAddToCart} />

        <AddDrawer />
      </div>
      <CategoryTabs />
      {/*  Search Input */}
      <div className="relative my-4 w-full">
        <SearchIcon className="top-1/2 left-3 absolute w-5 h-5 text-muted-foreground -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="gap-0 grid grid-cols-1">
        {foods
          .filter(
            (food) => food.foodCategory === category && food.foodName.toLowerCase().includes(search.toLowerCase())
          )
          .map((food) => (
            <AnimatePresence key={food.foodId}>
              <motion.div layout>
                <MenuCard food={food} handleAddToCart={handleAddToCart} />
              </motion.div>
            </AnimatePresence>
          ))}
      </div>
    </div>
  );
}

type AddToCart = {
  items: CartItem[];
  discountRate: number;
  taxRate: number;
};

type BillProps = {
  addToCart: AddToCart;
  setAddToCart: React.Dispatch<React.SetStateAction<AddToCart>>;
};

function CreateOrderDrawer({ addToCart, setAddToCart }: BillProps) {
  return (
    <Drawer>
      <DrawerTrigger className="right-4 bottom-16 absolute flex justify-center items-center bg-white/40 hover:bg-white/60 dark:bg-black/40 dark:hover:bg-black/60 shadow-xl backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full w-10 h-10 text-gray-800 dark:text-white align-middle">
        <>
          <span
            className={cn(
              "absolute -top-1 -right-1 bg-red-600 h-5 w-5 text-white rounded-full p-1 text-xs font-medium flex items-center justify-center transition-opacity",
              {
                "opacity-0": addToCart.items.reduce((sum, item) => sum + item.qty, 0) === 0,
                "opacity-100": addToCart.items.reduce((sum, item) => sum + item.qty, 0) > 0,
              }
            )}
          >
            {addToCart.items.reduce((sum, item) => sum + item.qty, 0)}
          </span>
          <NotebookPenIcon className="text-rose-600 dark:text-white" />
        </>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex md:flex-row flex-col md:justify-between items-center gap-4 p-2">
            <div className="flex items-center gap-4">
              <img src={CakeCafeLogo} width="48" height="48" alt="Company Logo" className="rounded-md" />
              <div className="gap-2 grid">
                <DrawerTitle className="font-bold text-xl">
                  Cake Cafe<sup className="text-[12px]">TM</sup>
                </DrawerTitle>
                <DrawerDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Jwalakhel-8, Pokhara
                  <br />
                  Phone: +061-531234
                  <br />
                  Email: info@CakeCafe.com.np
                </DrawerDescription>
              </div>
            </div>
          </div>
        </DrawerHeader>
        <ScrollArea className="overflow-y-scroll">
          <Bill addToCart={addToCart} setAddToCart={setAddToCart} />
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                console.log("addtocart", addToCart);
                setAddToCart({ items: [], discountRate: 0, taxRate: 0 });
              }}
            >
              Submit
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Bill({ addToCart, setAddToCart }: BillProps) {
  const updateQty = (foodId: string, newQty: number) => {
    setAddToCart((prev) => ({
      ...prev,
      items:
        newQty > 0
          ? prev.items.map((item) => (item.foodId === foodId ? { ...item, qty: newQty } : item))
          : prev.items.filter((item) => item.foodId !== foodId),
    }));
  };

  const [discountRate, setDiscountRate] = useState(addToCart.discountRate); // default 0%
  const [taxRate, setTaxRate] = useState(addToCart.taxRate); // default 0%

  const subtotal = addToCart.items.reduce((sum, item) => sum + item.foodPrice * item.qty, 0);
  const discountAmount = subtotal * (discountRate / 100);
  const taxAmount = (subtotal - discountAmount) * (taxRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="mx-auto w-full print:max-w-[300px] max-w-sm font-mono print:text-xs text-sm">
      <div className="bg-white dark:bg-black p-4 border border-border">
        <h2 className="mb-4 font-bold text-center">Receipt</h2>
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Item</TableHead>
              <TableHead className="w-12 text-center">Qty</TableHead>
              <TableHead className="w-16 text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addToCart.items.map((item) => (
              <TableRow key={item.foodId}>
                <TableCell>{item.foodName}</TableCell>
                <TableCell className="text-center">
                  <NumberInput
                    value={item.qty}
                    onValueChange={(val: number) => updateQty(item.foodId, val ?? 0)}
                    className="px-1 py-0 w-12 h-8 text-center"
                  />
                </TableCell>
                <TableCell className="text-right">Rs.{(item.qty * item.foodPrice).toFixed(2)}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={2} className="font-semibold text-right">
                Sub Total
              </TableCell>
              <TableCell className="font-bold text-right">Rs.{subtotal.toFixed(2)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <span className="whitespace-nowrap">Discount</span>
                  <NumberInput
                    min={0}
                    max={100}
                    value={discountRate}
                    onValueChange={(val: number) => {
                      setDiscountRate(val);
                      setAddToCart((prev) => ({
                        ...prev,
                        discountRate: val, // Update the discount rate for the entire cart
                      }));
                    }}
                    className="px-1 py-0 w-14 h-8 text-center"
                  />
                  <span>%</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-nowrap">- Rs.{discountAmount.toFixed(2)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <span className="whitespace-nowrap">Tax</span>
                  <NumberInput
                    min={0}
                    max={100}
                    value={taxRate}
                    onValueChange={(val: number) => {
                      setTaxRate(val);
                      setAddToCart((prev) => ({
                        ...prev,
                        taxRate: val, // Update the tax rate for the entire cart
                      }));
                    }}
                    className="px-1 py-0 w-14 h-8 text-center"
                  />
                  <span>%</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-nowrap">+ Rs.{taxAmount.toFixed(2)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} className="font-semibold text-right">
                Total
              </TableCell>
              <TableCell className="font-bold text-right">Rs.{total.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AddDrawer() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const enterFoodItemsMutation = useMutation({
    mutationFn: async (values: Omit<FoodItemProps, "foodId">) => {
      const foodId = Math.random().toString(16).slice(2);
      const valuesWithId: FoodItemProps = { ...values, foodId };

      const photoFile: File | null = valuesWithId.foodPhoto as File | null;
      let storageURL = null;
      if (photoFile !== null) {
        storageURL = await uploadMenuItemImage(foodId, photoFile);
      }

      const valuesWithPhotoURL = {
        ...valuesWithId,
        foodPhoto: storageURL,
      };

      await enterFoodItem(valuesWithPhotoURL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast("Food Item Added successfully!");
      setOpen(false);
    },
    onError: (error: any) => {
      toast("error!", error);
    },
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="right-4 bottom-4 absolute flex justify-center items-center bg-white/40 hover:bg-white/60 dark:bg-black/40 dark:hover:bg-black/60 shadow-xl backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full w-10 h-10 text-gray-800 dark:text-white align-middle">
          <PlusIcon className="text-rose-600 dark:text-white" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Food Item</DrawerTitle>
          <DrawerDescription>Add a new food item here. Click save when you're done.</DrawerDescription>
        </DrawerHeader>
        <Formik
          initialValues={{
            foodName: "",
            foodCategory: "",
            foodPrice: 0,
            foodPhoto: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            enterFoodItemsMutation.mutate(values);
          }}
        >
          {(formik) => (
            <Form>
              <div className="gap-4 grid py-4">
                {/* Name Field */}
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="foodName" className="text-right">
                    Food Name
                  </Label>
                  <div className="relative col-span-3">
                    {formik.touched.foodName && formik.errors.foodName && (
                      <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                        {formik.errors.foodName}
                      </div>
                    )}
                    <Input
                      id="foodName"
                      name="foodName"
                      className="w-full"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.foodName}
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="foodCategory" className="text-right">
                    Category
                  </Label>
                  <div className="relative col-span-3">
                    {formik.touched.foodCategory && formik.errors.foodCategory && (
                      <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                        {formik.errors.foodCategory}
                      </div>
                    )}
                    <Select
                      name="foodCategory"
                      onValueChange={(value) => formik.setFieldValue("foodCategory", value)}
                      value={formik.values.foodCategory}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizers">Appetizers</SelectItem>
                        <SelectItem value="main_courses">Main Course</SelectItem>
                        <SelectItem value="desserts">Dessert</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="hard_drinks">Hard Drinks</SelectItem>
                        <SelectItem value="specials">Specials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Field */}
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="foodPrice" className="text-right">
                    Price
                  </Label>
                  <div className="relative col-span-3">
                    {formik.touched.foodPrice && formik.errors.foodPrice && (
                      <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                        {formik.errors.foodPrice}
                      </div>
                    )}
                    <Input
                      id="foodPrice"
                      name="foodPrice"
                      type="number"
                      className="w-full"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.foodPrice}
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="items-center gap-4 grid grid-cols-4">
                  <Label htmlFor="foodPhoto" className="text-right">
                    Photo
                  </Label>
                  <div className="relative col-span-3">
                    {formik.touched.foodPhoto && formik.errors.foodPhoto && (
                      <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                        {formik.errors.foodPhoto}
                      </div>
                    )}
                    <Input
                      type="file"
                      id="foodPhoto"
                      name="foodPhoto"
                      className="w-full"
                      onChange={(event) => {
                        formik.setFieldValue("foodPhoto", event.currentTarget.files?.[0] || "");
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button className="text-white" type="submit">
                  Submit
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </Form>
          )}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
}

export default editMenu;
