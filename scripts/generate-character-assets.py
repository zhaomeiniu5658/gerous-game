from pathlib import Path
import json
root=Path('public/characters/source')
chars=[];items=[]
skins=['#f2c8a6','#e5b18b','#ecc1a4','#f5d4bd','#e8b797','#d4a17d']
head_defs=[('male_01','小卷','male','柔和圆脸','蓬松短发'),('male_02','阿拓','male','方圆脸','侧分短发'),('male_03','小宇','male','修长脸','微卷短发'),('female_01','小桃','female','鹅蛋脸','齐肩短发'),('female_02','小岚','female','圆脸','长发'),('female_03','小夏','female','心形脸','高马尾')]
def svg(name,body):
 text='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1600"><defs><linearGradient id="skin" x2=".8" y2="1"><stop stop-color="SKINLIGHT"/><stop offset="1" stop-color="SKINDARK"/></linearGradient><linearGradient id="fabric" x2=".8" y2="1"><stop stop-color="COLORLIGHT"/><stop offset="1" stop-color="COLORDARK"/></linearGradient><linearGradient id="shine" x2=".9" y2="1"><stop stop-color="#ffffff" stop-opacity=".65"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><radialGradient id="eye"><stop stop-color="#785443"/><stop offset=".6" stop-color="#493228"/><stop offset="1" stop-color="#231e29"/></radialGradient></defs>'+body+'</svg>'
 for identifier in ['skin','fabric','shine','eye']:
  text=text.replace('id="'+identifier+'"','id="'+name+'-'+identifier+'"').replace('url(#'+identifier+')','url(#'+name+'-'+identifier+')')
 root.joinpath(name+'.svg').write_text(text)
def write(name,body,light='#f2c8a6',dark='#d49d79',cl='#b3cee8',cd='#7699c5'):
 svg(name,body)
 root.joinpath(name+'.svg').write_text(root.joinpath(name+'.svg').read_text().replace('SKINLIGHT',light).replace('SKINDARK',dark).replace('COLORLIGHT',cl).replace('COLORDARK',cd))
# All body rigs share anchors. Neutral underlayers are covered by every top/bottom.
for i,(cid,name,sex,face,hair) in enumerate(head_defs):
 skin=skins[i]
 write(cid+'-body','''<ellipse cx="500" cy="1490" rx="230" ry="35" fill="#7490ad" opacity=".15"/><path d="M400 1030L465 1025L461 1390Q440 1440 398 1390Z M535 1025L600 1030L602 1390Q560 1440 539 1390Z" fill="url(#skin)" stroke="#ae866e" stroke-width="7"/><path d="M335 780Q302 800 293 975L285 1090Q280 1140 322 1142Q347 1140 352 1110L365 875 M665 780Q698 800 707 975L715 1090Q720 1140 678 1142Q653 1140 648 1110L635 875" fill="url(#skin)" stroke="#ae866e" stroke-width="7"/><path d="M448 635L552 635L568 734L432 734Z" fill="url(#skin)"/><path d="M362 754Q420 705 500 705Q580 705 638 754L647 1038Q500 1080 353 1038Z" fill="url(#skin)" stroke="#ad8872" stroke-width="6"/><path d="M377 762Q500 730 623 762L630 985Q500 1010 370 985Z" fill="#eeeef4"/><path d="M365 994L635 994L608 1080L505 1090L500 1050L495 1090L392 1080Z" fill="#d9e2ed"/>''',skin,'#cf9c7e')
 w=[260,275,238,250,270,240][i];chin=[660,635,670,665,645,665][i]
 head=f'<path d="M{500-w} 350Q{500-w-8} 125 500 125Q{500+w+8} 125 {500+w} 350L{500+w-10} 478Q{500+w-40} 610 500 {chin}Q{500-w+40} 610 {500-w+10} 478Z" fill="url(#skin)" stroke="#b7886b" stroke-width="6"/>'
 head+='''<ellipse cx="239" cy="429" rx="33" ry="56" fill="url(#skin)"/><ellipse cx="761" cy="429" rx="33" ry="56" fill="url(#skin)"/><path d="M345 350Q380 330 415 349M585 349Q620 330 655 350" stroke="#594238" stroke-width="13" fill="none" stroke-linecap="round"/>'''
 for x in [386,614]:
  head+=f'<ellipse cx="{x}" cy="425" rx="57" ry="75" fill="#fffdfb" stroke="#b7856b" stroke-width="4"/><ellipse cx="{x+5}" cy="437" rx="38" ry="58" fill="url(#eye)"/><ellipse cx="{x+12}" cy="418" rx="15" ry="20" fill="white"/><circle cx="{x-9}" cy="453" r="7" fill="white" opacity=".6"/>'
 if sex=='female':head+='<path d="M332 385L312 365M668 385L688 365" stroke="#4c3634" stroke-width="10" stroke-linecap="round"/>'
 head+='''<ellipse cx="320" cy="510" rx="48" ry="21" fill="#ec9e98" opacity=".36"/><ellipse cx="680" cy="510" rx="48" ry="21" fill="#ec9e98" opacity=".36"/><path d="M490 478Q475 508 508 507" stroke="#c48c70" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M461 552Q500 584 539 552" stroke="#a5695b" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M280 283Q280 176 420 157" stroke="#fff2e3" stroke-width="18" fill="none" stroke-linecap="round" opacity=".3"/>'''
 write(cid+'-head',head,skin,'#d6a487')
 defaults={'hair':'hair_'+str(i+1).zfill(2),'top':'top_shirt' if sex=='male' else 'top_tee','bottom':'bottom_trousers','shoes':'shoes_sneakers','hat':None,'accessory':None,'weapon':None}
 chars.append({'characterId':cid,'name':name,'gender':sex,'face':face,'hairstyle':hair,'skin':skin,'baseAsset':'/characters/source/'+cid+'-body.svg','headAsset':'/characters/source/'+cid+'-head.svg','defaultEquipped':defaults,'baseStats':{'attack':320,'defense':0,'health':100}})
