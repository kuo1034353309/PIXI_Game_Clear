const globalItemData = [
    {
        name:"icon1",
        radius:50>>1,
        color:"e37b0d"
    },
    {
       name:"icon2",
       radius:111>>1,
       color:"efef11"
   },
   {
       name:"icon3",
       radius:141>>1,
       color:"cea2eb"
   }
   ,
   {
       name:"icon4",
       radius:160>>1,
       color:"26d826"
   }
   ,
   {
       name:"icon5",
       radius:169>>1,
       color:"c5a5a5"
   }
   ,
   {
       name:"icon6",
       radius:198>>1,
       color:"e01717"
   }
   ,
   {
       name:"icon7",
       radius:240>>1,
       color:"dc13dc"
   }
   ,
   {
       name:"icon8",
       radius:271>>1,
       color:"1ae01a"
   },
   {
       name:"icon9",
       radius:305>>1,
       color:"e7971e"
   },
   {
       name:"icon10",
       radius:460>>1,
       color:"ffff00"
   }
];

const StageWidth = 750;
const StageHeight = 1624;
const StageMinHeight = 1334;
const StageMaxScale = 750/StageMinHeight;
const StageMinScale = 750/StageHeight;

const SafeLineY = 300//800//300;
const ShowSafeLineY = 500//1000//500;
const EndStatesTime = 2000; //有一个body持续超过结束线两秒就gg