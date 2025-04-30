import { ArrowLeftCircle, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Route as RestaurantRoute } from "@/routes/home/editMenu";
import { AnimatePresence, motion, useAnimation } from "motion/react";

import { MenuCard } from "./menuCard";
import { MenuDock } from "./menuDock";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, useLoadingSpinner } from "@/lib/utils";
import { uploadMenuItemImage } from "@/firebase/firebase_storage";
import { deleteFoodItem, editFoodItem, enterFoodItem, getFoodItems } from "@/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type FoodItemProps = {
  foodId: string;
  foodName: string;
  foodPrice: number;
  foodCategory: string;
  foodPhoto: File | string | null;
};

const validationSchema = Yup.object({
  foodName: Yup.string().required("Required"),
  foodCategory: Yup.string().required("Required"),
  foodPrice: Yup.number().required("Required"),
  foodPhoto: Yup.mixed().nullable(),
});

export function Restaurant() {
  const { category } = RestaurantRoute.useSearch();
  const [open, setOpen] = useState(false);
  const [openDialogIndex, setOpenDialogIndex] = useState<null | number>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [foods, setFoods] = useState<FoodItemProps[]>([]);
  const [revert, setRevert] = useState<FoodItemProps[]>([]);

  const controls = useAnimation();

  const { data, isLoading, error } = useQuery<FoodItemProps[]>({
    queryKey: ["foods"],
    queryFn: getFoodItems,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const queryClient = useQueryClient();

  const enterFoodItemsMutation = useMutation({
    mutationFn: async (values: Omit<FoodItemProps, "foodId">) => {
      const foodId = Math.random().toString(16).slice(2); // Generate a random hexadecimal string
      const valuesWithId: FoodItemProps = { ...values, foodId }; // Add the id to the values object

      // Assuming you have a file object for the photo
      const photoFile: File | null = valuesWithId.foodPhoto as File | null;
      console.log("photo", photoFile);
      // Upload the photo and get the storage URL
      let storageURL = null;
      if (photoFile !== null) {
        storageURL = await uploadMenuItemImage(foodId, photoFile);
      }

      // Replace the foodPhoto with the storage URL
      const valuesWithPhotoURL = {
        ...valuesWithId,
        foodPhoto: storageURL,
      };

      console.log("done adding", valuesWithPhotoURL);

      // Call the enterFoodItem function
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

  const editFoodItemsMutation = useMutation({
    mutationFn: async (values: FoodItemProps) => {
      const photoFile: File | null = values.foodPhoto as File | null;
      // Upload the photo and get the storage URL
      let storageURL = null;
      if (photoFile !== null) {
        storageURL = await uploadMenuItemImage(values.foodId, photoFile);
      }

      // Replace the foodPhoto with the storage URL
      const valuesWithPhotoURL = {
        ...values,
        foodPhoto: storageURL,
      };

      // console.log("done adding", valuesWithPhotoURL);

      // Call the editFoodItem function
      await editFoodItem(valuesWithPhotoURL);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast("Food Item edited successfully!");
      setOpen(false);
    },
    onError: (error: any) => {
      toast("error!", error);
    },
  });

  const deleteFoodItemsMutation = useMutation({
    mutationFn: async () => {
      await deleteFoodItem(foods);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast("Food Item(s) removed successfully!");
    },
    onError: (error: any) => {
      toast("Error!", error);
    },
  });

  useLoadingSpinner(isLoading);

  useEffect(() => {
    if (data) {
      setFoods(data);
    }
  }, [data]);

  useEffect(() => {
    if (isDeleting) {
      setRevert(foods);
    }
  }, [isDeleting]);

  return (
    <div>
      <div className="relative w-full">
        <div
          className={cn(
            "relative w-full inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1 dark:bg-stone-900 dark:border-0",
            {
              "w-48": !isDeleting,
              "w-[275px]": isDeleting,
            }
          )}
        >
          {" "}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className="inline-flex items-center gap-2 bg-transparent hover:bg-transparent dark:bg-stone-900 dark:hover:bg-gray-700 px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-white text-sm"
              asChild
            >
              <div className="cursor-pointer">
                <Plus size={16} />
                Add
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Food Item</DialogTitle>
                <DialogDescription>Add a new food item here. Click save when you're done.</DialogDescription>
              </DialogHeader>
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
                      <div className="items-center gap-4 grid grid-cols-4">
                        <Label htmlFor="foodName" className="text-right">
                          Food Name
                        </Label>
                        <div className="relative col-span-3">
                          {formik.touched.foodName && formik.errors.foodName ? (
                            <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                              {formik.errors.foodName}
                            </div>
                          ) : null}
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
                      <div className="items-center gap-4 grid grid-cols-4">
                        <Label htmlFor="foodCategory" className="text-right">
                          Category
                        </Label>
                        <div className="relative col-span-3">
                          {formik.touched.foodCategory && formik.errors.foodCategory ? (
                            <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                              {formik.errors.foodCategory}
                            </div>
                          ) : null}
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
                      <div className="items-center gap-4 grid grid-cols-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <div className="relative col-span-3">
                          {formik.touched.foodPrice && formik.errors.foodPrice ? (
                            <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                              {formik.errors.foodPrice}
                            </div>
                          ) : null}
                          <Input
                            id="foodPrice"
                            name="foodPrice"
                            type="number"
                            className="col-span-3"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.foodPrice}
                          />
                        </div>
                      </div>
                      <div className="items-center gap-4 grid grid-cols-4">
                        <Label htmlFor="foodPhoto" className="text-right">
                          Photo
                        </Label>
                        <div className="relative col-span-3">
                          {formik.touched.foodPhoto && formik.errors.foodPhoto ? (
                            <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                              {formik.errors.foodPhoto}
                            </div>
                          ) : null}
                          <Input
                            type="file"
                            id="foodPhoto"
                            name="foodPhoto"
                            className="col-span-3"
                            onChange={(event) => {
                              formik.setFieldValue("foodPhoto", event.currentTarget.files?.[0] || "");
                            }}
                            onBlur={formik.handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button className="text-white" type="submit">
                        Submit
                      </Button>
                    </DialogFooter>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            onClick={() => {
              controls.stop();
              controls.start("reset");
              deleteFoodItemsMutation.mutate();
              setIsDeleting(false);
            }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-opacity duration-500",
              {
                "bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 dark:bg-stone-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-300 opacity-100 visible":
                  isDeleting,
                "opacity-0 invisible fixed": !isDeleting,
              }
            )}
          >
            <Save size={16} />
            <span>Save</span>
          </Button>
          <Button
            type="button"
            className="inline-flex relative justify-center items-center bg-white hover:bg-muted-background dark:bg-background shadow-sm px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-24 text-primary hover:text-red-400 dark:text-white text-sm"
            onClick={() => {
              if (isDeleting === false) {
                controls.start("start");
                setIsDeleting(true);
              } else {
                controls.stop();
                controls.start("reset");
                setFoods(revert);
                setIsDeleting(false);
              }
            }}
          >
            <div
              className={cn(
                "transition-opacity duration-500 ease-in-out transition-visibility gap-2 absolute left-1/2 transform -translate-x-1/2 flex items-center",
                {
                  "opacity-100 visible": isDeleting,
                  "opacity-0 invisible": !isDeleting,
                }
              )}
            >
              <ArrowLeftCircle size={16} />
              <span>Cancel</span>
            </div>
            <div
              className={cn(
                "transition-opacity ease-in-out transition-visibility duration-500 gap-2 absolute left-1/2 transform -translate-x-1/2 flex items-center",
                {
                  "opacity-100 visible": !isDeleting,
                  "opacity-0 invisible": isDeleting,
                }
              )}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </div>
          </Button>
        </div>
        <h1 className="top-1/2 left-1/2 absolute first:mt-0 pb-2 border-b font-semibold text-3xl tracking-tight -translate-x-1/2 -translate-y-1/2 scroll-m-20 transform">
          Menu Items:{" "}
          {RestaurantRoute.useSearch()
            .category.replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
      </div>
      <div className="gap-4 grid grid-cols-4 mt-2">
        {foods
          .filter((food) => food.foodCategory === category)
          .map((food, index) => (
            <Dialog
              key={index}
              open={openDialogIndex === index}
              onOpenChange={(isOpen) => {
                setOpenDialogIndex(isOpen ? index : null);
              }}
            >
              <AnimatePresence>
                <motion.div
                  layout
                  key={food.foodId}
                  onLayoutAnimationComplete={() => {
                    if (isDeleting === true) {
                      controls.start("start");
                    }
                  }}
                  onClick={() => setOpenDialogIndex(index)} // Add this line
                >
                  <MenuCard
                    foodId={food.foodId}
                    foodName={food.foodName}
                    foodPhoto={food.foodPhoto as string}
                    foodPrice={food.foodPrice}
                    isDeleting={isDeleting}
                    setFoods={setFoods}
                    controls={controls}
                    i={index}
                  />
                </motion.div>
              </AnimatePresence>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Food Item</DialogTitle>
                  <DialogDescription>Edit the food item here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <Formik
                  initialValues={{
                    foodId: food.foodId,
                    foodName: food.foodName,
                    foodCategory: food.foodCategory,
                    foodPrice: food.foodPrice,
                    foodPhoto: food.foodPhoto,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    editFoodItemsMutation.mutate(values);
                  }}
                >
                  {(formik) => (
                    <Form>
                      <div className="gap-4 grid py-2">
                        <div className="items-center gap-4 grid grid-cols-4">
                          <Label htmlFor="foodName" className="text-right">
                            Food Name
                          </Label>
                          <div className="relative col-span-3">
                            {formik.touched.foodName && formik.errors.foodName ? (
                              <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                                {formik.errors.foodName}
                              </div>
                            ) : null}
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
                      </div>
                      <div className="gap-4 grid py-2">
                        <div className="items-center gap-4 grid grid-cols-4">
                          <Label htmlFor="foodCategory" className="text-right">
                            Category
                          </Label>
                          <div className="relative col-span-3">
                            {formik.touched.foodCategory && formik.errors.foodCategory ? (
                              <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                                {formik.errors.foodCategory}
                              </div>
                            ) : null}
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
                      </div>

                      <div className="gap-4 grid py-2">
                        <div className="items-center gap-4 grid grid-cols-4">
                          <Label htmlFor="foodPrice" className="text-right">
                            Food Price
                          </Label>
                          <div className="relative col-span-3">
                            {formik.touched.foodPrice && formik.errors.foodPrice ? (
                              <div className="top-0 absolute bg-white p-1 border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                                {formik.errors.foodPrice}
                              </div>
                            ) : null}
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
                      </div>

                      <div className="gap-4 grid py-2">
                        <div className="items-center gap-4 grid grid-cols-4">
                          <Label htmlFor="foodPhoto" className="text-right">
                            Food Photo
                          </Label>
                          <div className="relative col-span-3">
                            {formik.touched.foodPhoto && formik.errors.foodPhoto ? (
                              <div className="top-0 absolute bg-white border border-red-400 rounded text-red-500 text-xs -translate-y-full transform">
                                {formik.errors.foodPhoto}
                              </div>
                            ) : null}
                            <Input
                              id="foodPhoto"
                              name="foodPhoto"
                              type="file"
                              className="w-full"
                              onChange={(event) => {
                                formik.setFieldValue("foodPhoto", event.currentTarget.files?.[0] || "");
                              }}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button className="text-white" type="submit" onClick={() => setOpenDialogIndex(null)}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          ))}
      </div>

      <MenuDock route={"restaurant"} />
    </div>
  );
}
