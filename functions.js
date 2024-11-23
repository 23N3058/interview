gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray("section");

sections.forEach(section => {
  const image = section.querySelector(".img");
  const interviewImage = section.querySelector(".interview-image");
  const qaPairs = section.querySelectorAll(".qa-pair");
        
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      start: "top top",
      end: "+=1200"
    }
  });
  
  // 初期状態を設定
  gsap.set(interviewImage, {
    opacity: 0,
    x: -30
  });
  
  // 背景のアニメーション
  tl.to(image, {
    scale: 1,
    duration: 1,
    ease: "power2.inOut"
  });

  // インタビュー画像のアニメーション
  tl.to(interviewImage, {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.5"); // 背景アニメーションと少し重ねる

  // 各Q&Aペアのアニメーション
  qaPairs.forEach((pair, index) => {
    tl.to(pair, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    }, `-=${index > 0 ? 0.3 : 0}`);
  });

  // フェードアウト（逆順）
  [...qaPairs].reverse().forEach((pair, index) => {
    tl.to(pair, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in"
    }, `-=${index > 0 ? 0.2 : 0}`);
  });

  // インタビュー画像のフェードアウト
  tl.to(interviewImage, {
    opacity: 0,
    x: -30,
    duration: 0.3,
    ease: "power2.in"
  }, "-=0.3");
});

gsap.fromTo(
  ".title",
  { opacity: 0, scale: 0.5, y: -50, rotateX: 45 },
  {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    duration: 4,
    ease: "power4.out",
  }
);

gsap.fromTo(
  ".subtitle",
  { opacity: 0, y: 50, scale: 0.5 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.5,
    delay: 2, // タイトルが完了してから開始
    ease: "power2.out",
  }
);