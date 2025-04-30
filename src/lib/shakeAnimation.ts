export const getRandomTransformOrigin = () => {
	const value = (16 + 40 * Math.random()) / 100;
	const value2 = (15 + 36 * Math.random()) / 100;
	return {
		originX: value,
		originY: value2,
	};
};

export const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

export const randomDuration = () => Math.random() * 0.07 + 0.23;

export const variants = {
	start: (i: number) => ({
		rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
		transition: {
			delay: getRandomDelay(),
			repeat: Number.POSITIVE_INFINITY,
			duration: randomDuration(),
		},
	}),
	reset: {
		rotate: 0,
		transition: {
			duration: 0.5,
		},
	},
	exit: {
		rotate: 0,
		transition: {
			duration: 0.5, // You can adjust this duration as needed
		},
	},
};
