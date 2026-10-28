// Motor de diapositivas: flechas o espacio = avanzar, F = pantalla completa, T o 💡 = tip con más teoría.
(function () {
  const lienzo = document.getElementById("lienzo");
  const diapos = [...lienzo.querySelectorAll(".diapo")];
  const barra = document.getElementById("barra");
  const contador = document.getElementById("contador");
  const panel = document.getElementById("panel-tip");
  const botonTip = document.getElementById("btn-tip");
  let i = 0;

  function ajustar() {
    const alto = panel.classList.contains("visible") ? panel.offsetHeight : 0;
    const escala = Math.min(window.innerWidth / 1600, (window.innerHeight - alto) / 900);
    lienzo.style.transform = `scale(${escala})`;
    document.getElementById("escenario").style.bottom = alto + "px";
  }

  function ir(n) {
    i = Math.max(0, Math.min(diapos.length - 1, n));
    diapos.forEach((d, k) => d.classList.toggle("activa", k === i));
    barra.style.width = ((i + 1) / diapos.length) * 100 + "%";
    contador.textContent = `${i + 1} / ${diapos.length}`;
    const tip = diapos[i].querySelector("aside.tip");
    botonTip.classList.toggle("oculto", !tip);
    panel.innerHTML = tip ? `<b>💡 Tip</b><p>${tip.innerHTML}</p><button id="cerrar-tip" aria-label="Cerrar tip">✕</button>` : "";
    if (!tip) panel.classList.remove("visible");
    const cerrar = document.getElementById("cerrar-tip");
    if (cerrar) cerrar.onclick = alternarTip;
    history.replaceState(null, "", "#" + (i + 1));
    ajustar();
  }

  function pantallaCompleta() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  }
  function alternarTip() {
    if (botonTip.classList.contains("oculto")) return;
    panel.classList.toggle("visible");
    ajustar();
  }

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); ir(i + 1); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); ir(i - 1); }
    else if (e.key === "Home") ir(0);
    else if (e.key === "End") ir(diapos.length - 1);
    else if (e.key === "f" || e.key === "F") pantallaCompleta();
    else if (e.key === "t" || e.key === "T") alternarTip();
    else if (e.key === "Escape" && panel.classList.contains("visible")) alternarTip();
  });
  let x0 = null;
  document.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; });
  document.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  document.getElementById("ant").onclick = () => ir(i - 1);
  document.getElementById("sig").onclick = () => ir(i + 1);
  document.getElementById("btn-full").onclick = pantallaCompleta;
  botonTip.onclick = alternarTip;
  window.addEventListener("resize", ajustar);

  const inicial = parseInt(location.hash.slice(1), 10);
  ir(Number.isFinite(inicial) ? inicial - 1 : 0);
})();
