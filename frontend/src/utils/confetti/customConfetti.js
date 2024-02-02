import confetti from 'canvas-confetti'

export const customConfetti = () => {
    confetti({
        particleCount: 250,
        spread: 150
      })

      setTimeout(() => {
        // Action to be performed after 2 seconds
        confetti({
            particleCount: 250,
            spread: 150
          })
      }, 2000);

      setTimeout(() => {
        // Action to be performed after 2 seconds
        confetti({
            particleCount: 250,
            spread: 150
          })
      }, 4000);
}