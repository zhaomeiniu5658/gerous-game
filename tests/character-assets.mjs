import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import catalog from '../shared/characters.json' with {type:'json'};
import {Resvg} from '@resvg/resvg-js';
const asset=async path=>{const text=await fs.readFile('public'+path,'utf8');assert.ok(text.includes('viewBox="0 0 1000 1600"'));assert.ok(!/SKINLIGHT|SKINDARK|COLORLIGHT|COLORDARK/.test(text));return 'data:image/svg+xml;base64,'+Buffer.from(text).toString('base64');};
let body='<rect width="3000" height="3200" fill="#f4f7fc"/>';
for(const [index,c]of catalog.characters.entries()){const x=index%3*1000,y=Math.floor(index/3)*1600;const eq={...c.defaultEquipped};if(index===1){eq.top='top_hoodie';eq.weapon='weapon_gloves';eq.hat='hat_cap';}if(index===4){eq.top='top_coat';eq.bottom='bottom_skirt';eq.shoes='shoes_leather';eq.weapon='weapon_sword';eq.accessory='accessory_glasses';}
const layers=[{asset:c.baseAsset,layer:10},{asset:c.headAsset,layer:75},...Object.values(eq).filter(Boolean).map(id=>catalog.items.find(i=>i.itemId===id))].sort((a,b)=>a.layer-b.layer);body+='<g transform="translate('+x+' '+y+')">';for(const layer of layers)body+='<image href="'+await asset(layer.asset)+'" width="1000" height="1600"/>';body+='<text x="500" y="1560" text-anchor="middle" font-family="sans-serif" font-size="35" fill="#6e84a0">'+c.characterId+'</text></g>';}
for(const i of catalog.items)await asset(i.asset);
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 3200" width="1500" height="1600">'+body+'</svg>';
await fs.writeFile('output/characters-layered-demo.png',new Resvg(svg).render().asPng());
console.log('PASS: all assets valid, six full-body assemblies rendered, clothing and weapons independent; output/characters-layered-demo.png');