# Interchangeable hair pieces, all independent of face/body.
hairpaths=[
'M240 370L190 270L245 235L210 160L310 170L350 90L430 145L505 75L575 125L680 95L700 180L790 215L750 320L757 400L686 285L615 330L543 245L456 320L369 260L282 398Z',
'M242 380Q160 125 430 112Q620 78 739 221L762 379L710 307L650 210Q466 343 308 285L267 403Z',
'M240 393Q148 304 215 213Q177 117 324 133Q350 34 460 119Q530 54 625 125Q729 107 755 209Q824 264 748 395L677 293L618 319L563 264L470 331L389 284L295 405Z',
'M250 530Q160 241 292 151Q500 23 705 179Q830 349 745 582L701 512L686 291Q548 320 482 214Q402 326 299 299L296 529Z',
'M220 500Q168 162 345 115Q630 5 764 192Q821 310 773 728L703 722L700 330Q520 380 447 208Q377 313 288 321L304 719L218 728Z',
'M266 382Q176 278 258 164Q470 42 674 164Q765 242 732 407L662 267Q495 361 402 241L301 404Z M645 172Q806 42 821 200Q880 380 734 596L704 521Q796 362 730 258Z']
for i,d in enumerate(hairpaths):
 color=[('#555264','#24283b'),('#68594d','#342d2b'),('#686175','#353341'),('#a4785c','#664134'),('#69607a','#373245'),('#986246','#523525')][i]
 write('hair_'+str(i+1).zfill(2),f'<path d="{d}" fill="url(#fabric)" stroke="{color[1]}" stroke-width="8" stroke-linejoin="round"/><path d="M290 230Q410 124 568 174" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="20" stroke-linecap="round"/>',cl=color[0],cd=color[1])
 items.append({'itemId':'hair_'+str(i+1).zfill(2),'name':['蓬松短发','侧分短发','微卷短发','齐肩短发','柔顺长发','高马尾'][i],'category':'hair','asset':'/characters/source/hair_'+str(i+1).zfill(2)+'.svg','price':0,'layer':80,'stats':{'attack':0,'defense':0,'health':0}})
def item(id,name,cat,body,price,layer,attack=0,defense=0,health=0,colors=('#d5e9fb','#85afda')):
 write(id,body,cl=colors[0],cd=colors[1]);items.append({'itemId':id,'name':name,'category':cat,'asset':'/characters/source/'+id+'.svg','price':price,'layer':layer,'stats':{'attack':attack,'defense':defense,'health':health}})
