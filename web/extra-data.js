const pinyin=[
['Nǐ jiào shénme míngzi?','Wǒ jiào Lín.','Wǒ hěn hǎo.'],
['Nǐ jǐ diǎn qǐchuáng?','Wǒ qī diǎn qǐchuáng.','Wǒ zài xuéxiào.'],
['Nǐ xiǎng chī shénme?','Wǒ xiǎng chī miàntiáo.','Wǒ xiǎng hē shuǐ.'],
['Zhōumò nǐ dǎsuàn zuò shénme?','Wǒ dǎsuàn kàn diànyǐng.','Wǒ zuótiān kàn diànyǐng le.'],
['Zhège duōshao qián?','Zhège èrshí kuài qián.','Wǒ èrshí suì.'],
['Nǐ zěnme qù xuéxiào?','Wǒ zuò gōnggòng qìchē qù.','Wǒ zài xuéxiào xuéxí.'],
['Jīntiān tiānqì zěnmeyàng?','Jīntiān hěn rè.','Jīntiān xīngqīyī.'],
['Nǐ xǐhuan zuò shénme?','Wǒ xǐhuan yóuyǒng.','Wǒ bú huì yóuyǒng.'],
['Nǐ zuótiān mǎi le shénme?','Wǒ zuótiān mǎi le shū.','Wǒ míngtiān qù mǎi shū.'],
['Wǒ bù shūfu, zěnme bàn?','Nǐ yīnggāi xiūxi.','Nǐ xǐhuan yīnyuè.'],
['Nǐ měitiān xuéxí Zhōngwén ma?','Wǒ měitiān xuéxí Zhōngwén.','Wǒ bù rènshi tā.']
];
const defaultLessons=originalTopics.map((t,i)=>({id:i+20,title:t[1],zh:t[0],icon:t[2],vocab:t[3].map(w=>({zh:w[0],py:w[1],th:w[2]})),question:{zh:t[4],py:pinyin[i][0],target:t[5]},answers:[{zh:t[6],py:pinyin[i][1]},{zh:t[7],py:pinyin[i][2]}],explanation:t[8],visible:i>0&&i<10,term:i>=1&&i<=5?'1':i>=6&&i<=9?'2':'extra',assignment:'',due:'',goal:'ฟังและเข้าใจคำศัพท์ แล้วเลือกประโยคที่สื่อความหมายได้ถูกต้อง',tokens:t[6].replace('。','').split(/(?<=我)|(?<=你)|(?<=他)|(?<=她)/u)}));
