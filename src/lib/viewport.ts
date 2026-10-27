/**
 * A steady viewport height for in-app browsers.
 *
 * Safari and Chrome keep `svh` fixed while their toolbars slide away, but the
 * Instagram, Facebook and TikTok browsers resize the whole web view instead,
 * so every `svh` height on the page changes mid-scroll: the hero reflows in
 * the middle of its zoom and everything below it jumps.
 *
 * This script runs in <head> before first paint. It measures 100svh once and
 * writes it to `--svh` (one percent, like the unit), and the stylesheets use
 * `calc(var(--svh, 1svh) * N)` in place of `Nsvh`. On touch screens it only
 * measures again when the width changes (rotation, split view), so toolbar
 * and keyboard resizes are ignored, the same rule as ScrollTrigger's
 * ignoreMobileResize. Desktop windows re-measure on every resize. In Safari
 * and Chrome the value is the same as plain svh, so nothing changes there.
 *
 * The same pass writes `--lvh`, for the homepage hero, which has to reach the
 * bottom of the screen behind Safari's toolbar. It is the largest of 100lvh,
 * 100svh and the window's height: on an iPhone (Oct 2026) 100svh came out
 * about 90px short of the space above an expanded toolbar, and the next
 * section showed under the hero.
 *
 * The values go in their own <style> tag rather than on <html>, so React
 * hydration never sees a style attribute it didn't render.
 */
export const STEADY_VH_SCRIPT = `(function(){
var d=document,w=-1,tag=d.createElement('style');
d.head.appendChild(tag);
function probe(u){
var p=d.createElement('div');
p.style.cssText='position:absolute;top:0;left:0;width:0;height:100'+u+';visibility:hidden;pointer-events:none';
d.documentElement.appendChild(p);
var h=p.offsetHeight;
p.remove();
return h;
}
function set(){
var ih=window.innerHeight,h=probe('svh')||ih,l=Math.max(probe('lvh'),h,ih);
w=window.innerWidth;
tag.textContent=':root{--svh:'+(h/100)+'px;--lvh:'+(l/100)+'px}';
}
set();
var touch=window.matchMedia('(pointer: coarse)').matches;
window.addEventListener('resize',function(){if(touch&&window.innerWidth===w)return;set();});
})();`;

/** 100svh in px as the stylesheets see it (see STEADY_VH_SCRIPT). */
export function steadyVh(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--svh"));
  return v > 0 ? v * 100 : window.innerHeight;
}

/** The hero's height in px, 100 * --lvh (see STEADY_VH_SCRIPT). */
export function steadyLvh(): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lvh"));
  return v > 0 ? v * 100 : window.innerHeight;
}
