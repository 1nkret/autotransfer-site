document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const images = [
    "static/img/truck.jpg",
    "static/img/truck1.jpg",
    "static/img/truck2.jpg",
    "static/img/truck3.jpg"
  ];

  const slider = document.createElement("div");
  slider.className = "hero-slider";
  hero.prepend(slider);

  for (let i = 0; i < images.length * 2; i++) {
    const img = document.createElement("img");
    img.src = images[i % images.length];
    img.alt = "background";
    slider.appendChild(img);
  }

  Object.assign(slider.style, {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    width: "max-content",
    height: "100%",
    zIndex: 0,
    filter: "brightness(0.6)",
    transition: "none"
  });

  hero.style.position = "relative";
  hero.style.overflow = "hidden";

  const imgs = slider.querySelectorAll("img");
  imgs.forEach(img => {
    img.style.height = "100%";
    img.style.width = "auto";
    img.style.flexShrink = "0";
    img.style.marginRight = "2px";
    img.style.objectFit = "cover";
  });

  let offset = 0;
  const speed = 0.3; 

  function animate() {
    offset -= speed;
    if (Math.abs(offset) >= slider.scrollWidth / 2) offset = 0;
    slider.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});