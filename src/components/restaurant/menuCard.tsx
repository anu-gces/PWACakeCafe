import DonutImage from "@/assets/donutImage";
import { getRandomTransformOrigin, variants } from "@/lib/shakeAnimation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { type AnimationControls, motion } from "motion/react";
import type { FoodItemProps } from "./restaurant";

type MenuCardProps = {
	foodId: string;
	foodName: string;
	foodPhoto?: React.FC<React.SVGProps<SVGSVGElement>> | string;
	foodPrice: number;
	isDeleting: boolean;
	setFoods: React.Dispatch<React.SetStateAction<FoodItemProps[]>>;
	controls: AnimationControls;
	i: number;
};

export function MenuCard({
	foodId,
	foodName,
	foodPhoto,
	foodPrice,
	isDeleting,
	setFoods,
	controls,
	i,
}: MenuCardProps) {
	return (
		<>
			<motion.div
				style={{ ...getRandomTransformOrigin() }}
				variants={variants}
				animate={controls}
				custom={i}
				className=""
			>
				<div className="after:absolute relative after:inset-0 bg-background after:bg-black after:opacity-0 hover:after:opacity-50 after:rounded-tr-3xl after:rounded-bl-3xl after:content-[''] after:transition-all duration-500 ease-in-out">
					<X
						className={cn(
							"absolute top-0 right-0 m-2 cursor-pointer bg-white rounded-full p-1 transition-opacity duration-500 ease-in-out transition-visibility",
							{
								"opacity-100 visible z-10": isDeleting, //BRINGING THE X ICON HIGHER IN THE STACKING ORDER SO IT CAN BE CLICKED
								"opacity-0 invisible": !isDeleting,
							},
						)}
						onClick={(event) => {
							event.stopPropagation();
							setFoods((prevFoods) =>
								prevFoods.filter((food) => food.foodId !== foodId),
							);
						}}
					/>

					{typeof foodPhoto === "string" ? (
						<img
							alt={foodName}
							src={foodPhoto}
							className="z-10 rounded-tr-3xl rounded-bl-3xl w-full h-40 sm:h-56 lg:h-64 object-cover"
						/>
					) : (
						<div className="flex items-center border rounded-tr-3xl rounded-bl-3xl sm:h-56 lg:h-64 object-cover">
							<DonutImage />
						</div>
					)}
					<div className="sm:flex sm:justify-center sm:items-center sm:gap-4 mt-4">
						<strong className="font-medium">{foodName}</strong>
						<span className="hidden sm:block sm:bg-primary sm:w-8 sm:h-px"></span>
						<p className="opacity-50 mt-0.5 sm:mt-0">Rs.{foodPrice}</p>
					</div>
				</div>
			</motion.div>
		</>
	);
}

export function MenuCardDummy({
	foodName,
	foodPhoto,
	foodPrice,
}: Omit<
	MenuCardProps,
	"foodId" | "controls" | "setFoods" | "isDeleting" | "i"
>) {
	return (
		<div className="relative bg-background">
			{typeof foodPhoto === "string" ? (
				<img
					alt={foodName}
					src={foodPhoto}
					className="rounded-tr-3xl rounded-bl-3xl w-full h-40 sm:h-56 lg:h-64 object-cover"
				/>
			) : (
				<div className="flex items-center border rounded-tr-3xl rounded-bl-3xl sm:h-56 lg:h-64 object-cover">
					<DonutImage />
				</div>
			)}
			<div className="sm:flex sm:justify-center sm:items-center sm:gap-4 mt-4">
				<strong className="font-medium">{foodName}</strong>
				<span className="hidden sm:block sm:bg-primary sm:w-8 sm:h-px"></span>
				<p className="opacity-50 mt-0.5 sm:mt-0">Rs.{foodPrice}</p>
			</div>
		</div>
	);
}
