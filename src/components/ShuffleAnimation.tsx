import BackSVG from "./BackSVG";

export default function shuffleAnimation() {

    const shuffleAnimation = (i: number) => ({
        x: [0, 75, -75, 50, 0],
        y: [0, 10, -10, 5, -15, 0],
        rotate: [0, 10, -5, 20, 0],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.1,
          repeatDelay: 1.6
        },
    });

    return (
        Array(16).fill(null).map((_, index) => (
            <BackSVG
              key={index}
              animate={shuffleAnimation(index)}
            />
        ))
    )
}