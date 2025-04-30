import { Loader, Printer, RotateCcw, SaveIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { Route as OrdersRoute } from "@/routes/home/orders";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { MenuCardDummy } from "./menuCard";
import { MenuDock } from "./menuDock";
import { createOrderHistoryEntry, getFoodItems } from "@/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import DonutImage from "@/assets/donutImage";
import FoodClocheIcon from "@/assets/foodClocheIcon";
import CakeCafeLogo from "@/assets/Logo.png";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn, useLoadingSpinner } from "@/lib/utils";
import { toast } from "sonner";

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

export function Orders() {
  const { category } = OrdersRoute.useSearch();
  const [open, setOpen] = useState(false);

  const [addToCart, setAddToCart] = useState<CartItem[]>([]);

  const [foods, setFoods] = useState<FoodItemProps[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const controls = useAnimation();

  const animationRefs = useRef<any[]>([]);
  animationRefs.current = [];

  const addtoRefs = (el: any) => {
    if (el && !animationRefs.current.includes(el)) {
      animationRefs.current.push(el);
    }
    // console.log(animationRefs.current);
  };

  const { data, isLoading, error } = useQuery<FoodItemProps[]>({
    queryKey: ["foods"],
    queryFn: getFoodItems,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useLoadingSpinner(isLoading);

  useEffect(() => {
    if (data) {
      setFoods(data);
    }
  }, [data]);

  useEffect(() => {
    if (buttonRef.current && animationRefs.current[activeIndex]) {
      const start = animationRefs.current[activeIndex].getBoundingClientRect();
      const end = buttonRef.current.getBoundingClientRect();

      const isDonutImage = !foods[activeIndex].foodPhoto;
      const scaleArray = isDonutImage ? [0.5, 0.25] : [0.1, 0.05];

      controls
        .start({
          x: [start.x, end.x * 0.98],
          y: [start.y, -end.top * 0.75],
          scale: scaleArray,
          opacity: [1, 0],
          transition: { duration: 0.3 },
        })
        .then(() => setActiveIndex(-1));
    }
  }, [activeIndex]);

  return (
    <div>
      <div className="flex justify-between p-[1.7px] w-full">
        <div></div>
        {/* placeholder div to fix jutify between and keep title center */}
        <h1 className="first:mt-0 pb-2 border-b font-semibold text-3xl tracking-tight scroll-m-20">
          Menu Items:{" "}
          {OrdersRoute.useSearch()
            .category.replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <Button
          variant="outline"
          className="relative gap-2"
          ref={buttonRef}
          onClick={() => {
            setOpen(true);
          }}
        >
          <FoodClocheIcon />
          Orders
          <span
            className={cn(
              "absolute -top-1 -right-1 bg-red-600 h-5 w-5 text-white rounded-full p-1 text-xs font-medium flex items-center justify-center transition-opacity",
              {
                "opacity-0": addToCart.reduce((sum, item) => sum + item.qty, 0) === 0,
                "opacity-100": addToCart.reduce((sum, item) => sum + item.qty, 0) > 0,
              }
            )}
          >
            {addToCart.reduce((sum, item) => sum + item.qty, 0)}
          </span>
        </Button>
      </div>
      <div className="gap-4 grid grid-cols-4 mt-2">
        {foods
          .filter((food) => food.foodCategory === category)
          .map((food, index) => (
            <div
              key={index}
              className="relative"
              ref={addtoRefs}
              onClick={() => {
                setActiveIndex(index);

                // Find the food item in the addToCart array
                const item = addToCart.find((item) => item.foodName === food.foodName);

                if (item) {
                  // If the food item exists in the addToCart array, increase the quantity
                  setAddToCart(
                    addToCart.map((item) => (item.foodName === food.foodName ? { ...item, qty: item.qty + 1 } : item))
                  );
                } else {
                  // If the food item doesn't exist in the addToCart array, add it
                  setAddToCart([...addToCart, { ...food, qty: 1 }]);
                }
              }}
            >
              <MenuCardDummy foodName={food.foodName} foodPrice={food.foodPrice} foodPhoto={food.foodPhoto as string} />
            </div>
          ))}

        <AnimatePresence>
          <motion.div animate={controls} className="fixed origin-top-left">
            {activeIndex !== -1 &&
              (foods[activeIndex].foodPhoto ? (
                <img src={foods[activeIndex].foodPhoto as string} alt="food" />
              ) : (
                <DonutImage />
              ))}
          </motion.div>
        </AnimatePresence>
        <Invoice addToCart={addToCart} setAddToCart={setAddToCart} open={open} setOpen={setOpen} />
      </div>

      <MenuDock route={"orders"} />
    </div>
  );
}

type InvoiceProps = {
  addToCart: CartItem[];
  setAddToCart: Dispatch<SetStateAction<CartItem[]>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export type OrderProps = {
  receiptNumber: string;
  receiptDate: string;
  items: CartItem[];
  subtotal: number;
  discountRate: number;
  taxRate: number;
};

export function Invoice({ addToCart, setAddToCart, open, setOpen }: InvoiceProps) {
  const [subtotal, setSubtotal] = useState(0);
  const [discountRate, setDiscountRate] = useState<"" | number>(0);
  const [taxRate, setTaxRate] = useState<"" | number>(0);
  const [receiptNumber, setReceiptNumber] = useState("Click to Generate");
  const [receiptError, setReceiptError] = useState(false);

  const [orderProps, setOrderProps] = useState<OrderProps | null>(null);

  function generateReceiptNumber() {
    if (receiptNumber === "Click to Generate") {
      setReceiptNumber(
        `REC-${Math.floor(Math.random() * 16777215)
          .toString(16)
          .toUpperCase()}`
      );
    }
  }

  function resetCart() {
    setDiscountRate(0);
    setTaxRate(0);
    setReceiptNumber("Click to Generate");
    setIsPrinting(false);
    setReceiptError(false);
    setAddToCart([]); // Assuming you want to clear the cart as part of the reset
  }

  const saveOrderStateMutation = useMutation({
    mutationFn: async (orderProps: OrderProps) => {
      // Call the orderHistoryFirebaseFunction with orderProps as the parameter
      await createOrderHistoryEntry(orderProps);
    },
    onSuccess: () => {
      // Handle successful order state save
      console.log("Order history entry created successfully.");
      setOpen(false);
      toast.success("Order Successfully Logged!");
      resetCart();
    },
    onError: (error: any) => {
      // Handle error in saving order state
      console.error("Error creating order history entry:", error);
    },
  });

  function saveOrderState() {
    // Check if receiptNumber has not been generated
    if (receiptNumber === "Click to Generate") {
      setReceiptError(true); // Show error if receipt number is not generated
      return; // Prevent saving if there's an error
    } else {
      setReceiptError(false); // Reset error state if the check passes
    }

    // Check if addToCart is not empty
    if (addToCart.length > 0) {
      const currentOrderProps: OrderProps = {
        receiptNumber,
        receiptDate: new Date().toISOString(),
        items: addToCart,
        subtotal,
        discountRate: discountRate === "" ? 0 : discountRate,
        taxRate: taxRate === "" ? 0 : taxRate,
      };
      console.log("Order saved:", currentOrderProps);
      saveOrderStateMutation.mutate(currentOrderProps);
    } else {
      toast.error("Cart is empty!");
    }
  }

  useLoadingSpinner(saveOrderStateMutation.isPending);

  useEffect(() => {
    const newSubtotal = addToCart.reduce((total, item) => total + item.qty * item.foodPrice, 0);
    setSubtotal(newSubtotal);
  }, [addToCart]);

  const discount = subtotal * ((discountRate === "" ? 0 : discountRate) / 100);
  const tax = subtotal * (taxRate === "" ? 13 : taxRate / 100);
  const [isPrinting, setIsPrinting] = useState(false);
  let invoiceRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* apply media queries cuz too lazy to configure overflow scroll inside dialogoverlay mini component */}
      <DialogContent className="sm:scale-[0.5] md:scale-[0.65] lg:scale-[0.8] xl:scale-[0.90]">
        <ScrollArea className="w-full max-h-[85vh]">
          <div ref={invoiceRef}>
            <DialogHeader>
              <div className="flex md:flex-row flex-col md:justify-between items-center gap-4 p-2">
                <div className="flex items-center gap-4">
                  <img src={CakeCafeLogo} width="48" height="48" alt="Company Logo" className="rounded-md" />
                  <div className="gap-2 grid">
                    <DialogTitle className="font-bold text-xl">
                      Cake Cafe<sup className="text-[12px]">TM</sup>
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400 text-sm">
                      Jwalakhel-8, Pokhara
                      <br />
                      Phone: +061-531234
                      <br />
                      Email: info@CakeCafe.com.np
                    </DialogDescription>
                  </div>
                </div>
                {!isPrinting && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={resetCart}>
                    <RotateCcw />
                    Clear
                  </Button>
                )}
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-4 mx-auto p-2 w-full max-w-md">
              <div className="gap-4 grid p-4 border rounded-lg">
                <div className="gap-4 grid grid-cols-2">
                  <div className="gap-4 grid">
                    <Label htmlFor="receipt-number" className={`${receiptError ? "text-red-500" : ""}`}>
                      Receipt Number
                    </Label>
                    <div className="relative">
                      <div
                        id="receipt-number"
                        className={`hover:bg-accent p-2 border rounded-lg text-sm ${receiptError ? "border-red-500" : ""}`}
                        onClick={() => {
                          if (receiptError) {
                            setReceiptError(false);
                          }
                          generateReceiptNumber();
                        }}
                      >
                        {receiptNumber}
                      </div>
                      {receiptError && (
                        <p className="-top-2 left-1.5 absolute bg-white px-1 text-red-500 text-xs">
                          Receipt Generation required!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="gap-4 grid">
                    <Label htmlFor="receipt-date">Receipt Date</Label>
                    <div id="receipt-date" className="p-2 border rounded-lg text-sm">
                      <RealTimeClock />
                    </div>
                  </div>
                </div>
                <Table className="w-full">
                  <TableHeader className="">
                    <TableRow className="">
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {addToCart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="break-all">{item.foodName}</TableCell>
                        <TableCell className="min-w-14 max-w-14">
                          {isPrinting ? (
                            <div>{item.qty}</div>
                          ) : (
                            <Input
                              type="number"
                              min={1}
                              defaultValue={item.qty}
                              className="w-20" // Added fixed width class here
                              onChange={(e) => {
                                const newQty = Number(e.target.value);
                                setAddToCart((prev) =>
                                  prev.map((item, i) => (i === index ? { ...item, qty: newQty } : item))
                                );
                              }}
                              onBlur={(e) => {
                                const newQty = Number(e.target.value);
                                if (newQty === 0) {
                                  setAddToCart((prev) => prev.filter((_, i) => i !== index));
                                }
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>Rs.{item.foodPrice.toFixed(2)}</TableCell>
                        <TableCell>Rs.{(item.qty * item.foodPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="gap-4 grid pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>Subtotal</div>
                    <div className="font-bold text-lg">Rs.{subtotal}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div>Discount (%)</div>

                      {isPrinting ? (
                        <div>{discountRate}</div>
                      ) : (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          className="w-16 font-medium"
                          value={discountRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setDiscountRate(value === "" ? "" : Number(value));
                          }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1">Rs.{discount.toFixed(2)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div>Tax (%)</div>

                      {isPrinting ? (
                        <div>{taxRate}</div>
                      ) : (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          className="w-16 font-medium"
                          value={taxRate}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTaxRate(value === "" ? "" : Number(value));
                          }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1">Rs.{tax.toFixed(2)}</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">Total</div>
                    <div className="font-bold text-lg">Rs.{subtotal + tax - discount}</div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex justify-between w-full">
                {!isPrinting && (
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                )}
                <div className="flex gap-2">
                  {/* {!isPrinting && (
                    // <ReactToPrint
                    //   trigger={() => (
                    //     <Button variant="default" className="gap-2">
                    //       <Printer color="white" />
                    //       Print
                    //     </Button>
                    //   )}
                    //   content={() => invoiceRef.current}
                    //   onBeforeGetContent={() => {
                    //     setIsPrinting(true);
                    //     return Promise.resolve();
                    //   }}
                    //   onAfterPrint={() => setIsPrinting(false)}
                    // />
                    <div>bruh</div>
                  )} */}
                  {!isPrinting && (
                    <Button className="gap-2" onClick={saveOrderState}>
                      <SaveIcon color="white" /> Save
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

const RealTimeClock = () => {
  const [date, setDate] = useState(new Date());

  const updateClock = useCallback(() => {
    setDate(new Date());
    requestAnimationFrame(updateClock);
  }, []);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateClock]);

  return (
    <>
      {date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })}
    </>
  );
};
