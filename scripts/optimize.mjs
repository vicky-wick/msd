import sharp from 'sharp'; import fs from 'fs'; import path from 'path';
const src='../devanshu-media-2026-10-27', out='public/media/img';
const map={
 'DSC00633.JPG':'food-paneer','DSC00899.JPG':'food-dessert','DSC03591.JPG':'food-mocktail','DSC03676.JPG':'food-burger','DSC04334.JPG':'food-kebab',
 'gosht ka shawarma + chilli garlic sauce.JPG':'food-shawarma','kolkata style chicken dum biryani.JPG':'food-biryani',
 'DSC02590.JPG':'bridal-1','DSC02611.JPG':'bridal-2','DSC02615.JPG':'bridal-3',
 'IMG20250915171514.jpg':'prewed-1','IMG20250915173352.jpg':'prewed-2','IMG20250915173524.jpg':'prewed-3',
 'DSC09414.JPG':'event-dj-1','DSC09415.JPG':'event-dj-2','DSC09432.JPG':'event-singer-1','DSC09433.JPG':'event-singer-2','DSC09445.JPG':'event-stage','DSC09460.JPG':'event-glow','DSC09466.JPG':'event-crowd','DSC09477.JPG':'event-haus',
 'IMG-20260725-WA0036.jpg':'pageant-1','IMG-20260725-WA0057.jpg':'pageant-2',
 'IMG_1546.jpg':'model-1','IMG_1547.jpg':'model-2','IMG_1548.jpg':'model-3','IMG_20251122_004145.jpg':'model-concert-1','IMG_20251122_004251.jpg':'model-concert-2',
 'IMG_0048.JPG':'silver-clutch','IMG_0148.JPG':'silver-vase','IMG_9504.JPG':'silver-peacocks','IMG_9517.JPG':'silver-horse','IMG_9569.JPG':'silver-temple','IMG_9641.JPG':'silver-swans','IMG_9776.JPG':'silver-peacock-lamp','IMG_9796.JPG':'silver-durga','IMG_9871.JPG':'silver-peacock','IMG_9978.JPG':'silver-shivling'
};
const meta={};
for (const [f,name] of Object.entries(map)){
  const p=path.join(src,f); const s=sharp(p).rotate();
  const m=await s.metadata();
  await sharp(p).rotate().resize({width:1800,withoutEnlargement:true}).webp({quality:78}).toFile(`${out}/${name}.webp`);
  await sharp(p).rotate().resize({width:700}).webp({quality:70}).toFile(`${out}/${name}-sm.webp`);
  const r=await sharp(`${out}/${name}-sm.webp`).metadata();
  meta[name]={w:r.width,h:r.height};
}
fs.writeFileSync('src/media-meta.json',JSON.stringify(meta,null,1));
console.log(Object.keys(meta).length);