torso='M354 750Q412 703 440 694Q500 730 560 694Q588 703 646 750L662 1046Q500 1091 338 1046Z'
tee='<path d="M354 750L293 787L314 904L367 886M646 750L707 787L686 904L633 886" fill="url(#fabric)" stroke="#739aba" stroke-width="6"/>'
base=f'<path d="{torso}" fill="url(#fabric)" stroke="#739aba" stroke-width="6"/><path d="M440 702Q500 763 560 702" stroke="#fff" stroke-opacity=".8" stroke-width="15" fill="none"/>'
item('top_tee','奶油 T 恤','top',tee+base+'<path d="M463 817h74v74h-74Z" fill="#fff" opacity=".5"/><path d="M373 768Q400 749 423 749" stroke="#fff" opacity=".4" stroke-width="12" fill="none"/>',0,50,colors=('#fff0d1','#dcccae'))
item('top_shirt','职场衬衫','top',tee+base+'<path d="M440 695L500 770L470 805L408 732Z M560 695L500 770L530 805L592 732Z" fill="#f9fcff" stroke="#99b3c9" stroke-width="4"/><path d="M500 777v270" stroke="#9bb5cd" stroke-width="4"/><path d="M537 832h58v58h-58" fill="#fff" opacity=".5"/>'+''.join(f'<circle cx="500" cy="{y}" r="5" fill="#7995b1"/>' for y in [820,890,960]),0,50)
longsleeve='<path d="M357 758Q313 752 303 840L285 1055L344 1065L373 847 M643 758Q687 752 697 840L715 1055L656 1065L627 847" fill="url(#fabric)" stroke="#7d91a9" stroke-width="7"/>'
item('top_hoodie','蓝莓卫衣','top',longsleeve+base+'<path d="M440 696Q500 778 560 696Q555 797 500 817Q445 797 440 696Z" fill="#dce8fb" stroke="#7897c3" stroke-width="5"/><path d="M477 791v72M523 791v72M409 951Q500 1000 591 951" fill="none" stroke="#8ba6cb" stroke-width="9" stroke-linecap="round"/>',250,50,defense=6,colors=('#b8cdeb','#7498c8'))
item('top_coat','焦糖外套','top',longsleeve+base+'<path d="M441 699L496 812L443 864L383 750Z M559 699L504 812L557 864L617 750Z" fill="#ead6ba" stroke="#a08465" stroke-width="5"/><path d="M500 810v244M388 924h64M548 924h64" stroke="#97785c" stroke-width="7"/><circle cx="503" cy="936" r="9" fill="#7e6554"/>',400,50,defense=10,health=5,colors=('#ddc39e','#af906b'))
item('bottom_trousers','深蓝长裤','bottom','<path d="M351 1014Q500 1052 649 1014L621 1396L539 1396L500 1120L461 1396L379 1396Z" fill="url(#fabric)" stroke="#42576d" stroke-width="7"/><path d="M358 1050Q500 1080 642 1050M405 1084L429 1131M595 1084L571 1131" fill="none" stroke="#829db7" stroke-width="6"/>',0,40,colors=('#65829e','#35485e'))
item('bottom_shorts','休闲短裤','bottom','<path d="M351 1014Q500 1052 649 1014L629 1210L533 1210L500 1118L467 1210L371 1210Z" fill="url(#fabric)" stroke="#738f85" stroke-width="7"/><path d="M364 1051Q500 1080 636 1051" stroke="#b1cdbf" stroke-width="8" fill="none"/>',120,40,defense=3,colors=('#bfd9ce','#8bad9e'))
item('bottom_skirt','百褶裙','bottom','<path d="M351 1013Q500 1049 649 1013L707 1230Q500 1307 293 1230Z" fill="url(#fabric)" stroke="#7c7297" stroke-width="7"/><path d="M397 1044L366 1249M458 1054L444 1266M542 1054L556 1266M603 1044L634 1249" stroke="#b3a8cb" stroke-width="10" fill="none"/>',180,40,defense=4,colors=('#d1c7e8','#a193bd'))
shoe='<path d="M369 1370L464 1370L467 1443L478 1470Q410 1510 333 1483L333 1448Z M536 1370L631 1370L667 1448L667 1483Q590 1510 522 1470L533 1443Z" fill="url(#fabric)" stroke="#748fa8" stroke-width="6"/>'
item('shoes_sneakers','云朵运动鞋','shoes',shoe+'<path d="M337 1465Q410 1486 475 1464M525 1464Q590 1486 663 1465M390 1403h43M394 1421h42M567 1403h43M564 1421h42" stroke="#fff" stroke-width="11" fill="none" stroke-linecap="round"/>',0,45,colors=('#fcfdff','#cad9e8'))
item('shoes_leather','经典皮鞋','shoes',shoe+'<path d="M337 1473Q410 1496 473 1473M527 1473Q590 1496 663 1473" stroke="#3c3533" stroke-width="11" fill="none"/>',150,45,defense=4,colors=('#977e66','#4f4036'))
item('hat_cap','棒球帽','hat','<path d="M259 244Q259 58 504 58Q710 77 747 258Q496 220 259 244Z" fill="url(#fabric)" stroke="#4b789b" stroke-width="7"/><path d="M269 234Q500 207 738 250L773 298Q570 327 368 302Z" fill="#7eacc9" stroke="#4b789b" stroke-width="7"/><path d="M500 70v156" stroke="#d0e6f4" stroke-width="5"/>',100,100,defense=2,colors=('#bcd8e9','#6e9eba'))
item('hat_beanie','暖冬针织帽','hat','<path d="M246 280Q224 81 500 64Q772 81 754 280Z" fill="url(#fabric)" stroke="#a88b7b" stroke-width="7"/><path d="M245 244Q500 210 755 244L751 320Q500 290 249 320Z" fill="#e1c9bb" stroke="#a88b7b" stroke-width="6"/>'+''.join(f'<path d="M{x} 115v126" stroke="#c8aea1" stroke-width="10"/>' for x in [340,420,500,580,660]),140,100,defense=3,health=3,colors=('#ebd6c6','#c2a492'))
item('accessory_glasses','轻盈圆框眼镜','accessory','<circle cx="386" cy="420" r="81" fill="#eef6ff" fill-opacity=".12" stroke="#596a81" stroke-width="14"/><circle cx="614" cy="420" r="81" fill="#eef6ff" fill-opacity=".12" stroke="#596a81" stroke-width="14"/><path d="M467 416Q500 396 533 416M305 407L251 389M695 407L749 389" stroke="#596a81" stroke-width="13" fill="none"/>',120,110,defense=2)
item('accessory_bag','职场小背包','accessory','<path d="M637 743Q798 722 794 844L790 1107Q729 1167 658 1109Z" fill="url(#fabric)" stroke="#9c7b64" stroke-width="7"/><path d="M674 921h78v131h-78Z" fill="#cfac8b" stroke="#9c7b64" stroke-width="5"/><path d="M637 752Q587 759 615 944" fill="none" stroke="#95765f" stroke-width="17"/>',200,20,defense=5,health=5,colors=('#e2cbb2','#b89471'))
item('weapon_gloves','训练拳套','weapon','<path d="M652 1040Q634 961 690 954Q744 948 769 1017L760 1110Q713 1170 663 1112Z" fill="url(#fabric)" stroke="#9a555c" stroke-width="7"/><path d="M652 1098L762 1098L752 1147L662 1147Z" fill="#f3d7d6" stroke="#9a555c" stroke-width="5"/><path d="M675 979Q716 963 737 1000" fill="none" stroke="#fff" opacity=".4" stroke-width="13"/>',200,90,attack=15,colors=('#efb4b6','#c5777e'))
item('weapon_staff','练习木棍','weapon','<path d="M700 810L718 807L771 1439Q758 1459 743 1443Z" fill="url(#fabric)" stroke="#967351" stroke-width="6"/><path d="M716 965L733 1109" stroke="#b69a7e" stroke-width="27"/>',300,90,attack=25,colors=('#dac39d','#af8b62'))
item('weapon_sword','星光训练剑','weapon','<path d="M686 1070L683 625L718 554L748 626L738 1070Z" fill="url(#fabric)" stroke="#809ab1" stroke-width="7"/><path d="M718 592L718 1069" stroke="#fff" stroke-width="8"/><path d="M651 1071L775 1071L775 1100L651 1100Z" fill="#d5b278" stroke="#aa8856" stroke-width="5"/><path d="M699 1100h30v147h-30Z" fill="#a3b5ce" stroke="#768ba9" stroke-width="6"/>',500,90,attack=40,colors=('#fffaff','#bacce2'))
for it in items:
 it.update({'compatibleCharacters':[c['characterId'] for c in chars],'unlockCondition':'none','anchor':{'x':0,'y':0},'offset':{'x':0,'y':0},'adaptations':{}})
catalog={'schemaVersion':1,'canvas':{'width':1000,'height':1600},'defaultCharacterId':'male_01','categories':[{'id':k,'name':v} for k,v in [('hair','发型'),('top','上衣'),('bottom','下装'),('shoes','鞋子'),('hat','帽子'),('accessory','配饰'),('weapon','武器')]],'characters':chars,'items':items}
Path('shared/characters.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
