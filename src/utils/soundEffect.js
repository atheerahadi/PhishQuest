export function playCorrectSound() {

  const sound = new Audio(
    "/sounds/correct.mp3"
  );

  sound.volume = 0.8;

  sound.play().catch((error) => {

    console.error(
      "Correct sound error:",
      error
    );

  });

}


export function playWrongSound() {

  const sound = new Audio(
    "/sounds/wrong.mp3"
  );

  sound.volume = 0.8;

  sound.play().catch((error) => {

    console.error(
      "Wrong sound error:",
      error
    );

  });

}