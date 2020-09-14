const animatedItems = Array.from(document.querySelectorAll(".animated"));

let tl1, tl2, tl3;

animatedItems.map((animatedItem) => {
  const userName = Array.from(
    animatedItem.querySelector(".user-name").querySelectorAll("rect")
  );
  const messageLeft = Array.from(
    animatedItem.querySelector(".message-left").querySelectorAll("rect")
  );
  const messageRight = Array.from(
    animatedItem.querySelector(".message-right").querySelectorAll("rect")
  );

  tl1 = gsap.timeline({
    repeat: -1,
    delay: rand(0, 3),
    repeatDelay: rand(1, 5)
  });

  tl1
    .from(userName, { duration: 0.4, y: 5, opacity: 0 })
    .from(messageLeft, {
      duration: 0.6,
      scaleX: -1.2,
      opacity: 0,
      stagger: 0.1
    })
    .from(messageRight, {
      duration: 0.4,
      scaleX: 1.2,
      opacity: 0,
      stagger: 0.1
    });
});

function rand(from, to) {
  return gsap.utils.random(from, to, 0.1);
}
